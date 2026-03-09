"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

const products = [
  {
    id: 1,
    name: "Performance Padel Racket",
    price: 299,
    image: "https://images.unsplash.com/photo-1617083934555-ac7b4d0c8be2?w=400&h=400&fit=crop",
    category: "Equipment",
    onSale: false,
  },
  {
    id: 2,
    name: "Pro Tour Padel Ball (3-Pack)",
    price: 45,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop",
    category: "Accessories",
    onSale: true,
    salePrice: 35,
  },
  {
    id: 3,
    name: "Elite Grip Tape",
    price: 25,
    image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=400&fit=crop",
    category: "Accessories",
    onSale: false,
  },
  {
    id: 4,
    name: "Leets Sports Hoodie",
    price: 120,
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop",
    category: "Apparel",
    onSale: false,
  },
  {
    id: 5,
    name: "Performance Training Shirt",
    price: 65,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
    category: "Apparel",
    onSale: true,
    salePrice: 49,
  },
  {
    id: 6,
    name: "Sports Water Bottle",
    price: 35,
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=400&fit=crop",
    category: "Accessories",
    onSale: false,
  },
  {
    id: 7,
    name: "Leets Cap",
    price: 45,
    image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400&h=400&fit=crop",
    category: "Apparel",
    onSale: false,
  },
  {
    id: 8,
    name: "Court Shoes Pro",
    price: 189,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
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
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
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
