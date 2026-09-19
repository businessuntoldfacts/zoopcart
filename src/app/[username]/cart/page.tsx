import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Heart, ShoppingCart, ArrowLeft, ShoppingBag, Truck } from "lucide-react";
import Link from "next/link";
import StoreBottomNav from "@/components/StoreBottomNav";
import { Button } from "@/components/ui/button";

export const revalidate = 0;

export default async function CartPage({ params }: { params: { username: string } }) {
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
              <div className="w-full h-full flex items-center justify-center bg-blue-50 text-blue-600 font-bold text-lg">
                {business.business_name?.charAt(0)}
              </div>
            )}
          </div>
          <h1 className="font-extrabold text-xl text-slate-900 tracking-tight">{business.business_name}</h1>
        </div>
        <div className="flex items-center gap-4">
          <Link href={`/${business.username}/saved`} className="text-slate-600 hover:text-blue-600 transition-colors">
            <Heart className="w-6 h-6" />
          </Link>
          <Link href={`/${business.username}/cart`} className="w-10 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center justify-center shadow-md transition-colors relative">
            <ShoppingCart className="w-5 h-5 fill-current" />
            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-slate-900 text-white text-[9px] font-bold flex items-center justify-center rounded-full border-2 border-white">0</span>
          </Link>
        </div>
      </header>

      <div className="max-w-md mx-auto bg-white min-h-[calc(100vh-64px)] relative shadow-sm border-x border-slate-100 p-6 flex flex-col items-center">
        
        <div className="w-full flex items-center gap-2 text-sm font-bold text-blue-600 mb-6">
          <ArrowLeft className="w-4 h-4" />
          <Link href={`/${business.username}`}>Continue shopping</Link>
        </div>

        <div className="w-full">
           <h2 className="font-extrabold text-3xl text-slate-900 mb-1">Your cart</h2>
           <p className="text-sm font-medium text-slate-500 mb-12">0 items ready to checkout.</p>
        </div>

        <div className="w-full bg-slate-50 rounded-[32px] border border-slate-100 p-8 flex flex-col items-center text-center">
           <div className="w-24 h-24 bg-white rounded-3xl shadow-sm flex items-center justify-center mb-6">
              <ShoppingCart className="w-10 h-10 text-slate-300" />
           </div>
           <h3 className="font-extrabold text-2xl text-slate-900 mb-2">Your cart is waiting.</h3>
           <p className="text-slate-500 font-medium text-sm leading-relaxed mb-8 max-w-[250px]">
             Add a few products and they'll show up right here, ready to go.
           </p>
           
           <Link href={`/${business.username}`}>
             <Button className="h-12 px-8 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold shadow-md shadow-blue-600/20 border-none">
               Continue Shopping
             </Button>
           </Link>
        </div>

      </div>

      <StoreBottomNav username={business.username} />

    </div>
  );
}
