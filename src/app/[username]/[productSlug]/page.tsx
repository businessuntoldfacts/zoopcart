import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { ChevronLeft, Search, ShoppingBag, Heart, Star, Share2, Award, Sparkles, Zap, ShieldCheck, ArrowRight, MessageCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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

  let themeStr = 'light';
  try {
    if (business.instagram_profile_url && business.instagram_profile_url.startsWith('{')) {
      themeStr = JSON.parse(business.instagram_profile_url).theme || 'light';
    } else if (business.instagram_profile_url) {
      themeStr = business.instagram_profile_url;
    }
  } catch(e) {}
  const theme = themeStr;

  // Theme styling definitions
  const themes = {
    light: {
      bg: "bg-[#F8FAFC]",
      card: "bg-white",
      text: "text-[#0F172A]",
      muted: "text-slate-500",
      primary: "text-pink-600",
      btnPrimary: "bg-pink-600 hover:bg-pink-700 text-white",
      btnSecondary: "bg-pink-50 text-pink-700 hover:bg-pink-100",
      border: "border-slate-200"
    },
    dark: {
      bg: "bg-slate-950",
      card: "bg-[#0F172A]",
      text: "text-white",
      muted: "text-slate-400",
      primary: "text-blue-500",
      btnPrimary: "bg-blue-600 hover:bg-blue-700 text-white",
      btnSecondary: "bg-blue-500/10 text-blue-400 hover:bg-blue-500/20",
      border: "border-slate-800"
    },
    playful: {
      bg: "bg-yellow-50",
      card: "bg-white",
      text: "text-orange-950",
      muted: "text-orange-700/60",
      primary: "text-orange-600",
      btnPrimary: "bg-orange-500 hover:bg-orange-600 text-white",
      btnSecondary: "bg-orange-100 text-orange-800 hover:bg-orange-200",
      border: "border-yellow-200"
    }
  };

  const t = themes[theme as keyof typeof themes] || themes.light;

  return (
    <div className={`min-h-screen ${t.bg} font-sans pb-32`}>
      {/* Header */}
      <header className={`${t.card} px-4 h-14 flex items-center justify-between sticky top-0 z-50 border-b ${t.border}`}>
        <Link href={`/${business.username}`} className={`w-10 h-10 flex items-center justify-center -ml-2 ${t.text}`}>
          <ChevronLeft className="w-6 h-6" />
        </Link>
        <div className={`flex items-center gap-2 font-extrabold ${t.text} text-lg`}>
          <div className={`w-5 h-5 ${t.btnPrimary} rounded flex items-center justify-center font-bold text-white text-xs tracking-tighter italic`}>e</div>
          Zypcart
        </div>
        <div className="flex gap-2">
          <button className={`w-10 h-10 flex items-center justify-center ${t.text}`}><ShoppingBag className="w-5 h-5" /></button>
        </div>
      </header>

      <div className="max-w-md mx-auto relative bg-white md:shadow-sm md:border-x border-slate-100 md:min-h-screen">
        {/* Product Image */}
        <div className="w-full aspect-square bg-slate-100 relative">
          {product.image ? (
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-slate-50">
               <div className="flex flex-col items-center opacity-50">
                  <div className="w-16 h-16 rounded-full bg-slate-200 mb-2"></div>
                  <span className="text-slate-400 font-bold text-sm uppercase tracking-widest">No Image</span>
               </div>
            </div>
          )}
          <button className="absolute top-4 right-4 w-10 h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center shadow-sm text-slate-700 hover:text-pink-600 transition-colors">
            <Heart className="w-5 h-5" />
          </button>
        </div>

        {/* Product Info */}
        <div className={`px-5 pt-8 pb-4 ${t.card}`}>
          <div className="flex flex-wrap items-center gap-2 mb-3">
             <span className="bg-yellow-50 text-yellow-700 border border-yellow-100 px-2 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1">
                <Award className="w-3 h-3" /> Bestseller
             </span>
          </div>

          <h1 className={`text-2xl md:text-3xl font-extrabold ${t.text} mb-2 leading-tight`}>{product.name}</h1>
          
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="flex text-yellow-400">
                <Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current opacity-30" />
              </div>
              <span className={`text-xs font-bold ${t.muted}`}>4.8 (124 reviews)</span>
            </div>
            <div className="flex gap-2">
              <button className={`w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center border ${t.border}`}><Share2 className="w-4 h-4 text-slate-600" /></button>
            </div>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <span className={`text-3xl font-extrabold ${t.text}`}>₹{product.price}</span>
            {product.sale_price && (
               <>
                 <span className={`text-lg font-bold line-through ${t.muted}`}>₹{product.sale_price}</span>
                 <span className={`px-2 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wider ${t.btnSecondary}`}>Sale</span>
               </>
            )}
          </div>

          <div className={`border-t ${t.border} pt-6 mt-2`}>
             <h3 className={`text-sm font-extrabold mb-2 ${t.text}`}>Description</h3>
             <p className={`text-sm leading-relaxed font-medium ${t.muted} whitespace-pre-line`}>
               {product.description || product.short_description || "No description provided."}
             </p>
          </div>
          
          {/* Feature Grid */}
          <div className={`grid grid-cols-4 gap-2 mt-8 border-t ${t.border} pt-6`}>
             <div className="flex flex-col items-center text-center gap-2">
               <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center"><Sparkles className="w-5 h-5 text-green-600" /></div>
               <span className="text-[9px] font-bold text-slate-500 uppercase">100% Fresh</span>
             </div>
             <div className="flex flex-col items-center text-center gap-2">
               <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center"><Award className="w-5 h-5 text-blue-600" /></div>
               <span className="text-[9px] font-bold text-slate-500 uppercase">Premium</span>
             </div>
             <div className="flex flex-col items-center text-center gap-2">
               <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center"><Zap className="w-5 h-5 text-purple-600" /></div>
               <span className="text-[9px] font-bold text-slate-500 uppercase">Fast</span>
             </div>
             <div className="flex flex-col items-center text-center gap-2">
               <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center"><ShieldCheck className="w-5 h-5 text-orange-600" /></div>
               <span className="text-[9px] font-bold text-slate-500 uppercase">Secure</span>
             </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Actions */}
      <div className={`fixed bottom-0 left-0 right-0 ${t.card} border-t ${t.border} p-4 pb-safe shadow-[0_-10px_20px_rgba(0,0,0,0.05)] z-50`}>
        <div className="max-w-md mx-auto flex flex-col gap-3">
          <Link href={`/${business.username}/${product.slug}/request`}>
            <Button className={`w-full h-14 rounded-2xl text-lg font-bold shadow-lg border-none ${t.btnPrimary}`}>
              Request This Product <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
          <a href={`https://wa.me/${business.whatsapp_country_code}${business.whatsapp_number}?text=Hi, I am interested in ${product.name}`} target="_blank">
            <Button variant="secondary" className="w-full h-12 rounded-xl text-sm font-bold bg-[#25D366]/10 text-[#25D366] border-none hover:bg-[#25D366]/20">
              <MessageCircle className="w-4 h-4 mr-2" /> Ask on WhatsApp
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
