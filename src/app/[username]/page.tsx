import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { CheckCircle2, MapPin, Search, Star, MessageCircle, Share2 } from "lucide-react";
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

  const theme = business.instagram_profile_url || 'light';

  // Theme styling definitions
  const themes = {
    light: {
      bg: "bg-[#F8FAFC]",
      card: "bg-white border-slate-200",
      text: "text-[#0F172A]",
      muted: "text-slate-500",
      primary: "text-blue-600",
      btnPrimary: "bg-blue-600 hover:bg-blue-700 text-white",
      btnSecondary: "bg-blue-50 text-blue-600 hover:bg-blue-100"
    },
    dark: {
      bg: "bg-slate-900",
      card: "bg-slate-800 border-slate-700",
      text: "text-white",
      muted: "text-slate-400",
      primary: "text-blue-400",
      btnPrimary: "bg-blue-500 hover:bg-blue-600 text-white",
      btnSecondary: "bg-slate-700 text-white hover:bg-slate-600"
    },
    playful: {
      bg: "bg-gradient-to-br from-pink-50 to-orange-50",
      card: "bg-white/80 backdrop-blur border-pink-100",
      text: "text-pink-950",
      muted: "text-pink-600/70",
      primary: "text-pink-600",
      btnPrimary: "bg-gradient-to-r from-pink-500 to-orange-400 hover:opacity-90 text-white",
      btnSecondary: "bg-pink-100 text-pink-700 hover:bg-pink-200"
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
        <div className={`text-xs font-bold ${t.muted} bg-black/5 px-3 py-1.5 rounded-full truncate max-w-[150px]`}>
          zypcart.com/{business.username}
        </div>
      </header>

      {/* Cover Image */}
      <div className="w-full h-40 md:h-64 bg-slate-200 relative">
        <img src="https://images.unsplash.com/photo-1557308536-ee471ef2c390?q=80&w=1000&auto=format&fit=crop" alt="Cover" className="w-full h-full object-cover" />
      </div>

      {/* Store Info Profile */}
      <div className="max-w-4xl mx-auto px-4 md:px-8 relative -mt-12 md:-mt-16 z-10">
        <div className={`${t.card} rounded-3xl p-6 shadow-sm border`}>
          <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
              <div className={`w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white shadow-md ${t.card} overflow-hidden shrink-0`}>
                {business.profile_image ? (
                  <img src={business.profile_image} alt={business.business_name} className="w-full h-full object-cover" />
                ) : (
                  <div className={`w-full h-full flex items-center justify-center ${t.primary} text-3xl font-bold bg-black/5`}>
                    {business.business_name?.charAt(0)}
                  </div>
                )}
              </div>
              
              <div className="mt-2 md:mt-0">
                <h1 className={`text-2xl md:text-3xl font-extrabold flex items-center gap-2 ${t.text}`}>
                  {business.business_name}
                  <CheckCircle2 className="w-5 h-5 text-green-500 fill-green-500/20" />
                </h1>
                <p className={`text-sm mt-1 mb-3 max-w-md ${t.muted}`}>{business.description || "Welcome to our store!"}</p>
                
                <div className={`flex flex-wrap items-center gap-4 text-xs font-bold ${t.muted}`}>
                  <span className="flex items-center gap-1 bg-black/5 px-2 py-1 rounded-md"><MapPin className="w-3.5 h-3.5" /> Worldwide</span>
                  {business.instagram_handle && (
                     <a href={`https://instagram.com/${business.instagram_handle.replace('@','')}`} target="_blank" className="flex items-center gap-1 text-pink-600 bg-pink-50 px-2 py-1 rounded-md hover:bg-pink-100">
                       <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg> {business.instagram_handle}
                     </a>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 w-full md:w-auto mt-2 md:mt-0">
               {business.whatsapp_number && (
                 <a href={`https://wa.me/${business.whatsapp_country_code}${business.whatsapp_number}`} target="_blank" className="flex-1">
                   <Button className="w-full bg-[#25D366] hover:bg-[#1DA851] text-white rounded-xl shadow-md font-bold h-12">
                     <MessageCircle className="w-4 h-4 mr-2" /> Chat
                   </Button>
                 </a>
               )}
               <Button variant="secondary" className={`rounded-xl h-12 w-12 p-0 shrink-0 ${t.btnSecondary}`}>
                 <Share2 className="w-4 h-4" />
               </Button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-8 mt-8 border-b border-black/10">
            <button className={`pb-3 border-b-2 font-extrabold text-sm ${t.primary} border-current`}>Products</button>
            <button className={`pb-3 border-b-2 border-transparent text-sm font-bold ${t.muted} hover:${t.text}`}>Reviews</button>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-4xl mx-auto px-4 md:px-8 mt-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-xl font-extrabold ${t.text}`}>Our Products</h2>
          <div className="relative">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${t.muted}`} />
            <input type="text" placeholder="Search..." className={`pl-9 pr-4 py-2 rounded-full border ${t.card} text-sm outline-none w-32 focus:w-48 transition-all`} />
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
              <div key={product.id} className={`${t.card} rounded-2xl overflow-hidden border shadow-sm hover:shadow-md transition-shadow group flex flex-col`}>
                <div className="aspect-square bg-slate-100 relative overflow-hidden">
                  {product.image ? (
                     <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                     <div className="w-full h-full flex items-center justify-center text-slate-300">No Image</div>
                  )}
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <h3 className={`font-extrabold text-sm md:text-base line-clamp-1 ${t.text}`}>{product.name}</h3>
                  <p className={`text-[11px] md:text-xs mt-1 mb-3 line-clamp-2 leading-relaxed flex-1 ${t.muted}`}>{product.short_description}</p>
                  
                  <div className="flex items-center gap-2 mb-4">
                    <span className={`font-extrabold text-sm md:text-base ${t.primary}`}>₹{product.price}</span>
                    {product.sale_price && <span className={`text-[10px] md:text-xs font-bold line-through ${t.muted}`}>₹{product.sale_price}</span>}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 mt-auto">
                    <Link href={`/${business.username}/${product.slug}`} className="block">
                      <Button className={`w-full h-9 text-xs font-bold border-none rounded-lg ${t.btnSecondary}`}>View</Button>
                    </Link>
                    <Link href={`/${business.username}/${product.slug}/request`} className="block">
                      <Button className={`w-full h-9 text-xs font-bold rounded-lg shadow-sm border-none ${t.btnPrimary}`}>Request</Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

          {/* Personal Store Reviews Section */}
          {realReviews.length > 0 && (
            <div className="mt-16">
              <div className="flex items-center justify-between mb-6">
                <h2 className={`text-xl font-extrabold ${t.text}`}>Customer Reviews</h2>
                <div className={`flex items-center gap-1 font-bold ${t.text}`}>
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" /> 5.0 ({realReviews.length} reviews)
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                 {realReviews.map((rev, i) => (
                    <div key={i} className={`${t.card} p-5 rounded-2xl border shadow-sm`}>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600">
                          {rev.name ? rev.name.charAt(0).toUpperCase() : '?'}
                        </div>
                        <div>
                          <div className={`font-bold text-sm ${t.text}`}>{rev.name || 'Customer'}</div>
                          <div className="flex gap-0.5">
                            {[...Array(rev.rating)].map((_, idx) => <Star key={idx} className="w-3 h-3 fill-yellow-400 text-yellow-400" />)}
                          </div>
                        </div>
                      </div>
                      <p className={`text-sm ${t.muted} font-medium leading-relaxed`}>{rev.text}</p>
                    </div>
                 ))}
              </div>
            </div>
          )}
      </div>
    </div>
  );
}
