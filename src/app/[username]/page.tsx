import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Heart, ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import ClientTracker from "@/components/ClientTracker";

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

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      <ClientTracker businessId={business.id} type="store_view" />
      
      {/* Top Header */}
      <header className="bg-white px-4 h-14 flex items-center justify-between sticky top-0 z-50 border-b border-slate-100 shadow-sm">
        <div className="flex items-center gap-2">
          <h1 className="font-extrabold text-sm text-slate-900 tracking-tight">{business.username}</h1>
        </div>
        <div className="flex items-center gap-4">
          <Link href={`/${business.username}/saved`} className="text-slate-600 hover:text-pink-600 transition-colors">
             <Heart className="w-5 h-5" />
          </Link>
        </div>
      </header>

      <div className="max-w-md mx-auto bg-white min-h-screen relative shadow-sm border-x border-slate-100">
        
        {/* Store Profile Section */}
        <div className="px-6 pt-6 pb-8 border-b border-slate-100 mb-2 flex flex-col items-center text-center">
           <div className="w-24 h-24 rounded-full overflow-hidden bg-slate-100 border border-slate-200 shadow-sm mb-4">
              {business.profile_image ? (
                <img src={business.profile_image} alt={business.business_name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-pink-50 text-pink-600 font-extrabold text-3xl">
                  {business.business_name?.charAt(0)}
                </div>
              )}
           </div>
           <h2 className="text-base sm:text-lg font-extrabold text-slate-900">{business.business_name}</h2>
           {business.business_description && (
             <p className="text-sm font-medium text-slate-500 mt-2 max-w-[280px] leading-relaxed">
               {business.business_description}
             </p>
           )}
           <div className="flex items-center gap-8 mt-5">
              <div className="flex flex-col items-center">
                 <span className="font-extrabold text-slate-900">{products.length}</span>
                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Products</span>
              </div>
              <div className="flex flex-col items-center">
                 <span className="font-extrabold text-slate-900">5.0</span>
                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Rating</span>
              </div>
           </div>
        </div>

        {/* Products List */}
        <div className="px-4 mt-6 pb-24">
          <h3 className="font-extrabold text-sm text-slate-900 mb-4 px-2 uppercase tracking-wider">All Products</h3>
          
          {products.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-3xl border border-slate-100">
              <h3 className="font-extrabold text-lg text-slate-900">No products yet</h3>
              <p className="text-sm text-slate-500 mt-1">Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
{products.map((product: any) => (
              <Link href={`/${business.username}/${product.slug}`} key={product.id} className="block group bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden hover:border-pink-200 transition-colors">
                <div className={`w-full bg-slate-50 overflow-hidden relative ${product.image ? "aspect-square" : "h-48"}`}>
                  {product.image ? (
                     <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                     <div className="w-full h-full flex items-center justify-center text-slate-300 font-bold text-lg">No Image</div>
                  )}
                  <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
                <div className="p-3">
                  <div className="text-[10px] font-extrabold tracking-widest text-pink-500 uppercase mb-2">General</div>
                  <h3 className="font-extrabold text-sm sm:text-base text-slate-900 leading-tight mb-2 line-clamp-2 group-hover:text-pink-600 transition-colors">{product.name}</h3>
                  <div className="flex items-baseline gap-2 mt-3">
                    <span className="text-base sm:text-lg font-extrabold text-slate-900">₹{product.price}</span>
                    {product.original_price && (
                      <span className="text-xs font-bold text-slate-400 line-through">₹{product.original_price}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-green-600 mt-3 bg-green-50 self-start inline-flex px-2 py-1 rounded-md">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                    In stock &middot; ships soon
                  </div>
                </div>
              </Link>
))}
</div>
)}
</div>

        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
          <div className="max-w-md mx-auto flex items-center justify-around h-16 px-6">
            <Link href={`/${business.username}`} className="flex flex-col items-center justify-center w-16 h-full gap-1 text-pink-600">
              <div className="relative">
                 <div className="absolute inset-0 bg-pink-100 rounded-full blur-md opacity-50 scale-150"></div>
                 <div className="w-5 h-5 bg-pink-600 rounded-md rotate-45 relative flex items-center justify-center shadow-inner">
                    <div className="w-2.5 h-2.5 bg-white rounded-sm -rotate-45"></div>
                 </div>
              </div>
              <span className="text-[10px] font-extrabold mt-1">Shop</span>
            </Link>
            
            <Link href={`/${business.username}/saved`} className="flex flex-col items-center justify-center w-16 h-full gap-1 text-slate-400 hover:text-slate-900 transition-colors">
              <Heart className="w-5 h-5" />
              <span className="text-[10px] font-extrabold">Saved</span>
            </Link>
            
            <Link href={`/${business.username}/track`} className="flex flex-col items-center justify-center w-16 h-full gap-1 text-slate-400 hover:text-slate-900 transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
              <span className="text-[10px] font-extrabold">Track</span>
            </Link>
          </div>
        </nav>

        <footer className="px-4 py-8 pb-32 text-center bg-slate-50 border-t border-slate-100">
          <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-3">
             <div className="w-3 h-3 bg-slate-400 rounded-sm rotate-45"></div>
          </div>
          <div className="text-xs font-bold text-slate-500 flex flex-col gap-2">
            <p>© 2026 {business.business_name}. All rights reserved.</p>
            <p>Powered by <a href="/" className="text-slate-400 hover:text-pink-500 transition-colors">Zypcart</a></p>
          </div>
        </footer>

      </div>
    </div>
  );
}
