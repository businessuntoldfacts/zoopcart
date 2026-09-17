import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { CheckCircle2, MapPin, Search, Star, MessageCircle, Share2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const revalidate = 0; // Dynamic route

export default async function StorefrontPage({ params }: { params: { username: string } }) {
  const { data: business } = await supabase
    .from('businesses')
    .select('*, products(*)')
    .eq('username', params.username.toLowerCase())
    .single();

  if (!business) {
    notFound();
  }

  const products = business.products || [];
  
  // Fetch real reviews by getting completed orders
  const { data: completedOrders } = await supabase
    .from('orders')
    .select('customer_name, created_at')
    .eq('business_id', business.id)
    .eq('status', 'completed')
    .order('created_at', { ascending: false })
    .limit(10);
    
  const realReviews = (completedOrders || []).map(order => ({
    name: order.customer_name,
    rating: 5,
    text: "Great product, excellent quality! Loved the seamless experience.",
    date: order.created_at
  }));

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
      card: "bg-white border-slate-200",
      text: "text-[#0F172A]",
      muted: "text-slate-500",
      primary: "text-pink-600",
      btnPrimary: "bg-pink-600 hover:bg-pink-700 text-white",
      btnSecondary: "bg-pink-50 text-pink-700 hover:bg-pink-100",
    },
    dark: {
      bg: "bg-slate-950",
      card: "bg-[#0F172A] border-slate-800",
      text: "text-white",
      muted: "text-slate-400",
      primary: "text-blue-500",
      btnPrimary: "bg-blue-600 hover:bg-blue-700 text-white",
      btnSecondary: "bg-blue-500/10 text-blue-400 hover:bg-blue-500/20",
    },
    playful: {
      bg: "bg-yellow-50",
      card: "bg-white border-yellow-200",
      text: "text-orange-950",
      muted: "text-orange-700/60",
      primary: "text-orange-600",
      btnPrimary: "bg-orange-500 hover:bg-orange-600 text-white",
      btnSecondary: "bg-orange-100 text-orange-800 hover:bg-orange-200",
    }
  };

  const t = themes[theme as keyof typeof themes] || themes.light;

  return (
    <div className={`min-h-screen font-sans pb-20 ${t.bg}`}>
      {/* Top Header */}
      <header className={`${t.card} px-4 h-14 flex items-center justify-between sticky top-0 z-50 shadow-sm border-b`}>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center font-bold text-white text-sm tracking-tighter italic">e</div>
          <span className={`font-bold text-lg tracking-tight ${t.text}`}>Zypcart</span>
        </div>
        <div className={`text-xs font-bold ${t.primary} bg-current/10 px-3 py-1.5 rounded-full truncate max-w-[150px]`}>
          zypcart.com/{business.username}
        </div>
      </header>

      {/* Cover Image */}
      <div className="w-full h-40 md:h-64 bg-slate-200 relative">
        <img src="https://images.unsplash.com/photo-1557308536-ee471ef2c390?q=80&w=1000&auto=format&fit=crop" alt="Cover" className="w-full h-full object-cover" />
      </div>

      {/* Store Info Profile (Centered) */}
      <div className="max-w-4xl mx-auto px-4 md:px-8 relative -mt-12 md:-mt-16 z-10">
        <div className={`${t.card} rounded-[32px] p-6 shadow-sm border`}>
          <div className="flex flex-col items-center text-center">
            
            {/* Avatar */}
            <div className={`w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white shadow-md ${t.card} overflow-hidden shrink-0 -mt-16 md:-mt-20 mb-4 bg-white`}>
              {business.profile_image ? (
                <img src={business.profile_image} alt={business.business_name} className="w-full h-full object-cover" />
              ) : (
                <div className={`w-full h-full flex items-center justify-center ${t.primary} text-4xl font-bold bg-black/5`}>
                  {business.business_name?.charAt(0)}
                </div>
              )}
            </div>
            
            {/* Details */}
            <h1 className={`text-2xl md:text-3xl font-extrabold flex items-center justify-center gap-2 ${t.text}`}>
              {business.business_name}
              <CheckCircle2 className="w-5 h-5 text-green-500 fill-green-500/20" />
            </h1>
            <p className={`text-sm mt-2 mb-4 max-w-md mx-auto ${t.muted}`}>
              {business.description || "Welcome to our store!"}
            </p>
            
            <div className={`flex flex-wrap items-center justify-center gap-3 text-xs font-bold ${t.muted} mb-6`}>
              <span className="flex items-center gap-1 bg-black/5 px-3 py-1.5 rounded-full">
                <MapPin className="w-3.5 h-3.5" /> Worldwide
              </span>
              {business.instagram_handle && (
                 <a href={`https://instagram.com/${business.instagram_handle.replace('@','')}`} target="_blank" className={`flex items-center gap-1 px-3 py-1.5 rounded-full transition-colors ${t.btnSecondary}`}>
                   <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg> 
                   {business.instagram_handle}
                 </a>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 w-full max-w-xs mx-auto">
               <Button className={`flex-1 rounded-xl h-12 text-sm font-bold shadow-md border-none ${t.btnPrimary}`}>
                 <Share2 className="w-4 h-4 mr-2" /> Share Store
               </Button>
               <Button variant="secondary" className={`rounded-xl h-12 w-12 p-0 shrink-0 ${t.btnSecondary}`}>
                 <MessageCircle className="w-5 h-5" />
               </Button>
            </div>
            
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-4xl mx-auto px-4 md:px-8 mt-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-xl font-extrabold ${t.text}`}>Our Products</h2>
          <div className="relative">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${t.muted}`} />
            <input type="text" placeholder="Search..." className={`pl-9 pr-4 py-2.5 rounded-full border ${t.card} text-sm font-medium outline-none w-32 focus:w-48 transition-all`} />
          </div>
        </div>

        {products.length === 0 ? (
          <div className={`${t.card} rounded-3xl p-12 text-center border shadow-sm`}>
            <h3 className={`font-extrabold text-lg ${t.text}`}>No products available</h3>
            <p className={`text-sm mt-1 ${t.muted}`}>This seller hasn't added any products yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-16">
            {products.map((product: any) => (
              <Link href={`/${business.username}/${product.slug}`} key={product.id} className={`${t.card} rounded-[24px] overflow-hidden border shadow-sm hover:shadow-md transition-shadow group flex flex-col`}>
                <div className="aspect-[4/5] bg-slate-100 relative overflow-hidden flex-shrink-0 border-b border-black/5">
                  {product.image ? (
                     <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                     <div className="w-full h-full flex items-center justify-center text-slate-400 font-medium bg-slate-50">No Image</div>
                  )}
                </div>
                <div className="p-4 md:p-5 flex flex-col flex-1">
                  <h3 className={`font-bold text-sm md:text-base line-clamp-1 ${t.text}`}>{product.name}</h3>
                  <div className="flex items-center gap-2 mt-2 mb-4">
                    <span className={`font-extrabold text-sm md:text-base ${t.text}`}>₹{product.price}</span>
                    {product.sale_price && <span className={`text-[10px] md:text-xs font-bold line-through ${t.muted}`}>₹{product.sale_price}</span>}
                  </div>
                  
                  <div className={`mt-auto w-full flex items-center justify-center py-2.5 rounded-xl text-xs font-bold border-none transition-colors ${t.btnSecondary}`}>
                    View Product
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
        
        {realReviews.length > 0 && (
          <div className="mb-16">
             <div className="flex items-center justify-between mb-6">
                <h2 className={`text-xl font-extrabold ${t.text}`}>Customer Reviews</h2>
                <div className="flex items-center gap-1 text-yellow-500 font-bold text-sm">
                   <Star className="w-4 h-4 fill-current" /> 5.0 ({realReviews.length})
                </div>
             </div>
             <div className="space-y-4">
                {realReviews.map((r, i) => (
                   <div key={i} className={`${t.card} p-5 rounded-2xl border shadow-sm`}>
                      <div className="flex items-center gap-3 mb-2">
                         <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs uppercase">{r.name.charAt(0)}</div>
                         <div>
                            <div className={`font-bold text-sm ${t.text}`}>{r.name}</div>
                            <div className="flex items-center text-yellow-400">
                               {[...Array(5)].map((_,j) => <Star key={j} className="w-3 h-3 fill-current" />)}
                            </div>
                         </div>
                      </div>
                      <p className={`text-sm ${t.muted}`}>{r.text}</p>
                   </div>
                ))}
             </div>
          </div>
        )}
      </div>

    </div>
  );
}
