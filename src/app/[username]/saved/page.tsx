import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Heart, ShoppingCart, ArrowLeft, ShoppingBag, Truck } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const revalidate = 0;

export default async function SavedPage({ params }: { params: { username: string } }) {
  const { data: business } = await supabase
    .from('businesses')
    .select('*')
    .eq('username', params.username.toLowerCase())
    .single();

  if (!business) notFound();

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
          <Link href={`/${business.username}/saved`} className="text-slate-600 hover:text-pink-600 transition-colors">
            <Heart className="w-6 h-6 fill-pink-600 text-pink-600" />
          </Link>
          <Link href={`/${business.username}/cart`} className="w-10 h-10 bg-pink-600 hover:bg-pink-700 text-white rounded-xl flex items-center justify-center shadow-md relative">
            <ShoppingCart className="w-5 h-5 fill-current" />
            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-slate-900 text-white text-[9px] font-bold flex items-center justify-center rounded-full border-2 border-white">0</span>
          </Link>
        </div>
      </header>

      <div className="max-w-md mx-auto bg-white min-h-[calc(100vh-64px)] relative shadow-sm border-x border-slate-100 p-6 flex flex-col items-center">
        
        <div className="w-full flex items-center gap-2 text-sm font-bold text-pink-600 mb-6">
          <ArrowLeft className="w-4 h-4" />
          <Link href={`/${business.username}`}>Continue shopping</Link>
        </div>

        <div className="w-full">
           <h2 className="font-extrabold text-3xl text-slate-900 mb-1">Favourites</h2>
           <p className="text-sm font-medium text-slate-500 mb-12">0 saved products.</p>
        </div>

        <div className="w-full bg-slate-50 rounded-[32px] border border-slate-100 p-8 flex flex-col items-center text-center">
           <div className="w-24 h-24 bg-pink-50 rounded-full shadow-sm flex items-center justify-center mb-6">
              <Heart className="w-10 h-10 text-pink-400" />
           </div>
           <h3 className="font-extrabold text-2xl text-slate-900 mb-2">No saved products yet.</h3>
           <p className="text-slate-500 font-medium text-sm leading-relaxed mb-8 max-w-[250px]">
             Tap the heart on any product to keep it here for later.
           </p>
           
           <Link href={`/${business.username}`}>
             <Button className="h-12 px-8 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-extrabold shadow-md shadow-pink-600/20 border-none">
               Explore Products
             </Button>
           </Link>
        </div>

      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
        <div className="max-w-md mx-auto flex items-center justify-around h-16 px-2">
          
          <Link href={`/${business.username}`} className="flex flex-col items-center justify-center w-16 h-full gap-1 text-slate-400 hover:text-slate-900 transition-colors">
            <ShoppingBag className="w-5 h-5" />
            <span className="text-[10px] font-extrabold">Shop</span>
          </Link>

          <Link href={`/${business.username}/cart`} className="flex flex-col items-center justify-center w-16 h-full gap-1 text-slate-400 hover:text-slate-900 transition-colors">
            <ShoppingCart className="w-5 h-5" />
            <span className="text-[10px] font-extrabold">Cart</span>
          </Link>

          <Link href={`/${business.username}/saved`} className="flex flex-col items-center justify-center w-16 h-full gap-1 group relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-pink-600 rounded-b-full"></div>
            <div className="w-12 h-8 rounded-full bg-pink-50 flex flex-col items-center justify-center mb-0.5">
               <Heart className="w-5 h-5 text-pink-600 fill-pink-600" />
            </div>
            <span className="text-[10px] font-extrabold text-slate-900">Saved</span>
          </Link>

          <Link href={`/${business.username}/track`} className="flex flex-col items-center justify-center w-16 h-full gap-1 text-slate-400 hover:text-slate-900 transition-colors">
            <Truck className="w-5 h-5" />
            <span className="text-[10px] font-extrabold">Track</span>
          </Link>

        </div>
      </nav>

    </div>
  );
}
