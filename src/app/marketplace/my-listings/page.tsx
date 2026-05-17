"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export const dynamic = 'force-dynamic';
import type { MarketplaceProduct } from "@/types";

export default function MyListingsPage() {
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<MarketplaceProduct[]>([]);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) {
        router.push("/auth/login");
        return;
      }
      setUser(data.user);

      const { data: profile } = await supabase
        .from("user_profiles")
        .select("id")
        .eq("id", data.user.id)
        .single();

      if (profile) {
        const res = await fetch(`/api/marketplace/products?seller_id=${profile.id}`);
        const d = await res.json();
        setProducts(d.products || []);
      }
      setLoading(false);
    });
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Remove this listing?")) return;
    const res = await fetch(`/api/marketplace/products/${id}`, { method: "DELETE" });
    if (res.ok) {
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  }

  async function handleMarkSold(id: string) {
    const res = await fetch(`/api/marketplace/products/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "sold" }),
    });
    if (res.ok) {
      setProducts(prev => prev.map(p => p.id === id ? { ...p, status: "sold" as const } : p));
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#EA553B]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <nav className="bg-[#0F172A] px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/marketplace" className="text-white/80 hover:text-white text-sm transition-colors">
            ← Marketplace
          </Link>
          <span className="font-display text-xl text-white tracking-tight">My Listings</span>
          <Link href="/marketplace/sell" className="bg-[#EA553B] hover:bg-[#D14028] text-white px-4 py-2 rounded-lg font-display text-sm tracking-wide transition-all">
            + New
          </Link>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {products.length === 0 ? (
          <div className="text-center py-20">
            <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <p className="text-gray-500 text-lg font-medium">No listings yet</p>
            <p className="text-gray-400 text-sm mt-1">Start by listing your first item!</p>
            <Link href="/marketplace/sell" className="inline-block mt-4 bg-[#EA553B] text-white px-6 py-2 rounded-lg font-display text-sm">
              + List Your Item
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {products.map(product => (
              <div key={product.id} className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-4">
                <div className="w-16 h-16 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden">
                  {product.images && product.images.length > 0 ? (
                    <img src={product.images[0]} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <path d="M21 15l-5-5L5 21" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm text-gray-900 truncate">{product.title}</h3>
                  <p className="text-[11px] text-gray-500">{product.category} · {product.condition}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="font-bold text-[#EA553B]">{product.price.toFixed(2)} SAR</span>
                    <span className={`text-[10px] font-medium uppercase px-2 py-0.5 rounded-full ${
                      product.status === "active" ? "bg-green-100 text-green-700" :
                      product.status === "sold" ? "bg-blue-100 text-blue-700" :
                      "bg-gray-100 text-gray-500"
                    }`}>
                      {product.status}
                    </span>
                  </div>
                </div>
                <div className="flex-shrink-0 flex gap-2">
                  {product.status === "active" && (
                    <button
                      onClick={() => handleMarkSold(product.id)}
                      className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 text-xs font-medium hover:bg-blue-100 transition-colors"
                    >
                      Mark Sold
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="px-3 py-1.5 rounded-lg bg-red-50 text-red-600 text-xs font-medium hover:bg-red-100 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
