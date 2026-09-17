import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { ChevronLeft, Search, ShoppingBag, Star, Share2, Copy, Heart, MessageCircle, ArrowRight, ShieldCheck, Zap, Award, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function ProductPage({ params }: { params: { username: string, productSlug: string } }) {
  const { data: business } = await supabase
    .from('businesses')
    .select('id, business_name, username, whatsapp_country_code, whatsapp_number')
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
    <div className="min-h-screen bg-white font-sans pb-24">
      {/* Header */}
      <header className="bg-white px-4 h-14 flex items-center justify-between sticky top-0 z-50">
        <Link href={`/${business.username}`} className="w-10 h-10 flex items-center justify-center -ml-2">
          <ChevronLeft className="w-6 h-6 text-[#0F172A]" />
        </Link>
        <div className="flex items-center gap-2 font-extrabold text-[#0F172A] text-lg">
          <div className="w-5 h-5 bg-zyp-primary rounded flex items-center justify-center font-bold text-white text-xs tracking-tighter italic">e</div>
          Zypcart
        </div>
        <div className="flex gap-2">
          <button className="w-10 h-10 flex items-center justify-center"><Search className="w-5 h-5 text-[#0F172A]" /></button>
          <button className="w-10 h-10 flex items-center justify-center"><ShoppingBag className="w-5 h-5 text-[#0F172A]" /></button>
        </div>
      </header>

      <div className="max-w-md mx-auto relative">
        {/* Breadcrumb */}
        <div className="px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
          <Link href="/" className="hover:text-zyp-primary">Home</Link>
          <span>›</span>
          <Link href={`/${business.username}`} className="hover:text-zyp-primary">{business.business_name}</Link>
          <span>›</span>
          <span className="text-zyp-primary truncate">{product.name}</span>
        </div>

        {/* Product Image */}
        <div className="w-full aspect-square bg-slate-100 relative">
          {product.image ? (
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-300">No Image</div>
          )}
          <button className="absolute top-4 right-4 w-10 h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center shadow-sm">
            <Heart className="w-5 h-5 text-[#0F172A]" />
          </button>
          
          {/* Floating Badges */}
          <div className="absolute -bottom-3 left-4 flex gap-2 overflow-x-auto pr-4 scrollbar-hide">
            <span className="bg-white border border-slate-100 px-3 py-1.5 rounded-full text-[10px] font-bold text-[#0F172A] shadow-sm flex items-center gap-1 shrink-0 whitespace-nowrap">
              <Award className="w-3 h-3 text-yellow-500" /> Bestseller
            </span>
            <span className="bg-white border border-slate-100 px-3 py-1.5 rounded-full text-[10px] font-bold text-green-600 shadow-sm flex items-center gap-1 shrink-0 whitespace-nowrap">
              <Sparkles className="w-3 h-3" /> Freshly Baked
            </span>
          </div>
        </div>

        {/* Product Info */}
        <div className="px-4 pt-8 pb-4">
          <h1 className="text-2xl font-extrabold text-[#0F172A] mb-2 leading-tight">{product.name}</h1>
          
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="flex text-yellow-400">
                <Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current opacity-30" />
              </div>
              <span className="text-xs font-bold text-slate-500">4.8 (124 reviews)</span>
            </div>
            <div className="flex gap-2">
              <button className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center"><Share2 className="w-4 h-4 text-slate-600" /></button>
            </div>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl font-extrabold text-[#0F172A]">₹{product.price}</span>
            <span className="text-lg font-bold text-slate-400 line-through">₹{Math.round(product.price * 1.3)}</span>
            <span className="px-2 py-1 rounded bg-green-100 text-green-700 text-xs font-bold uppercase tracking-wider">29% OFF</span>
          </div>

          <p className="text-sm text-slate-600 leading-relaxed font-medium mb-8">
            {product.short_description} {product.description}
          </p>
          
          {/* Feature Grid */}
          <div className="grid grid-cols-4 gap-2 mb-8 border-y border-slate-100 py-6">
             <div className="flex flex-col items-center text-center gap-2">
               <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center"><Sparkles className="w-5 h-5 text-green-600" /></div>
               <span className="text-[9px] font-bold text-slate-500 uppercase">100% Fresh</span>
             </div>
             <div className="flex flex-col items-center text-center gap-2">
               <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center"><Award className="w-5 h-5 text-blue-600" /></div>
               <span className="text-[9px] font-bold text-slate-500 uppercase">Premium Quality</span>
             </div>
             <div className="flex flex-col items-center text-center gap-2">
               <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center"><Zap className="w-5 h-5 text-purple-600" /></div>
               <span className="text-[9px] font-bold text-slate-500 uppercase">Custom Orders</span>
             </div>
             <div className="flex flex-col items-center text-center gap-2">
               <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center"><ShieldCheck className="w-5 h-5 text-orange-600" /></div>
               <span className="text-[9px] font-bold text-slate-500 uppercase">Safe & Secure</span>
             </div>
          </div>

          <div className="mb-6">
            <label className="text-sm font-bold text-[#0F172A] mb-3 block">Quantity</label>
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50">
                <button className="w-10 h-10 flex items-center justify-center font-bold text-xl text-slate-400 hover:text-[#0F172A]">-</button>
                <div className="w-12 text-center font-extrabold text-[#0F172A]">1</div>
                <button className="w-10 h-10 flex items-center justify-center font-bold text-xl text-slate-400 hover:text-[#0F172A]">+</button>
              </div>
              <span className="text-xs font-bold text-slate-400">Min. 1 order</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 p-4 pb-safe shadow-[0_-10px_20px_rgba(0,0,0,0.03)] z-50">
        <div className="max-w-md mx-auto flex flex-col gap-3">
          <Link href={`/${business.username}/${product.slug}/request`}>
            <Button variant="primary" className="w-full h-14 rounded-2xl text-lg font-bold shadow-lg shadow-zyp-primary/20 bg-zyp-primary">
              Request This Product <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
          <a href={`https://wa.me/${business.whatsapp_country_code}${business.whatsapp_number}?text=Hi, I am interested in ${product.name}`} target="_blank">
            <Button variant="secondary" className="w-full h-12 rounded-xl text-sm font-bold bg-green-50 text-green-700 border-none hover:bg-green-100">
              <MessageCircle className="w-4 h-4 mr-2" /> Ask on WhatsApp
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
