"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Heart, ArrowLeft, Share2, ShieldCheck, Zap, ShoppingCart, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ClientTracker from "@/components/ClientTracker";
import { motion } from "framer-motion";

export default function ProductDetailPage({ params }: { params: { username: string, productSlug: string } }) {
  const router = useRouter();
  const [business, setBusiness] = useState<any>(null);
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    async function fetchData() {
      const { data: b } = await supabase
        .from('businesses')
        .select('*')
        .eq('username', params.username.toLowerCase())
        .single();

      if (!b) return router.push('/');
      setBusiness(b);

      const { data: p } = await supabase
        .from('products')
        .select('*')
        .eq('business_id', b.id)
        .eq('slug', params.productSlug)
        .single();

      if (!p) return router.push(`/${b.username}`);
      setProduct(p);

      const saved = JSON.parse(localStorage.getItem('zypcart_saved') || '[]');
      setIsSaved(saved.includes(p.id));

      const cart = JSON.parse(localStorage.getItem('zypcart_cart') || '[]');
      setCartCount(cart.length);

      setLoading(false);
    }
    fetchData();
  }, [params.username, params.productSlug, router]);

  const toggleSave = () => {
    if (!product) return;
    const saved = JSON.parse(localStorage.getItem('zypcart_saved') || '[]');
    let newSaved;
    if (saved.includes(product.id)) {
      newSaved = saved.filter((id: string) => id !== product.id);
      setIsSaved(false);
    } else {
      newSaved = [...saved, product.id];
      setIsSaved(true);
    }
    localStorage.setItem('zypcart_saved', JSON.stringify(newSaved));
    window.dispatchEvent(new Event('cart-updated'));
  };

  const addToCart = () => {
    if (!product) return;
    const cart = JSON.parse(localStorage.getItem('zypcart_cart') || '[]');
    const existingIndex = cart.findIndex((item: any) => item.id === product.id);

    if (existingIndex > -1) {
      cart[existingIndex].quantity += 1;
    } else {
      cart.push({ id: product.id, quantity: 1 });
    }

    localStorage.setItem('zypcart_cart', JSON.stringify(cart));
    setCartCount(cart.length);
    window.dispatchEvent(new Event('cart-updated'));
    alert("Added to cart!");
  };

  if (loading || !product || !business) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-slate-300 animate-spin" />
      </div>
    );
  }

  let cleanDescription = product.description || "";

  return (
    <div className="min-h-screen bg-white font-sans pb-32 relative overflow-x-hidden">
      <ClientTracker businessId={business.id} productId={product.id} type="product_view" />
      
      {/* Top Header - Floating */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-0 w-full z-50 flex items-center justify-between px-4 h-16 pointer-events-none"
      >
        <Link href={`/${business.username}`} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/90 text-slate-900 backdrop-blur-md shadow-md border border-slate-100/50 pointer-events-auto transition-transform active:scale-90">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex items-center gap-3 pointer-events-auto">
          <button onClick={() => {
            if (navigator.share) {
              navigator.share({ title: product.name, text: product.description, url: window.location.href });
            } else {
              navigator.clipboard.writeText(window.location.href);
              alert("Link copied!");
            }
          }} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/90 text-slate-900 backdrop-blur-md shadow-md border border-slate-100/50 transition-transform active:scale-90">
            <Share2 className="w-4 h-4" />
          </button>
          <button
            onClick={toggleSave}
            className={`w-10 h-10 flex items-center justify-center rounded-full bg-white/90 backdrop-blur-md shadow-md border border-slate-100/50 transition-all ${isSaved ? 'text-red-500 scale-110' : 'text-slate-400'}`}
          >
            <Heart className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
          </button>
        </div>
      </motion.header>

      <div className="max-w-md mx-auto relative min-h-screen">
        {/* Product Image */}
        <motion.div
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full aspect-[4/3] bg-slate-100 relative shadow-sm overflow-hidden"
        >
          {product.image ? (
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          ) : (
             <div className="w-full h-full flex items-center justify-center text-slate-300 font-extrabold text-2xl">Zoopcart</div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="p-6 bg-white rounded-t-[32px] -mt-6 relative z-10 shadow-xl shadow-slate-100"
        >
          {/* Title & Price */}
          <div className="flex flex-col mb-4">
             <div className="text-[10px] font-extrabold tracking-widest text-[#111111] uppercase mb-1">{product.category || "General"}</div>
             <h1 className="text-2xl font-extrabold text-slate-900 leading-tight mb-2 tracking-tight">{product.name}</h1>
             <div className="flex items-end gap-3">
                <span className="text-3xl font-extrabold text-[#111111]">₹{product.price}</span>
                {product.sale_price && (
                  <span className="text-lg font-bold text-slate-400 line-through mb-1">₹{product.sale_price}</span>
                )}
             </div>
          </div>

          <div className="flex gap-3 mb-8">
            <div className="flex items-center gap-1.5 text-[10px] font-extrabold text-green-600 bg-green-50 px-2.5 py-1.5 rounded-lg border border-green-100 shadow-sm">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
              IN STOCK
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-extrabold text-blue-600 bg-blue-50 px-2.5 py-1.5 rounded-lg border border-blue-100 shadow-sm">
              <Zap className="w-3 h-3 fill-current" />
              FAST SHIPPING
            </div>
          </div>

          {/* Details */}
          <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100 mb-6">
             <div className="flex items-center gap-2 mb-3">
                <h3 className="font-extrabold text-xs text-slate-400 uppercase tracking-widest">Product Details</h3>
             </div>
             <p className="text-sm text-slate-700 font-medium leading-relaxed whitespace-pre-wrap">
               {cleanDescription || "No description provided for this product."}
             </p>
          </div>

          {/* Trust Section */}
          <div className="grid grid-cols-2 gap-4">
             <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col items-center text-center">
                <ShieldCheck className="w-6 h-6 text-[#111111] mb-2" />
                <h4 className="text-[10px] font-extrabold text-slate-900 uppercase mb-0.5">Secure</h4>
                <p className="text-[9px] font-bold text-slate-400 uppercase">Trusted Seller</p>
             </div>
             <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col items-center text-center">
                <ShoppingCart className="w-6 h-6 text-[#111111] mb-2" />
                <h4 className="text-[10px] font-extrabold text-slate-900 uppercase mb-0.5">Support</h4>
                <p className="text-[9px] font-bold text-slate-400 uppercase">24/7 Help</p>
             </div>
          </div>
        </motion.div>
      </div>

      {/* Fixed Bottom Action Bar */}
      <motion.div
        initial={{ y: 80 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.2 }}
        className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 z-50 p-4 pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.06)]"
      >
        <div className="max-w-md mx-auto flex gap-3">
          <motion.button
            whileTap={{ scale: 0.93 }}
            onClick={addToCart}
            className="w-14 h-14 rounded-2xl bg-white border-2 border-slate-200 text-slate-900 flex items-center justify-center shrink-0 transition-all hover:bg-slate-50 shadow-sm"
          >
            <ShoppingCart className="w-6 h-6" />
          </motion.button>
          <Link href={`/${business.username}/${product.slug}/request`} className="flex-1">
            <motion.button
              whileTap={{ scale: 0.97 }}
              className="w-full h-14 rounded-2xl bg-[#111111] hover:bg-black text-white font-extrabold text-lg flex items-center justify-center gap-2 shadow-lg shadow-black/20 transition-all"
            >
              Request Product
            </motion.button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
