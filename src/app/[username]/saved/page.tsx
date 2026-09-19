import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Heart, ArrowLeft } from "lucide-react";
import Link from "next/link";
import StoreBottomNav from "@/components/StoreBottomNav";

export const revalidate = 0;

export default async function SavedPage({ params }: { params: { username: string } }) {
  const { data: business } = await supabase
    .from('businesses')
    .select('*')
    .eq('username', params.username.toLowerCase())
    .single();

  if (!business) notFound();

  return (
    <div className="min-h-screen bg-white font-sans pb-24">
      {/* Top Header */}
      <header className="bg-white px-4 h-16 flex items-center justify-center sticky top-0 z-50 border-b border-slate-100 shadow-sm relative">
        <Link href={`/${business.username}`} className="absolute left-4 w-10 h-10 flex items-center justify-center text-slate-900">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="font-extrabold text-base text-slate-900 tracking-tight">My Favourites</h1>
      </header>

      <div className="max-w-md mx-auto px-6 pt-24 pb-12 flex flex-col items-center text-center">
         <div className="w-32 h-32 rounded-full bg-blue-50 flex items-center justify-center mb-8 relative">
           <div className="absolute inset-0 bg-blue-100 rounded-full blur-2xl opacity-50"></div>
           <Heart className="w-12 h-12 text-blue-500 relative z-10" strokeWidth={2.5} />
         </div>
         
         <h2 className="text-2xl font-extrabold text-slate-900 mb-3">No saved products yet.</h2>
         <p className="text-sm font-medium text-slate-500 leading-relaxed max-w-[260px] mb-8">
           Tap the heart on any product to keep it here for later.
         </p>
         
         <Link href={`/${business.username}`}>
           <button className="px-8 py-3.5 bg-blue-500 hover:bg-blue-600 text-white font-extrabold rounded-2xl shadow-sm transition-colors text-sm">
             Explore Products
           </button>
         </Link>
      </div>

      <StoreBottomNav username={business.username} />
    </div>
  );
}
