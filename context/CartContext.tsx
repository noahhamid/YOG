"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface CartItem {
  id: string;
  productId: string;
  title: string;
  price: number;
  image: string;
  size: string;
  color: string;
  quantity: number;
  maxStock: number;
  sellerId: string;
  sellerName: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("yog_cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
    setIsLoaded(true);
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("yog_cart", JSON.stringify(cart));
    }
  }, [cart, isLoaded]);

  const addToCart = (
    item: Omit<CartItem, "quantity"> & { quantity?: number },
  ) => {
    setCart((prevCart) => {
      // Check if item with same product, size, and color already exists
      const existingItemIndex = prevCart.findIndex(
        (cartItem) =>
          cartItem.productId === item.productId &&
          cartItem.size === item.size &&
          cartItem.color === item.color,
      );

      if (existingItemIndex > -1) {
        // Update quantity of existing item
        const newCart = [...prevCart];
        const newQuantity =
          newCart[existingItemIndex].quantity + (item.quantity || 1);

        // Don't exceed max stock
        if (newQuantity <= item.maxStock) {
          newCart[existingItemIndex].quantity = newQuantity;
          return newCart;
        } else {
          alert(`Only ${item.maxStock} items available in stock`);
          return prevCart;
        }
      } else {
        // Add new item
        return [
          ...prevCart,
          {
            ...item,
            id: `${item.productId}-${item.size}-${item.color}`,
            quantity: item.quantity || 1,
          },
        ];
      }
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    setCart((prevCart) =>
      prevCart.map((item) => {
        if (item.id === id) {
          // Don't exceed max stock
          if (quantity <= item.maxStock && quantity > 0) {
            return { ...item, quantity };
          } else if (quantity > item.maxStock) {
            alert(`Only ${item.maxStock} items available in stock`);
            return item;
          }
        }
        return item;
      }),
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
