import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Heart, ShoppingCart, ArrowLeft, ShieldCheck, Zap, Repeat, FileText, ShoppingBag, Truck, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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
      
      {/* Top Header */}
      <header className="bg-white px-4 h-16 flex items-center justify-between sticky top-0 z-50 border-b border-slate-100 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
            {business.profile_image ? (
              <img src={business.profile_image} alt={business.business_name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-pink-50 text-pink-600 font-bold text-lg">
                {business.business_name?.charAt(0)}
              </div>
            )}
          </div>
          <h1 className="font-extrabold text-xl text-slate-900 tracking-tight">{business.business_name}</h1>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-slate-600 hover:text-pink-600 transition-colors">
            <Heart className="w-6 h-6" />
          </button>
          <button className="w-10 h-10 bg-pink-600 hover:bg-pink-700 text-white rounded-xl flex items-center justify-center shadow-md transition-colors relative">
            <ShoppingCart className="w-5 h-5 fill-current" />
            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-slate-900 text-white text-[9px] font-bold flex items-center justify-center rounded-full border-2 border-white">0</span>
          </button>
        </div>
      </header>

      <div className="max-w-md mx-auto bg-white min-h-screen relative shadow-sm border-x border-slate-100">
        
        {/* Breadcrumbs */}
        <div className="px-4 py-4 flex items-center gap-2 text-sm font-bold text-slate-500">
          <ArrowLeft className="w-4 h-4" />
          <span>Store</span>
          <span className="text-slate-300">/</span>
          <span className="text-slate-800">Shop {business.business_name}</span>
        </div>

        {/* Products List */}
        <div className="px-4 space-y-8 mt-2 pb-10 border-b border-slate-100">
          {products.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-3xl border border-slate-100">
              <h3 className="font-extrabold text-lg text-slate-900">No products yet</h3>
              <p className="text-sm text-slate-500 mt-1">Check back soon!</p>
            </div>
          ) : (
            products.map((product: any) => (
              <Link href={`/${business.username}/${product.slug}`} key={product.id} className="block group">
                <div className="w-full aspect-[4/5] sm:aspect-square bg-slate-100 rounded-[28px] overflow-hidden relative mb-4">
                  {product.image ? (
                     <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                     <div className="w-full h-full flex items-center justify-center text-slate-400 font-medium">No Image</div>
                  )}
                  {product.sale_price && (
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full text-xs font-extrabold text-pink-600 shadow-sm uppercase tracking-wider">
                      Sale
                    </div>
                  )}
                </div>
                
                <div>
                  <div className="text-[10px] font-extrabold text-pink-500 uppercase tracking-widest mb-1.5">{product.category || "General"}</div>
                  <h3 className="font-extrabold text-2xl text-slate-900 mb-1 leading-tight">{product.name}</h3>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-extrabold text-2xl text-slate-900">₹{product.price}</span>
                    {product.sale_price && <span className="font-bold text-lg text-slate-400 line-through">₹{product.sale_price}</span>}
                  </div>
                  <div className="flex items-center gap-1.5 text-sm font-bold text-green-600">
                    <div className="w-2 h-2 rounded-full bg-green-600"></div>
                    In stock · ships soon
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>

        {/* USPs Section */}
        <div className="px-4 py-10 bg-white">
          <div className="space-y-4">
            
            <div className="flex items-start gap-4 p-5 rounded-[24px] border border-slate-100 shadow-sm bg-white">
              <div className="w-12 h-12 rounded-2xl bg-pink-50 flex flex-col items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6 text-pink-500" />
              </div>
              <div>
                <h4 className="font-extrabold text-slate-900 text-lg mb-1">Genuine products</h4>
                <p className="text-slate-500 text-sm font-medium leading-relaxed">Every item is sourced direct — no surprises.</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 rounded-[24px] border border-slate-100 shadow-sm bg-white">
              <div className="w-12 h-12 rounded-2xl bg-yellow-50 flex flex-col items-center justify-center shrink-0">
                <Zap className="w-6 h-6 text-yellow-500 fill-yellow-500" />
              </div>
              <div>
                <h4 className="font-extrabold text-slate-900 text-lg mb-1">Fast shipping</h4>
                <p className="text-slate-500 text-sm font-medium leading-relaxed">Dispatched quickly with tracking to your door.</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 rounded-[24px] border border-slate-100 shadow-sm bg-white">
              <div className="w-12 h-12 rounded-2xl bg-pink-50 flex flex-col items-center justify-center shrink-0">
                <div className="w-3 h-3 bg-pink-500 rotate-45"></div>
              </div>
              <div>
                <h4 className="font-extrabold text-slate-900 text-lg mb-1">Easy returns</h4>
                <p className="text-slate-500 text-sm font-medium leading-relaxed">A fair, no-fuss return window on every order.</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 rounded-[24px] border border-slate-100 shadow-sm bg-white">
              <div className="w-12 h-12 rounded-2xl bg-pink-50 flex flex-col items-center justify-center shrink-0">
                <FileText className="w-6 h-6 text-pink-500" />
              </div>
              <div>
                <h4 className="font-extrabold text-slate-900 text-lg mb-1">Secure payments</h4>
                <p className="text-slate-500 text-sm font-medium leading-relaxed">Pay safely over UPI, straight to the seller.</p>
              </div>
            </div>

          </div>
        </div>

        {/* Dark Footer */}
        <footer className="bg-[#0b1021] text-white px-6 py-12 rounded-t-[32px] mt-4">
          <div className="flex items-center gap-2 mb-8">
             <div className="w-8 h-8 bg-pink-600 rounded-lg flex items-center justify-center font-bold text-white text-sm">
                {business.business_name?.charAt(0)}
             </div>
             <span className="font-extrabold text-xl">{business.business_name}</span>
          </div>

          <div className="mb-8">
            <h5 className="text-[11px] font-extrabold text-slate-400 tracking-widest uppercase mb-4">Shop</h5>
            <ul className="space-y-4 font-bold text-sm text-slate-200">
              <li><Link href={`/${business.username}`}>All products</Link></li>
            </ul>
          </div>

          <div className="mb-12 border-b border-white/10 pb-12">
            <h5 className="text-[11px] font-extrabold text-slate-400 tracking-widest uppercase mb-4">Account</h5>
            <ul className="space-y-4 font-bold text-sm text-slate-200">
              <li><Link href="#">Cart</Link></li>
              <li><Link href="#">Favourites</Link></li>
              <li><Link href="#">Track order</Link></li>
              {business.instagram_handle && (
                <li><a href={`https://instagram.com/${business.instagram_handle.replace('@','')}`} target="_blank" className="text-pink-400 hover:text-pink-300 transition-colors">@{business.instagram_handle.replace('@','')}</a></li>
              )}
            </ul>
          </div>

          <div className="text-xs font-bold text-slate-500 flex flex-col gap-2">
            <p>© 2026 {business.business_name}. All rights reserved.</p>
            <p>Powered by <a href="/" className="text-slate-400 hover:text-white transition-colors">Zypcart</a></p>
          </div>
        </footer>

      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
        <div className="max-w-md mx-auto flex items-center justify-around h-16 px-2">
          
          <Link href={`/${business.username}`} className="flex flex-col items-center justify-center w-16 h-full gap-1 group relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-pink-600 rounded-b-full"></div>
            <div className="w-12 h-8 rounded-full bg-pink-50 flex flex-col items-center justify-center mb-0.5">
               <ShoppingBag className="w-5 h-5 text-pink-600" />
            </div>
            <span className="text-[10px] font-extrabold text-slate-900">Shop</span>
          </Link>

          <Link href={`/${business.username}`} className="flex flex-col items-center justify-center w-16 h-full gap-1 text-slate-400 hover:text-slate-900 transition-colors">
            <ShoppingCart className="w-5 h-5" />
            <span className="text-[10px] font-extrabold">Cart</span>
          </Link>

          <Link href={`/${business.username}`} className="flex flex-col items-center justify-center w-16 h-full gap-1 text-slate-400 hover:text-slate-900 transition-colors">
            <Heart className="w-5 h-5" />
            <span className="text-[10px] font-extrabold">Saved</span>
          </Link>

          <Link href={`/${business.username}`} className="flex flex-col items-center justify-center w-16 h-full gap-1 text-slate-400 hover:text-slate-900 transition-colors">
            <Truck className="w-5 h-5" />
            <span className="text-[10px] font-extrabold">Track</span>
          </Link>

        </div>
      </nav>

    </div>
  );
}
