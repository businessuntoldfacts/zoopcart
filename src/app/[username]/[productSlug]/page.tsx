import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Heart, ArrowLeft, Share2, ShieldCheck, Zap } from "lucide-react";
import Link from "next/link";
import ClientTracker from "@/components/ClientTracker";

export default async function ProductDetailPage({ params }: { params: { username: string, productSlug: string } }) {
  const { data: business } = await supabase
    .from('businesses')
    .select('*')
    .eq('username', params.username.toLowerCase())
    .single();

  if (!business) notFound();

  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('business_id', business.id)
    .eq('slug', params.productSlug)
    .single();

  if (!product) notFound();

  
  let cleanDescription = product.description || "";
  let deliveryData = null;
  if (cleanDescription.includes('---ZYP_DELIVERY:')) {
    const parts = cleanDescription.split('---ZYP_DELIVERY:');
    cleanDescription = parts[0].trim();
    try {
      deliveryData = JSON.parse(parts[1].split('---')[0]);
    } catch(e) {}
  } else if (cleanDescription.includes('---ZOOPCART_DELIVERY:')) {
    const parts = cleanDescription.split('---ZOOPCART_DELIVERY:');
    cleanDescription = parts[0].trim();
    try {
      deliveryData = JSON.parse(parts[1].split('---')[0]);
    } catch(e) {}
  }

  return (

    <div className="min-h-screen bg-slate-50 font-sans pb-32 relative">
      <ClientTracker businessId={business.id} productId={product.id} type="product_view" />
      
      {/* Top Header - Floating */}
      <header className="fixed top-0 w-full z-50 flex items-center justify-between px-4 h-16">
        <Link href={`/${business.username}`} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/80 text-slate-900 backdrop-blur-md shadow-sm border border-slate-100/50">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex items-center gap-3">
          <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white/80 text-slate-900 backdrop-blur-md shadow-sm border border-slate-100/50">
            <Share2 className="w-4 h-4" />
          </button>
          <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white/80 text-[#111111] backdrop-blur-md shadow-sm border border-slate-100/50">
            <Heart className="w-5 h-5 fill-current" />
          </button>
        </div>
      </header>

      <div className="max-w-md mx-auto relative bg-white min-h-screen">
        {/* Product Image Slider */}
        <div className="w-full aspect-[4/3] bg-slate-100 relative">
          {product.image ? (
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          ) : (
             <div className="w-full h-full flex items-center justify-center text-slate-300 font-extrabold text-2xl">Zoopcart</div>
          )}
          {/* Mock Slider Dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 bg-black/20 px-3 py-1.5 rounded-full backdrop-blur-sm">
             <div className="w-2 h-2 rounded-full bg-white"></div>
             <div className="w-2 h-2 rounded-full bg-white/50"></div>
             <div className="w-2 h-2 rounded-full bg-white/50"></div>
          </div>
        </div>

        <div className="p-6">
          {/* Title & Price */}
          <h1 className="text-2xl font-extrabold text-slate-900 leading-tight mb-2">{product.name}</h1>
          <div className="flex items-end gap-3 mb-4">
             <span className="text-3xl font-extrabold text-[#111111]">₹{product.price}</span>
             {product.original_price && (
               <span className="text-lg font-bold text-slate-400 line-through mb-1">₹{product.original_price}</span>
             )}
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-xs font-bold text-green-600 bg-green-50 self-start px-2.5 py-1 rounded-md">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
              In stock
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-600 bg-slate-50 self-start px-2.5 py-1 rounded-md">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-500"><path d="M5 12l5 5l10 -10"></path></svg>
              Ships within 2-3 days
            </div>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-slate-100">
             <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-100 text-[#111111] flex items-center justify-center shrink-0">
                   <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                   <h4 className="text-xs font-extrabold text-slate-900 mb-0.5">Secure payments</h4>
                   <p className="text-[10px] font-medium text-slate-500">Pay safely over UPI</p>
                </div>
             </div>
             <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-100 text-indigo-500 flex items-center justify-center shrink-0">
                   <Zap className="w-5 h-5" />
                </div>
                <div>
                   <h4 className="text-xs font-extrabold text-slate-900 mb-0.5">Fast delivery</h4>
                   <p className="text-[10px] font-medium text-slate-500">Ships nationwide</p>
                </div>
             </div>
          </div>

          {/* Details */}
          <div className="mt-8 pt-8 border-t border-slate-100">
             <div className="flex items-center gap-2 mb-4">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                <h3 className="font-extrabold text-lg text-slate-900">Details</h3>
             </div>
             <p className="text-sm text-slate-600 font-medium leading-relaxed whitespace-pre-wrap">
               {cleanDescription || "This is a sample product. You can add key features, specifications and other important information here for your customers."}
             </p>
             {deliveryData && deliveryData.video && (
               <div className="mt-6">
                 <a href={deliveryData.video} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full py-4 bg-red-50 text-red-600 font-bold rounded-2xl hover:bg-red-100 transition-colors">
                   <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
                   Watch Product Video
                 </a>
               </div>
             )}

          </div>
        </div>

        {/* Fixed Bottom Action Bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 z-50 p-4 pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.06)]">
          <div className="max-w-md mx-auto">
            <Link href={`/${business.username}/${product.slug}/request`}>
              <button className="w-full h-14 rounded-2xl bg-[#111111] hover:bg-[#111111] text-white font-extrabold text-lg flex items-center justify-center gap-2 shadow-lg shadow-black/20 transition-all active:scale-[0.98]">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                Request This Product
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
