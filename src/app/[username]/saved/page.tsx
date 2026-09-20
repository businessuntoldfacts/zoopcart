"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Heart, ArrowLeft, Loader2, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import StoreBottomNav from "@/components/StoreBottomNav";

export default function SavedPage({ params }: { params: { username: string } }) {
  const router = useRouter();
  const [business, setBusiness] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [savedIds, setSavedIds] = useState<string[]>([]);

  useEffect(() => {
    async function fetchData() {
      const { data: b } = await supabase
        .from('businesses')
        .select('*')
        .eq('username', params.username.toLowerCase())
        .single();

      if (!b) return router.push('/');
      setBusiness(b);

      const saved = localStorage.getItem('zypcart_saved');
      if (saved) {
        try {
          const ids = JSON.parse(saved);
          setSavedIds(ids);
          if (ids.length > 0) {
            const { data: p } = await supabase
              .from('products')
              .select('*')
              .in('id', ids)
              .eq('business_id', b.id);
            setProducts(p || []);
          }
        } catch (e) {
          console.error("Error parsing saved items", e);
        }
      }
      setLoading(false);
    }
    fetchData();
  }, [params.username, router]);

  const removeSaved = (productId: string) => {
    const newSaved = savedIds.filter(id => id !== productId);
    setSavedIds(newSaved);
    setProducts(products.filter(p => p.id !== productId));
    localStorage.setItem('zypcart_saved', JSON.stringify(newSaved));
    window.dispatchEvent(new Event('cart-updated'));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-slate-300 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-24">
      {/* Top Header */}
      <header className="bg-white px-4 h-16 flex items-center justify-center sticky top-0 z-50 border-b border-slate-100 shadow-sm relative">
        <Link href={`/${business.username}`} className="absolute left-4 w-10 h-10 flex items-center justify-center text-slate-900">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="font-extrabold text-base text-slate-900 tracking-tight">Saved Items</h1>
      </header>

      <div className="max-w-md mx-auto px-4 pt-6">
        {products.length === 0 ? (
          <div className="pt-24 pb-12 flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center mb-6 shadow-sm border border-slate-100">
              <Heart className="w-8 h-8 text-slate-200" />
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 mb-2">No saved items</h2>
            <p className="text-sm font-medium text-slate-500 leading-relaxed max-w-[260px] mb-8">
              Items you heart will appear here so you can find them later.
            </p>
            <Link href={`/${business.username}`}>
              <button className="px-8 py-3.5 bg-[#111111] text-white font-extrabold rounded-2xl shadow-lg shadow-black/10 transition-transform active:scale-95 text-sm">
                Go Shopping
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex p-3 gap-4 relative">
                <div className="w-24 h-24 rounded-2xl overflow-hidden bg-slate-50 shrink-0 border border-slate-50">
                  {product.image ? (
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300 font-bold text-[10px]">No Image</div>
                  )}
                </div>
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900 leading-tight line-clamp-2 pr-8">{product.name}</h3>
                    <div className="text-base font-extrabold text-slate-900 mt-1">₹{product.price}</div>
                  </div>
                  <Link href={`/${business.username}/${product.slug}`} className="mt-2">
                    <button className="w-full py-2 bg-slate-900 text-white text-[11px] font-extrabold rounded-xl flex items-center justify-center gap-2">
                      View Product
                    </button>
                  </Link>
                </div>
                <button
                  onClick={() => removeSaved(product.id)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-red-500 shadow-sm"
                >
                  <Heart className="w-4 h-4 fill-current" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <StoreBottomNav username={business.username} />
    </div>
  );
}
