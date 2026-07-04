"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ProductCard } from "@/components/marketplace/ProductCard";
import type { MarketplaceProduct } from "@/types";

const CATEGORIES = [
  "All", "Sports Equipment", "Padel Gear", "Fitness & Gym",
  "Apparel", "Accessories", "Electronics", "Home & Garden", "Other",
];

export default function MarketplacePage() {
  const [products, setProducts] = useState<MarketplaceProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (category !== "All") params.set("category", category);
    if (search) params.set("search", search);

    fetch(`/api/marketplace/products?${params}`)
      .then(r => r.json())
      .then(data => setProducts(data.products || []))
      .finally(() => setLoading(false));
  }, [category, search]);

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* Nav */}
      <nav className="bg-[#0F172A] px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <img src="/leets-logo.png" alt="Leets Logo" className="w-8 h-8 object-contain" />
            <span className="font-display text-xl text-white tracking-tight">MARKETPLACE</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/marketplace/sell" className="bg-[#EA553B] hover:bg-[#D14028] text-white px-4 py-2 rounded-lg font-display text-sm tracking-wide transition-all">
              + Sell Item
            </Link>
            <Link href="/marketplace/my-listings" className="text-white/80 hover:text-white text-sm transition-colors">
              My Listings
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="bg-gradient-to-br from-[#0F172A] to-[#1A1A2E] px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="font-display text-4xl sm:text-5xl text-white mb-3">Leets Marketplace</h1>
          <p className="text-white/60 text-sm max-w-2xl mx-auto">
            Buy and sell sports equipment, padel gear, and more. Sign up to start listing your items today.
          </p>
          {/* Search */}
          <div className="max-w-md mx-auto mt-6">
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-[#EA553B] transition-colors text-sm"
            />
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex gap-2 overflow-x-auto py-3 scrollbar-none">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                category === cat
                  ? "bg-[#EA553B] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#EA553B]" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <p className="text-gray-500 text-lg font-medium">No products found</p>
            <p className="text-gray-400 text-sm mt-1">Try a different category or be the first to list something!</p>
            <Link href="/marketplace/sell" className="inline-block mt-4 bg-[#EA553B] text-white px-6 py-2 rounded-lg font-display text-sm">
              + List Your Item
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
