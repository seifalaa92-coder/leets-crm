"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

const products = [
  {
    id: 1,
    name: "Performance Padel Racket",
    price: 299,
    image: "/images/shop/racket.jpg",
    category: "Equipment",
    onSale: false,
  },
  {
    id: 2,
    name: "Pro Tour Padel Ball (3-Pack)",
    price: 45,
    image: "/images/shop/balls.jpg",
    category: "Accessories",
    onSale: true,
    salePrice: 35,
  },
  {
    id: 3,
    name: "Elite Grip Tape",
    price: 25,
    image: "/images/shop/grip.jpg",
    category: "Accessories",
    onSale: false,
  },
  {
    id: 4,
    name: "Leets Sports Hoodie",
    price: 120,
    image: "/images/shop/hoodie.jpg",
    category: "Apparel",
    onSale: false,
  },
  {
    id: 5,
    name: "Performance Training Shirt",
    price: 65,
    image: "/images/shop/shirt.jpg",
    category: "Apparel",
    onSale: true,
    salePrice: 49,
  },
  {
    id: 6,
    name: "Sports Water Bottle",
    price: 35,
    image: "/images/shop/bottle.jpg",
    category: "Accessories",
    onSale: false,
  },
  {
    id: 7,
    name: "Leets Cap",
    price: 45,
    image: "/images/shop/cap.jpg",
    category: "Apparel",
    onSale: false,
  },
  {
    id: 8,
    name: "Court Shoes Pro",
    price: 189,
    image: "/images/shop/shoes.jpg",
    category: "Footwear",
    onSale: true,
    salePrice: 149,
  },
];

const categories = ["All", "Equipment", "Apparel", "Accessories", "Footwear"];

export default function ShopPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [cartCount, setCartCount] = useState(0);

  const filteredProducts = activeCategory === "All"
    ? products
    : products.filter(p => p.category === activeCategory);

  const addToCart = (productId: number) => {
    setCartCount(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-[#0F172A] border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            <Link href="/" className="flex items-center gap-3">
              <img src="/leets-logo.png" alt="Leets Logo" className="w-10 h-10 object-contain" />
              <span className="font-display text-2xl text-white tracking-tight">LEETS</span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <Link href="/#features" className="font-body text-sm text-white/80 hover:text-[#EA553B] transition-colors">Features</Link>
              <Link href="/shop" className="font-body text-sm text-[#EA553B] transition-colors">Shop</Link>
              <Link href="/auth/login" className="font-body text-sm text-white/80 hover:text-[#EA553B] transition-colors">Sign In</Link>
              <Link href="/auth/signup" className="font-body text-sm text-white/80 hover:text-[#EA553B] transition-colors">Sign Up</Link>
            </div>

            <div className="flex items-center gap-4">
              <button className="relative p-2 text-white/80 hover:text-[#EA553B] transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#EA553B] text-white text-xs rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
              <Link href="/classes/book-court" className="hidden sm:flex items-center gap-2 bg-[#EA553B] hover:bg-[#D14028] text-white px-5 py-2.5 rounded-lg font-display text-sm tracking-wide transition-all">
                Book Court
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-[#0F172A] py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl text-white mb-4">
            Shop
          </h1>
          <p className="font-body text-white/60 max-w-2xl mx-auto">
            Premium sports equipment and apparel for your game
          </p>
        </div>
      </section>

      {/* Categories */}
      <div className="sticky top-0 bg-white border-b border-gray-200 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 overflow-x-auto">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full font-body text-sm whitespace-nowrap transition-all ${
                  activeCategory === category
                    ? "bg-[#EA553B] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filteredProducts.map((product) => (
              <div key={product.id} className="group">
                <div className="relative aspect-square bg-gray-100 rounded-2xl overflow-hidden mb-4">
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                    <svg className="w-16 h-16" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  {product.onSale && (
                    <div className="absolute top-3 left-3 bg-[#EA553B] text-white text-xs font-semibold px-3 py-1 rounded-full">
                      SALE
                    </div>
                  )}
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">{product.category}</p>
                  <h3 className="font-display text-black">{product.name}</h3>
                  <div className="flex items-center gap-2">
                    {product.onSale ? (
                      <>
                        <span className="font-display text-[#EA553B]">${product.salePrice}</span>
                        <span className="font-body text-sm text-gray-400 line-through">${product.price}</span>
                      </>
                    ) : (
                      <span className="font-display text-black">${product.price}</span>
                    )}
                  </div>
                  <button
                    onClick={() => addToCart(product.id)}
                    className="w-full mt-3 bg-[#0F172A] hover:bg-[#EA553B] text-white py-3 rounded-xl font-display text-sm transition-all"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-16">
              <p className="font-body text-gray-500">No products found in this category.</p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#111111] border-t border-white/10 px-4 sm:px-6 lg:px-8 py-12 mt-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <img src="/leets-logo.png" alt="Leets Logo" className="w-10 h-10 object-contain" />
              <div>
                <span className="font-display text-xl text-white tracking-tight">LEETS</span>
                <p className="text-[#EA553B] text-xs uppercase tracking-wider">Sports CRM</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <Link href="/" className="font-body text-sm text-white/60 hover:text-[#EA553B] transition-colors">Home</Link>
              <Link href="/shop" className="font-body text-sm text-white/60 hover:text-[#EA553B] transition-colors">Shop</Link>
              <Link href="/auth/login" className="font-body text-sm text-white/60 hover:text-[#EA553B] transition-colors">Sign In</Link>
            </div>
            <p className="font-body text-xs text-white/40">© 2026 Leets Sports. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
