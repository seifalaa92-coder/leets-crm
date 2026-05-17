"use client";

import Link from "next/link";
import type { MarketplaceProduct } from "@/types";

const conditionLabels: Record<string, string> = {
  new: "New",
  like_new: "Like New",
  good: "Good",
  fair: "Fair",
};

export function ProductCard({ product }: { product: MarketplaceProduct }) {
  return (
    <Link
      href={`/marketplace/item/${product.id}`}
      className="group bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md hover:border-[#EA553B]/30 transition-all duration-200"
    >
      <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
        {product.images && product.images.length > 0 ? (
          <img
            src={product.images[0]}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="M21 15l-5-5L5 21" />
            </svg>
          </div>
        )}
        <div className="absolute top-2 left-2 bg-[#EA553B] text-white text-[10px] font-semibold px-2 py-0.5 rounded-md uppercase">
          {conditionLabels[product.condition] || product.condition}
        </div>
      </div>
      <div className="p-3">
        <p className="text-[11px] text-gray-500 uppercase tracking-wider mb-1">{product.category}</p>
        <h3 className="font-semibold text-sm text-gray-900 line-clamp-1 group-hover:text-[#EA553B] transition-colors">
          {product.title}
        </h3>
        <div className="flex items-center justify-between mt-2">
          <span className="font-bold text-lg text-[#EA553B]">{product.price.toFixed(2)} SAR</span>
          <span className="text-[10px] text-gray-400">by {product.seller_name?.split(" ")[0]}</span>
        </div>
      </div>
    </Link>
  );
}
