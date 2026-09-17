import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Heart, ArrowLeft, ShieldCheck, Zap, FileText, Truck, Share2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ClientTracker from "@/components/ClientTracker";
import ReviewSystem from "@/components/ReviewSystem";
import CheckoutModal from "@/components/CheckoutModal";

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

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-32">
      <ClientTracker businessId={business.id} productId={product.id} type="product_view" />
      
      {/* Top Header */}
      <header className="bg-white px-4 h-16 flex items-center justify-between sticky top-0 z-50 border-b border-slate-100 shadow-sm">
        <div className="flex items-center gap-3">
          <Link href={`/${business.username}`} className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-50 hover:bg-slate-100 transition-colors text-slate-900">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="font-extrabold text-sm text-slate-900">Store <span className="text-slate-400 font-medium">/</span> Shop {business.business_name}</div>
        </div>
        <div className="flex items-center gap-4">
          <Link href={`/${business.username}/saved`} className="text-slate-600 hover:text-pink-600 transition-colors">
            <Heart className="w-6 h-6" />
          </Link>
        </div>
      </header>

      <div className="max-w-md mx-auto bg-white min-h-[calc(100vh-64px)] relative shadow-sm border-x border-slate-100">
        
        {/* Product Image */}
        <div className={`w-full bg-slate-100 rounded-b-[40px] overflow-hidden relative ${product.image ? "aspect-[4/5] sm:aspect-square" : "h-64"}`}>
          {product.image ? (
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold text-lg">
              No Image
            </div>
          )}
          <div className="absolute top-4 right-4 flex flex-col gap-3">
             <button className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-md shadow-lg flex items-center justify-center text-slate-900 hover:text-pink-600 transition-colors">
               <Heart className="w-6 h-6" />
             </button>
             <button className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-md shadow-lg flex items-center justify-center text-slate-900 hover:text-blue-600 transition-colors">
               <Share2 className="w-5 h-5" />
             </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="px-5 py-6">
            <div className="text-[10px] font-extrabold tracking-widest text-pink-500 uppercase mb-3">General</div>
            <h1 className="text-3xl font-extrabold text-slate-900 leading-tight mb-2">{product.name}</h1>
            <div className="flex items-baseline gap-2 mb-4">
               <span className="text-3xl font-extrabold text-slate-900">₹{product.price}</span>
               {product.original_price && (
                 <span className="text-lg font-bold text-slate-400 line-through">₹{product.original_price}</span>
               )}
            </div>

            <div className="flex items-center gap-2 text-sm font-bold text-green-600 mb-8 bg-green-50 self-start inline-flex px-3 py-1.5 rounded-lg">
               <div className="w-2 h-2 rounded-full bg-green-500"></div>
               In stock &middot; ships soon
            </div>

            {/* USPs */}
            <div className="grid grid-cols-2 gap-3 mb-10">
               <div className="bg-slate-50 p-4 rounded-2xl flex flex-col gap-2">
                 <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center">
                   <ShieldCheck className="w-4 h-4 text-pink-600" />
                 </div>
                 <div>
                   <div className="font-extrabold text-[11px] text-slate-900">Secure payments</div>
                   <div className="font-medium text-[10px] text-slate-500 mt-0.5">Pay safely over UPI</div>
                 </div>
               </div>
               <div className="bg-slate-50 p-4 rounded-2xl flex flex-col gap-2">
                 <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                   <Truck className="w-4 h-4 text-blue-600" />
                 </div>
                 <div>
                   <div className="font-extrabold text-[11px] text-slate-900">Fast delivery</div>
                   <div className="font-medium text-[10px] text-slate-500 mt-0.5">Ships nationwide</div>
                 </div>
               </div>
            </div>

            {/* Description */}
            <div className="mb-10">
               <h3 className="font-extrabold text-lg text-slate-900 flex items-center gap-2 mb-4">
                 <FileText className="w-5 h-5 text-slate-400" /> Details
               </h3>
               <div className="text-slate-600 font-medium text-sm leading-relaxed whitespace-pre-wrap bg-slate-50 p-5 rounded-3xl">
                 {product.description || "No description available for this product."}
               </div>
            </div>

            <div className="flex gap-3 mt-8">
               <CheckoutModal business={business} product={product} />
            </div>
        </div>

        <div className="px-5 pb-8 bg-white"><ReviewSystem businessId={business.id} productId={product.id} /></div>
      </div>

      {/* Fixed Sticky Footer for Mobile */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 p-4 pb-safe z-50">
        <div className="max-w-md mx-auto">
          <CheckoutModal business={business} product={product} />
        </div>
      </div>

    </div>
  );
}



