// prisma/seed.ts
// Run: npx ts-node --compiler-options '{"module":"CommonJS"}' prisma/seed.ts

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const IMAGES = {
  MEN: [
    "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=600&q=80",
    "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&q=80",
    "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=600&q=80",
    "https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=600&q=80",
    "https://images.unsplash.com/photo-1594938298603-c8148c4b4b5c?w=600&q=80",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80",
    "https://images.unsplash.com/photo-1621072156002-e2fccdc0b176?w=600&q=80",
    "https://images.unsplash.com/photo-1603252109303-2751441dd157?w=600&q=80",
    "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80",
    "https://images.unsplash.com/photo-1550246140-5119ae4790b8?w=600&q=80",
    "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&q=80",
    "https://images.unsplash.com/photo-1578681994506-b8f463449011?w=600&q=80",
  ],
  WOMEN: [
    "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=600&q=80",
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80",
    "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&q=80",
    "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=600&q=80",
    "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&q=80",
    "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&q=80",
    "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=600&q=80",
    "https://images.unsplash.com/photo-1566206091558-7f218b696731?w=600&q=80",
    "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=600&q=80",
    "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&q=80",
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&q=80",
    "https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?w=600&q=80",
  ],
  UNISEX: [
    "https://images.unsplash.com/photo-1556906781-9a412961a28c?w=600&q=80",
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80",
    "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&q=80",
    "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600&q=80",
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80",
    "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=600&q=80",
    "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&q=80",
    "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=600&q=80",
  ],
};

type Category   = "MEN" | "WOMEN" | "UNISEX";
type Clothing   = "TOP"|"BOTTOM"|"DRESS"|"OUTERWEAR"|"UNDERWEAR"|"SHOES"|"ACCESSORIES"|"ACTIVEWEAR";
type Occasion   = "CASUAL"|"FORMAL"|"SPORTSWEAR"|"STREETWEAR"|"PARTY"|"WORKWEAR"|"LOUNGEWEAR";

interface Def {
  title: string; category: Category; clothingType: Clothing; occasion: Occasion;
  price: number; compare: number | null; colors: string[]; sizes: string[];
  desc?: string;
}

const PRODUCTS: Def[] = [
  // ── MEN — TOPS ───────────────────────────────────────────────────────────
  { title:"Classic White Oxford Shirt",        category:"MEN", clothingType:"TOP",        occasion:"FORMAL",     price:850,  compare:1200, colors:["white","blue","black"],          sizes:["S","M","L","XL"] },
  { title:"Slim Fit Business Shirt",           category:"MEN", clothingType:"TOP",        occasion:"FORMAL",     price:950,  compare:null, colors:["white","light blue","pink"],     sizes:["S","M","L","XL"] },
  { title:"Casual Linen Shirt",                category:"MEN", clothingType:"TOP",        occasion:"CASUAL",     price:750,  compare:null, colors:["white","beige","sky blue"],      sizes:["S","M","L","XL"] },
  { title:"Flannel Check Shirt",               category:"MEN", clothingType:"TOP",        occasion:"CASUAL",     price:850,  compare:1100, colors:["red","blue","green"],            sizes:["S","M","L","XL"] },
  { title:"Polo Shirt",                        category:"MEN", clothingType:"TOP",        occasion:"CASUAL",     price:700,  compare:900,  colors:["white","navy","forest green"],   sizes:["S","M","L","XL"] },
  { title:"Graphic Print T-Shirt",             category:"MEN", clothingType:"TOP",        occasion:"STREETWEAR", price:550,  compare:750,  colors:["black","white","red"],           sizes:["S","M","L","XL"] },
  { title:"Plain Crew Neck Tee",               category:"MEN", clothingType:"TOP",        occasion:"CASUAL",     price:400,  compare:null, colors:["white","black","gray","navy"],   sizes:["S","M","L","XL"] },
  { title:"Muscle Fit Tank Top",               category:"MEN", clothingType:"TOP",        occasion:"SPORTSWEAR", price:450,  compare:600,  colors:["black","white","gray"],          sizes:["S","M","L","XL"] },
  { title:"Turtleneck Sweater",                category:"MEN", clothingType:"TOP",        occasion:"CASUAL",     price:1100, compare:1400, colors:["black","gray","navy"],           sizes:["S","M","L","XL"] },
  { title:"Zip-Up Sweatshirt",                 category:"MEN", clothingType:"TOP",        occasion:"CASUAL",     price:1200, compare:null, colors:["gray","black","navy"],           sizes:["S","M","L","XL"] },
  { title:"Oversized Streetwear Hoodie",       category:"MEN", clothingType:"TOP",        occasion:"STREETWEAR", price:1400, compare:1800, colors:["black","gray","white"],          sizes:["M","L","XL","XXL"] },
  { title:"Henley Long Sleeve Shirt",          category:"MEN", clothingType:"TOP",        occasion:"CASUAL",     price:700,  compare:950,  colors:["white","gray","burgundy"],       sizes:["S","M","L","XL"] },
  { title:"Bomber Style Sweater",              category:"MEN", clothingType:"TOP",        occasion:"STREETWEAR", price:1600, compare:2000, colors:["black","olive","navy"],          sizes:["S","M","L","XL"] },
  // ── MEN — BOTTOMS ─────────────────────────────────────────────────────────
  { title:"Slim Fit Chinos",                   category:"MEN", clothingType:"BOTTOM",     occasion:"CASUAL",     price:1100, compare:null, colors:["khaki","navy","black"],          sizes:["30","32","34","36"] },
  { title:"Formal Dress Trousers",             category:"MEN", clothingType:"BOTTOM",     occasion:"FORMAL",     price:1200, compare:null, colors:["black","gray","navy"],           sizes:["30","32","34","36"] },
  { title:"Slim Fit Jeans",                    category:"MEN", clothingType:"BOTTOM",     occasion:"CASUAL",     price:1400, compare:1800, colors:["blue","black","gray"],           sizes:["30","32","34","36"] },
  { title:"Tapered Jogger Pants",              category:"MEN", clothingType:"BOTTOM",     occasion:"STREETWEAR", price:950,  compare:1300, colors:["black","gray","navy"],           sizes:["S","M","L","XL"] },
  { title:"Cargo Pants",                       category:"MEN", clothingType:"BOTTOM",     occasion:"STREETWEAR", price:1300, compare:null, colors:["khaki","black","olive"],         sizes:["S","M","L","XL"] },
  { title:"Athletic Running Shorts",           category:"MEN", clothingType:"BOTTOM",     occasion:"SPORTSWEAR", price:650,  compare:null, colors:["black","blue","red"],            sizes:["S","M","L","XL"] },
  { title:"Linen Summer Shorts",               category:"MEN", clothingType:"BOTTOM",     occasion:"CASUAL",     price:700,  compare:900,  colors:["white","beige","navy"],          sizes:["S","M","L","XL"] },
  { title:"Bermuda Shorts",                    category:"MEN", clothingType:"BOTTOM",     occasion:"CASUAL",     price:750,  compare:null, colors:["khaki","navy","black"],          sizes:["S","M","L","XL"] },
  { title:"Compression Training Tights",       category:"MEN", clothingType:"ACTIVEWEAR", occasion:"SPORTSWEAR", price:850,  compare:1100, colors:["black","blue"],                  sizes:["S","M","L","XL"] },
  // ── MEN — OUTERWEAR ───────────────────────────────────────────────────────
  { title:"Slim Fit Blazer",                   category:"MEN", clothingType:"OUTERWEAR",  occasion:"FORMAL",     price:2800, compare:3500, colors:["black","navy","gray"],           sizes:["S","M","L","XL"] },
  { title:"Denim Jacket",                      category:"MEN", clothingType:"OUTERWEAR",  occasion:"CASUAL",     price:1800, compare:2200, colors:["blue","black"],                  sizes:["S","M","L","XL"] },
  { title:"Woolen Overcoat",                   category:"MEN", clothingType:"OUTERWEAR",  occasion:"FORMAL",     price:4500, compare:5500, colors:["black","gray","camel"],          sizes:["S","M","L","XL"] },
  { title:"Leather Biker Jacket",              category:"MEN", clothingType:"OUTERWEAR",  occasion:"STREETWEAR", price:5500, compare:null, colors:["black","brown"],                 sizes:["S","M","L","XL"] },
  { title:"Puffer Vest",                       category:"MEN", clothingType:"OUTERWEAR",  occasion:"CASUAL",     price:1600, compare:2100, colors:["black","navy","olive"],          sizes:["S","M","L","XL"] },
  { title:"Track Jacket",                      category:"MEN", clothingType:"ACTIVEWEAR", occasion:"SPORTSWEAR", price:1100, compare:1400, colors:["black","blue","red"],            sizes:["S","M","L","XL"] },
  // ── MEN — ACCESSORIES ────────────────────────────────────────────────────
  { title:"Premium Leather Belt",              category:"MEN", clothingType:"ACCESSORIES",occasion:"FORMAL",     price:600,  compare:null, colors:["black","brown"],                 sizes:["S","M","L"] },
  { title:"Classic Woven Tie",                 category:"MEN", clothingType:"ACCESSORIES",occasion:"FORMAL",     price:500,  compare:700,  colors:["navy","black","burgundy"],       sizes:["ONE SIZE"] },
  { title:"Leather Wallet",                    category:"MEN", clothingType:"ACCESSORIES",occasion:"CASUAL",     price:800,  compare:null, colors:["black","brown"],                 sizes:["ONE SIZE"] },
  { title:"Knit Scarf",                        category:"MEN", clothingType:"ACCESSORIES",occasion:"CASUAL",     price:550,  compare:750,  colors:["gray","navy","black"],           sizes:["ONE SIZE"] },
  { title:"Leather Watch Strap",               category:"MEN", clothingType:"ACCESSORIES",occasion:"FORMAL",     price:700,  compare:950,  colors:["black","brown"],                 sizes:["ONE SIZE"] },

  // ── WOMEN — DRESSES ───────────────────────────────────────────────────────
  { title:"Floral Wrap Dress",                 category:"WOMEN", clothingType:"DRESS",    occasion:"CASUAL",     price:1200, compare:1600, colors:["pink","blue","white"],           sizes:["XS","S","M","L"] },
  { title:"Evening Maxi Dress",                category:"WOMEN", clothingType:"DRESS",    occasion:"FORMAL",     price:2800, compare:3500, colors:["black","navy","red"],            sizes:["XS","S","M","L"] },
  { title:"Blazer Dress",                      category:"WOMEN", clothingType:"DRESS",    occasion:"WORKWEAR",   price:2200, compare:2800, colors:["black","gray","white"],          sizes:["XS","S","M","L"] },
  { title:"Satin Slip Dress",                  category:"WOMEN", clothingType:"DRESS",    occasion:"PARTY",      price:1800, compare:2400, colors:["black","champagne","burgundy"],  sizes:["XS","S","M","L"] },
  { title:"Bodycon Dress",                     category:"WOMEN", clothingType:"DRESS",    occasion:"PARTY",      price:1500, compare:2000, colors:["black","red","white"],           sizes:["XS","S","M","L"] },
  { title:"Sundress",                          category:"WOMEN", clothingType:"DRESS",    occasion:"CASUAL",     price:1100, compare:null, colors:["yellow","white","floral"],       sizes:["XS","S","M","L"] },
  { title:"Shirt Dress",                       category:"WOMEN", clothingType:"DRESS",    occasion:"WORKWEAR",   price:1400, compare:1800, colors:["white","blue","stripes"],        sizes:["XS","S","M","L"] },
  { title:"Midi Wrap Dress",                   category:"WOMEN", clothingType:"DRESS",    occasion:"FORMAL",     price:1900, compare:2400, colors:["black","forest green","wine"],   sizes:["XS","S","M","L"] },
  { title:"Cocktail Party Dress",              category:"WOMEN", clothingType:"DRESS",    occasion:"PARTY",      price:2400, compare:3200, colors:["black","gold","silver"],         sizes:["XS","S","M","L"] },
  { title:"Casual Shirt Dress",                category:"WOMEN", clothingType:"DRESS",    occasion:"CASUAL",     price:1000, compare:1400, colors:["blue","white","olive"],          sizes:["XS","S","M","L"] },
  // ── WOMEN — TOPS ─────────────────────────────────────────────────────────
  { title:"Crop Top",                          category:"WOMEN", clothingType:"TOP",      occasion:"CASUAL",     price:550,  compare:750,  colors:["white","black","pink"],          sizes:["XS","S","M","L"] },
  { title:"Oversized Knit Sweater",            category:"WOMEN", clothingType:"TOP",      occasion:"CASUAL",     price:1100, compare:1400, colors:["cream","gray","pink"],           sizes:["S","M","L"] },
  { title:"Off-Shoulder Blouse",               category:"WOMEN", clothingType:"TOP",      occasion:"CASUAL",     price:800,  compare:1100, colors:["white","pink","yellow"],         sizes:["XS","S","M","L"] },
  { title:"Turtleneck Sweater",                category:"WOMEN", clothingType:"TOP",      occasion:"CASUAL",     price:950,  compare:1300, colors:["black","white","gray"],          sizes:["XS","S","M","L"] },
  { title:"Peplum Blouse",                     category:"WOMEN", clothingType:"TOP",      occasion:"WORKWEAR",   price:850,  compare:null, colors:["white","blush","navy"],          sizes:["XS","S","M","L"] },
  { title:"Camisole Top",                      category:"WOMEN", clothingType:"TOP",      occasion:"CASUAL",     price:500,  compare:700,  colors:["white","black","nude"],          sizes:["XS","S","M","L"] },
  { title:"Ribbed Tank Top",                   category:"WOMEN", clothingType:"TOP",      occasion:"CASUAL",     price:450,  compare:600,  colors:["white","black","gray"],          sizes:["XS","S","M","L"] },
  { title:"Wrap Blouse",                       category:"WOMEN", clothingType:"TOP",      occasion:"WORKWEAR",   price:900,  compare:1200, colors:["white","floral","solid"],        sizes:["XS","S","M","L"] },
  { title:"Sports Bra",                        category:"WOMEN", clothingType:"ACTIVEWEAR",occasion:"SPORTSWEAR",price:650,  compare:850,  colors:["black","pink","blue"],           sizes:["XS","S","M","L"] },
  { title:"Lace Trim Blouse",                  category:"WOMEN", clothingType:"TOP",      occasion:"FORMAL",     price:950,  compare:1300, colors:["white","ivory","blush"],         sizes:["XS","S","M","L"] },
  // ── WOMEN — BOTTOMS ───────────────────────────────────────────────────────
  { title:"High Waist Wide Leg Trousers",      category:"WOMEN", clothingType:"BOTTOM",   occasion:"FORMAL",     price:1400, compare:null, colors:["black","white","beige"],         sizes:["XS","S","M","L","XL"] },
  { title:"Mini Skirt",                        category:"WOMEN", clothingType:"BOTTOM",   occasion:"CASUAL",     price:750,  compare:null, colors:["black","white","plaid"],         sizes:["XS","S","M","L"] },
  { title:"Denim Shorts",                      category:"WOMEN", clothingType:"BOTTOM",   occasion:"CASUAL",     price:800,  compare:1100, colors:["blue","black","white"],          sizes:["XS","S","M","L"] },
  { title:"Linen Pants",                       category:"WOMEN", clothingType:"BOTTOM",   occasion:"CASUAL",     price:950,  compare:null, colors:["white","beige","olive"],         sizes:["XS","S","M","L","XL"] },
  { title:"Pleated Midi Skirt",                category:"WOMEN", clothingType:"BOTTOM",   occasion:"WORKWEAR",   price:1100, compare:null, colors:["black","navy","beige"],          sizes:["XS","S","M","L"] },
  { title:"Sports Leggings",                   category:"WOMEN", clothingType:"ACTIVEWEAR",occasion:"SPORTSWEAR",price:850,  compare:1100, colors:["black","gray","purple"],         sizes:["XS","S","M","L"] },
  { title:"Flared Jeans",                      category:"WOMEN", clothingType:"BOTTOM",   occasion:"CASUAL",     price:1500, compare:2000, colors:["blue","black"],                  sizes:["XS","S","M","L"] },
  { title:"Pencil Skirt",                      category:"WOMEN", clothingType:"BOTTOM",   occasion:"WORKWEAR",   price:1000, compare:1400, colors:["black","gray","navy"],           sizes:["XS","S","M","L"] },
  { title:"Maxi Skirt",                        category:"WOMEN", clothingType:"BOTTOM",   occasion:"CASUAL",     price:1200, compare:null, colors:["floral","black","white"],        sizes:["XS","S","M","L"] },
  { title:"Yoga Pants",                        category:"WOMEN", clothingType:"ACTIVEWEAR",occasion:"SPORTSWEAR",price:900,  compare:1200, colors:["black","navy","gray"],           sizes:["XS","S","M","L"] },
  { title:"Cargo Pants",                       category:"WOMEN", clothingType:"BOTTOM",   occasion:"STREETWEAR", price:1300, compare:1700, colors:["khaki","black","olive"],         sizes:["XS","S","M","L"] },
  // ── WOMEN — OUTERWEAR ────────────────────────────────────────────────────
  { title:"Trench Coat",                       category:"WOMEN", clothingType:"OUTERWEAR",occasion:"CASUAL",     price:3500, compare:4500, colors:["beige","black","navy"],          sizes:["XS","S","M","L"] },
  { title:"Leather Jacket",                    category:"WOMEN", clothingType:"OUTERWEAR",occasion:"STREETWEAR", price:4500, compare:null, colors:["black","brown","white"],         sizes:["XS","S","M","L"] },
  { title:"Blazer",                            category:"WOMEN", clothingType:"OUTERWEAR",occasion:"WORKWEAR",   price:2200, compare:2800, colors:["black","white","pastel"],        sizes:["XS","S","M","L"] },
  { title:"Cropped Puffer Jacket",             category:"WOMEN", clothingType:"OUTERWEAR",occasion:"CASUAL",     price:2800, compare:3500, colors:["black","pink","white"],          sizes:["XS","S","M","L"] },
  { title:"Knit Cardigan",                     category:"WOMEN", clothingType:"OUTERWEAR",occasion:"CASUAL",     price:1400, compare:1800, colors:["cream","gray","camel"],          sizes:["XS","S","M","L"] },

  // ── UNISEX — SHOES ────────────────────────────────────────────────────────
  { title:"Classic White Sneakers",            category:"UNISEX", clothingType:"SHOES",   occasion:"CASUAL",     price:1800, compare:2200, colors:["white","black"],                 sizes:["38","39","40","41","42","43"] },
  { title:"Black Leather Sneakers",            category:"UNISEX", clothingType:"SHOES",   occasion:"CASUAL",     price:2200, compare:null, colors:["black"],                         sizes:["38","39","40","41","42","43"] },
  { title:"Running Shoes",                     category:"UNISEX", clothingType:"SHOES",   occasion:"SPORTSWEAR", price:2800, compare:3500, colors:["black","white","blue"],          sizes:["38","39","40","41","42","43"] },
  { title:"High Top Canvas Shoes",             category:"UNISEX", clothingType:"SHOES",   occasion:"STREETWEAR", price:1600, compare:2000, colors:["white","black","red"],           sizes:["38","39","40","41","42","43"] },
  { title:"Slip On Loafers",                   category:"UNISEX", clothingType:"SHOES",   occasion:"CASUAL",     price:1400, compare:null, colors:["black","brown","navy"],          sizes:["38","39","40","41","42","43"] },
  { title:"Chelsea Boots",                     category:"UNISEX", clothingType:"SHOES",   occasion:"FORMAL",     price:3200, compare:4000, colors:["black","brown"],                 sizes:["38","39","40","41","42","43"] },
  { title:"Platform Sneakers",                 category:"UNISEX", clothingType:"SHOES",   occasion:"STREETWEAR", price:2400, compare:3000, colors:["white","black"],                 sizes:["38","39","40","41","42","43"] },
  { title:"Trail Running Shoes",               category:"UNISEX", clothingType:"SHOES",   occasion:"SPORTSWEAR", price:3000, compare:3800, colors:["gray","blue","orange"],          sizes:["38","39","40","41","42","43"] },
  // ── UNISEX — TOPS ─────────────────────────────────────────────────────────
  { title:"Oversized Hoodie",                  category:"UNISEX", clothingType:"TOP",     occasion:"STREETWEAR", price:1200, compare:1600, colors:["black","gray","white","beige"],  sizes:["S","M","L","XL","XXL"] },
  { title:"Basic Tee",                         category:"UNISEX", clothingType:"TOP",     occasion:"CASUAL",     price:400,  compare:null, colors:["white","black","gray"],          sizes:["S","M","L","XL"] },
  { title:"Long Sleeve Tee",                   category:"UNISEX", clothingType:"TOP",     occasion:"CASUAL",     price:550,  compare:750,  colors:["white","black","navy","olive"],  sizes:["S","M","L","XL"] },
  { title:"Quarter Zip Pullover",              category:"UNISEX", clothingType:"TOP",     occasion:"CASUAL",     price:1400, compare:1800, colors:["gray","navy","black"],           sizes:["S","M","L","XL"] },
  { title:"Fleece Sweatshirt",                 category:"UNISEX", clothingType:"TOP",     occasion:"CASUAL",     price:1100, compare:null, colors:["gray","black","cream"],          sizes:["S","M","L","XL"] },
  { title:"Striped Sailor Shirt",              category:"UNISEX", clothingType:"TOP",     occasion:"CASUAL",     price:800,  compare:1100, colors:["navy white","black white"],      sizes:["S","M","L","XL"] },
  // ── UNISEX — BOTTOMS ──────────────────────────────────────────────────────
  { title:"Sweatpants",                        category:"UNISEX", clothingType:"BOTTOM",  occasion:"LOUNGEWEAR", price:900,  compare:null, colors:["black","gray","navy"],           sizes:["S","M","L","XL"] },
  { title:"Straight Leg Jeans",                category:"UNISEX", clothingType:"BOTTOM",  occasion:"CASUAL",     price:1500, compare:2000, colors:["blue","black","gray"],           sizes:["28","30","32","34","36"] },
  { title:"Parachute Pants",                   category:"UNISEX", clothingType:"BOTTOM",  occasion:"STREETWEAR", price:1600, compare:2200, colors:["black","olive","gray"],          sizes:["S","M","L","XL"] },
  { title:"Yoga Shorts",                       category:"UNISEX", clothingType:"ACTIVEWEAR",occasion:"SPORTSWEAR",price:650, compare:850,  colors:["black","gray","navy"],           sizes:["S","M","L","XL"] },
  { title:"Track Pants",                       category:"UNISEX", clothingType:"ACTIVEWEAR",occasion:"SPORTSWEAR",price:1000,compare:1300, colors:["black","navy","gray"],           sizes:["S","M","L","XL"] },
  // ── UNISEX — OUTERWEAR ────────────────────────────────────────────────────
  { title:"Windbreaker Jacket",                category:"UNISEX", clothingType:"OUTERWEAR",occasion:"STREETWEAR",price:2200, compare:2800, colors:["black","navy","red"],            sizes:["S","M","L","XL"] },
  { title:"Fleece Jacket",                     category:"UNISEX", clothingType:"OUTERWEAR",occasion:"CASUAL",    price:1800, compare:2400, colors:["gray","black","navy"],           sizes:["S","M","L","XL"] },
  { title:"Puffer Jacket",                     category:"UNISEX", clothingType:"OUTERWEAR",occasion:"CASUAL",    price:3000, compare:3800, colors:["black","navy","olive"],          sizes:["S","M","L","XL"] },
  { title:"Rain Jacket",                       category:"UNISEX", clothingType:"OUTERWEAR",occasion:"CASUAL",    price:2600, compare:3400, colors:["black","yellow","teal"],         sizes:["S","M","L","XL"] },
  { title:"Varsity Jacket",                    category:"UNISEX", clothingType:"OUTERWEAR",occasion:"STREETWEAR",price:2800, compare:null, colors:["black","navy","white"],          sizes:["S","M","L","XL"] },
  // ── UNISEX — ACCESSORIES ─────────────────────────────────────────────────
  { title:"Canvas Backpack",                   category:"UNISEX", clothingType:"ACCESSORIES",occasion:"CASUAL",  price:1500, compare:null, colors:["black","navy","khaki"],          sizes:["ONE SIZE"] },
  { title:"Chunky Knit Beanie",                category:"UNISEX", clothingType:"ACCESSORIES",occasion:"CASUAL",  price:450,  compare:600,  colors:["black","gray","cream","red"],    sizes:["ONE SIZE"] },
  { title:"Bucket Hat",                        category:"UNISEX", clothingType:"ACCESSORIES",occasion:"CASUAL",  price:500,  compare:700,  colors:["black","white","khaki"],         sizes:["ONE SIZE"] },
  { title:"Leather Crossbody Bag",             category:"UNISEX", clothingType:"ACCESSORIES",occasion:"CASUAL",  price:2200, compare:2800, colors:["black","brown","tan"],           sizes:["ONE SIZE"] },
  { title:"Sunglasses",                        category:"UNISEX", clothingType:"ACCESSORIES",occasion:"CASUAL",  price:800,  compare:1100, colors:["black","brown","tortoise"],      sizes:["ONE SIZE"] },
  { title:"Baseball Cap",                      category:"UNISEX", clothingType:"ACCESSORIES",occasion:"CASUAL",  price:600,  compare:null, colors:["black","white","navy"],          sizes:["ONE SIZE"] },
  { title:"Knit Scarf",                        category:"UNISEX", clothingType:"ACCESSORIES",occasion:"CASUAL",  price:550,  compare:750,  colors:["gray","cream","black"],          sizes:["ONE SIZE"] },
  { title:"Tote Bag",                          category:"UNISEX", clothingType:"ACCESSORIES",occasion:"CASUAL",  price:900,  compare:1200, colors:["black","white","natural"],       sizes:["ONE SIZE"] },
  { title:"Sports Socks 3-Pack",               category:"UNISEX", clothingType:"ACCESSORIES",occasion:"SPORTSWEAR",price:350,compare:500,  colors:["white","black","gray"],          sizes:["S","M","L"] },
  { title:"Watch",                             category:"UNISEX", clothingType:"ACCESSORIES",occasion:"FORMAL",  price:3500, compare:4500, colors:["black","silver","gold"],         sizes:["ONE SIZE"] },
  { title:"Gym Duffel Bag",                    category:"UNISEX", clothingType:"ACCESSORIES",occasion:"SPORTSWEAR",price:1800,compare:2400,colors:["black","navy","gray"],           sizes:["ONE SIZE"] },
  { title:"Fanny Pack",                        category:"UNISEX", clothingType:"ACCESSORIES",occasion:"STREETWEAR",price:700,compare:950, colors:["black","olive","brown"],          sizes:["ONE SIZE"] },
  { title:"Swim Shorts",                       category:"UNISEX", clothingType:"BOTTOM",    occasion:"CASUAL",   price:700,  compare:950,  colors:["navy","blue","tropical"],        sizes:["S","M","L","XL"] },
  { title:"Biker Shorts",                      category:"UNISEX", clothingType:"ACTIVEWEAR",occasion:"SPORTSWEAR",price:750, compare:null, colors:["black","navy"],                  sizes:["XS","S","M","L"] },
  { title:"Compression Shirt",                 category:"UNISEX", clothingType:"ACTIVEWEAR",occasion:"SPORTSWEAR",price:900, compare:1200, colors:["black","white","blue"],          sizes:["S","M","L","XL"] },
  { title:"Training Gloves",                   category:"UNISEX", clothingType:"ACCESSORIES",occasion:"SPORTSWEAR",price:500,compare:700,  colors:["black","red"],                   sizes:["S","M","L"] },
  { title:"Slip On Sandals",                   category:"UNISEX", clothingType:"SHOES",     occasion:"CASUAL",   price:900,  compare:null, colors:["black","brown","white"],         sizes:["38","39","40","41","42","43"] },
  { title:"Hiking Boots",                      category:"UNISEX", clothingType:"SHOES",     occasion:"CASUAL",   price:3800, compare:4800, colors:["brown","black","gray"],          sizes:["38","39","40","41","42","43"] },
  { title:"Dress Socks",                       category:"UNISEX", clothingType:"ACCESSORIES",occasion:"FORMAL",  price:300,  compare:450,  colors:["black","navy","gray"],           sizes:["S","M","L"] },
  { title:"Swim Cap",                          category:"UNISEX", clothingType:"ACCESSORIES",occasion:"SPORTSWEAR",price:250,compare:null, colors:["black","blue","red"],            sizes:["ONE SIZE"] },
  { title:"Phone Crossbody Bag",               category:"UNISEX", clothingType:"ACCESSORIES",occasion:"CASUAL",  price:650,  compare:900,  colors:["black","tan","white"],           sizes:["ONE SIZE"] },
];

const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const DESCS: Record<string, string> = {
  TOP:         "Premium quality top crafted for the modern wardrobe. Breathable fabric with a comfortable fit for all-day wear.",
  BOTTOM:      "Well-tailored bottoms with a flattering cut. Made from durable, high-quality fabric that moves with you.",
  DRESS:       "Elegant dress that transitions seamlessly from day to night. Crafted with attention to detail and fit.",
  OUTERWEAR:   "Statement outerwear piece built to last. Provides warmth without sacrificing style.",
  SHOES:       "Versatile footwear crafted for comfort and durability. Perfect for everyday Ethiopian streets.",
  ACCESSORIES: "Carefully crafted accessory to complete any outfit. High-quality materials built to last.",
  ACTIVEWEAR:  "High-performance activewear designed for movement. Moisture-wicking fabric keeps you comfortable during workouts.",
  UNDERWEAR:   "Comfortable essentials crafted from soft, breathable fabric for all-day comfort.",
};

async function main() {
  const seller = await prisma.seller.findFirst({ where: { status: "APPROVED" } });
  if (!seller) { console.error("❌ No approved seller found."); process.exit(1); }

  console.log(`✅ Seeding for: ${seller.brandName}`);
  console.log(`📦 Creating ${PRODUCTS.length} products...\n`);

  let created = 0;
  for (const p of PRODUCTS) {
    const imgPool = IMAGES[p.category];
    const img1 = pick(imgPool);
    const img2 = pick(imgPool.filter(i => i !== img1));
    const daysAgo = Math.floor(Math.random() * 60);
    const createdAt = new Date(Date.now() - daysAgo * 86400000);

    await prisma.product.create({
      data: {
        sellerId:       seller.id,
        title:          p.title,
        description:    p.desc || DESCS[p.clothingType] || "Quality fashion item for the modern Ethiopian wardrobe.",
        price:          p.price,
        compareAtPrice: p.compare,
        category:       p.category as any,
        clothingType:   p.clothingType as any,
        occasion:       p.occasion as any,
        status:         "PUBLISHED",
        isFeatured:     Math.random() > 0.72,
        isTrending:     Math.random() > 0.80,
        views:          Math.floor(Math.random() * 300),
        tags:           [p.clothingType.toLowerCase(), p.occasion.toLowerCase(), p.category.toLowerCase()],
        createdAt,
        images: {
          create: [
            { url: img1, position: 0 },
            { url: img2, position: 1 },
          ],
        },
        variants: {
          create: p.sizes.flatMap(size =>
            p.colors.map(color => ({
              size,
              color,
              quantity: Math.floor(Math.random() * 25) + 5,
            }))
          ),
        },
      },
    });

    created++;
    process.stdout.write(`\r  ✅ ${created}/${PRODUCTS.length} — ${p.title}`);
  }

  const counts = {
    men:    PRODUCTS.filter(p => p.category === "MEN").length,
    women:  PRODUCTS.filter(p => p.category === "WOMEN").length,
    unisex: PRODUCTS.filter(p => p.category === "UNISEX").length,
  };

  console.log(`\n\n🎉 Done! Created ${created} products`);
  console.log(`   👔 Men: ${counts.men}`);
  console.log(`   👗 Women: ${counts.women}`);
  console.log(`   🧢 Unisex: ${counts.unisex}`);
  console.log(`\nRun your dev server and check the store!`);
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });