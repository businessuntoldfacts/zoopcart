"use client";
import Link from 'next/link';
import { Heart, Home, Truck } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function StoreBottomNav({ username }: { username: string }) {
  const pathname = usePathname();
  const isShop = pathname === `/${username}`;
  const isSaved = pathname === `/${username}/saved`;
  const isTrack = pathname === `/${username}/track`;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 z-[60] pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.04)]">
      <div className="max-w-md mx-auto flex items-center justify-around h-16 px-6">
        <Link href={`/${username}`} className={`flex flex-col items-center justify-center w-16 h-full gap-1 transition-colors ${isShop ? 'text-blue-600' : 'text-slate-400 hover:text-slate-900'}`}>
          <div className="relative">
            {isShop && <div className="absolute inset-0 bg-blue-100 rounded-full blur-md opacity-50 scale-150"></div>}
            {isShop ? (
              <div className="w-5 h-5 bg-blue-600 rounded-md rotate-45 relative flex items-center justify-center shadow-inner">
                <div className="w-2.5 h-2.5 bg-white rounded-sm -rotate-45"></div>
              </div>
            ) : (
              <div className="w-5 h-5 border-2 border-current rounded-md rotate-45 relative flex items-center justify-center">
                <div className="w-2 h-2 border-2 border-current rounded-sm -rotate-45"></div>
              </div>
            )}
          </div>
          <span className="text-[10px] font-extrabold mt-1">Shop</span>
        </Link>
        
        <Link href={`/${username}/saved`} className={`flex flex-col items-center justify-center w-16 h-full gap-1 transition-colors ${isSaved ? 'text-blue-600' : 'text-slate-400 hover:text-slate-900'}`}>
          {isSaved ? <Heart className="w-5 h-5 fill-current" /> : <Heart className="w-5 h-5" />}
          <span className="text-[10px] font-extrabold">Saved</span>
        </Link>
        
        <Link href={`/${username}/track`} className={`flex flex-col items-center justify-center w-16 h-full gap-1 transition-colors ${isTrack ? 'text-blue-600' : 'text-slate-400 hover:text-slate-900'}`}>
          <Truck className="w-5 h-5" />
          <span className="text-[10px] font-extrabold">Track</span>
        </Link>
      </div>
    </nav>
  );
}
