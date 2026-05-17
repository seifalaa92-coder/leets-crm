"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import type { MarketplaceProduct } from "@/types";

const conditionLabels: Record<string, string> = {
  new: "New", like_new: "Like New", good: "Good", fair: "Fair",
};

const contactSellerHref = (product: MarketplaceProduct) => {
  const text = encodeURIComponent(
    `Hi! I'm interested in your listing: "${product.title}" (${product.price} SAR)`
  );
  return `https://wa.me/?text=${text}`;
};

export default function ProductDetailPage() {
  const params = useParams();
  const [product, setProduct] = useState<MarketplaceProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    fetch(`/api/marketplace/products/${params.id}`)
      .then(r => r.json())
      .then(data => {
        setProduct(data.product);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#EA553B]" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-lg">Product not found</p>
          <Link href="/marketplace" className="text-[#EA553B] text-sm mt-2 inline-block hover:underline">
            ← Back to Marketplace
          </Link>
        </div>
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
          <span className="font-display text-lg text-white/60 tracking-tight">Product Details</span>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Images */}
          <div>
            <div className="aspect-square rounded-2xl bg-white border border-gray-200 overflow-hidden">
              {product.images && product.images.length > 0 ? (
                <img
                  src={product.images[selectedImage] || product.images[0]}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300">
                  <svg className="w-24 h-24" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <path d="M21 15l-5-5L5 21" />
                  </svg>
                </div>
              )}
            </div>
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2 mt-3">
                {product.images.map((url, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === i ? "border-[#EA553B]" : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <img src={url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <p className="text-[11px] text-gray-500 uppercase tracking-wider mb-1">{product.category}</p>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.title}</h1>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl font-bold text-[#EA553B]">{product.price.toFixed(2)} SAR</span>
              <span className="bg-gray-100 text-gray-600 text-xs font-medium px-3 py-1 rounded-full">
                {conditionLabels[product.condition] || product.condition}
              </span>
            </div>

            <p className="text-sm text-gray-600 leading-relaxed mb-6">
              {product.description || "No description provided."}
            </p>

            <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#EA553B]/10 flex items-center justify-center text-[#EA553B] font-bold">
                  {product.seller_name?.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Seller</p>
                  <p className="text-xs text-gray-500">{product.seller_name}</p>
                </div>
              </div>
            </div>

            <a
              href={contactSellerHref(product)}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#20BD5A] text-white rounded-xl py-3.5 font-semibold text-sm transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10a9.96 9.96 0 005.168-1.438L22 22l-1.418-4.985A9.945 9.945 0 0022 12c0-5.523-4.477-10-10-10z" />
              </svg>
              Contact Seller on WhatsApp
            </a>

            <p className="text-[10px] text-gray-400 text-center mt-2">
              Listed {new Date(product.created_at).toLocaleDateString()}
            </p>

            <div className="mt-6">
              <Link href="/marketplace" className="text-[#EA553B] text-sm hover:underline inline-flex items-center gap-1">
                ← Browse more products
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
