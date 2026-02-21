"use client";

import { useState } from "react";
import { Star, ShoppingCart, Package } from "lucide-react";
import { useCart } from "@/context/CartContext";

interface Props {
  product: any;
}

export default function ProductInfo({ product }: Props) {
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState(
    product.colors[0]?.value || "",
  );
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Please select a size");
      return;
    }

    addToCart({
      productId: product.id,
      title: product.title,
      price: product.price,
      image: product.images[0],
      size: selectedSize,
      color: selectedColor,
      quantity,
      maxStock: product.totalStock,
      sellerId: product.seller.id,
      sellerName: product.seller.name,
    });

    alert(`✅ Added to cart!`);
  };

  const handleOrderNow = () => {
    if (!selectedSize) {
      alert("Please select a size");
      return;
    }

    // Add to cart first
    addToCart({
      productId: product.id,
      title: product.title,
      price: product.price,
      image: product.images[0],
      size: selectedSize,
      color: selectedColor,
      quantity,
      maxStock: product.totalStock,
      sellerId: product.seller.id,
      sellerName: product.seller.name,
    });

    // Navigate to checkout
    window.location.href = "/checkout";
  };

  return (
    <div className="space-y-4">
      {/* Title & Rating */}
      <div>
        <p className="text-gray-600 text-xs mb-1">{product.brand}</p>
        <h1
          className="text-2xl font-bold mb-2"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          {product.title}
        </h1>
        <div className="flex items-center gap-3 text-sm">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="font-semibold">{product.rating}</span>
            <span className="text-gray-600">
              ({product.reviewCount} reviews)
            </span>
          </div>
          {product.sold > 0 && (
            <span className="text-gray-600">{product.sold} sold</span>
          )}
        </div>
      </div>

      {/* Price */}
      <div className="flex items-center gap-2">
        <span className="text-3xl font-bold">
          {product.price.toLocaleString()} ETB
        </span>
        {product.compareAtPrice && product.compareAtPrice > product.price && (
          <span className="text-lg text-gray-400 line-through">
            {product.compareAtPrice.toLocaleString()} ETB
          </span>
        )}
      </div>

      {/* Stock */}
      <div className="flex items-center gap-2 text-sm">
        <div
          className={`w-2 h-2 rounded-full ${product.inStock ? "bg-green-500" : "bg-red-500"}`}
        ></div>
        <span
          className={`font-medium ${product.inStock ? "text-green-600" : "text-red-600"}`}
        >
          {product.inStock
            ? `In Stock (${product.totalStock} available)`
            : "Out of Stock"}
        </span>
      </div>

      {/* Color Selection */}
      {product.colors.length > 0 && (
        <div>
          <h3 className="font-semibold mb-2 text-sm">
            Color:{" "}
            <span className="text-gray-600 font-normal">
              {product.colors.find((c: any) => c.value === selectedColor)
                ?.name || "Select"}
            </span>
          </h3>
          <div className="flex gap-2">
            {product.colors.map((color: any) => (
              <button
                key={color.value}
                onClick={() => setSelectedColor(color.value)}
                className={`w-10 h-10 rounded-full border-2 transition-all ${
                  selectedColor === color.value
                    ? "border-black scale-110"
                    : "border-gray-300"
                }`}
                style={{
                  backgroundColor: color.hex,
                  boxShadow:
                    color.hex === "#FFFFFF"
                      ? "inset 0 0 0 1px #e5e7eb"
                      : "none",
                }}
                title={color.name}
              />
            ))}
          </div>
        </div>
      )}

      {/* Size Selection */}
      {product.sizes.length > 0 && (
        <div>
          <h3 className="font-semibold mb-2 text-sm">
            Size:{" "}
            <span className="text-gray-600 font-normal">
              {selectedSize || "Select"}
            </span>
          </h3>
          <div className="flex gap-2 flex-wrap">
            {product.sizes.map((size: any) => (
              <button
                key={size.value}
                onClick={() => size.available && setSelectedSize(size.value)}
                disabled={!size.available}
                className={`px-5 py-2 rounded-full border-2 font-medium text-sm transition-all ${
                  selectedSize === size.value
                    ? "bg-black text-white border-black"
                    : size.available
                      ? "border-gray-300 hover:border-black"
                      : "border-gray-200 text-gray-300 cursor-not-allowed"
                }`}
              >
                {size.value}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity */}
      <div>
        <h3 className="font-semibold mb-2 text-sm">Quantity</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-8 h-8 border-2 border-gray-300 rounded-full hover:border-black font-bold"
          >
            -
          </button>
          <span className="text-lg font-semibold w-10 text-center">
            {quantity}
          </span>
          <button
            onClick={() =>
              setQuantity(Math.min(product.totalStock, quantity + 1))
            }
            className="w-8 h-8 border-2 border-gray-300 rounded-full hover:border-black font-bold"
          >
            +
          </button>
        </div>
      </div>

      {/* Buttons */}
      <div className="space-y-2">
        <button
          onClick={handleOrderNow}
          disabled={!product.inStock || !selectedSize}
          className="w-full bg-black text-white py-3 rounded-full font-semibold hover:bg-gray-800 flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          <Package size={18} />
          Order Now
        </button>
        <button
          onClick={handleAddToCart}
          disabled={!product.inStock || !selectedSize}
          className="w-full border-2 border-black py-3 rounded-full font-semibold hover:bg-gray-50 flex items-center justify-center gap-2 disabled:border-gray-300 disabled:text-gray-300 disabled:cursor-not-allowed"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          <ShoppingCart size={18} />
          Add to Cart
        </button>
      </div>
    </div>
  );
}
