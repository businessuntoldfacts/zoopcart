"use client";
import Link from 'next/link';
import { Heart, Home, Truck, ShoppingCart } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function StoreBottomNav({ username }: { username: string }) {
  const pathname = usePathname();
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem('zoopcart_cart') || '[]');
      setCartCount(cart.length);
    };

    updateCartCount();
    window.addEventListener('storage', updateCartCount);
    // Custom event for same-window updates
    window.addEventListener('cart-updated', updateCartCount);

    return () => {
      window.removeEventListener('storage', updateCartCount);
      window.removeEventListener('cart-updated', updateCartCount);
    };
  }, []);

  const isShop = pathname === `/${username}`;
  const isSaved = pathname === `/${username}/saved`;
  const isTrack = pathname === `/${username}/track`;
  const isCart = pathname === `/${username}/cart`;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 z-[60] pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.04)]">
      <div className="max-w-md mx-auto flex items-center justify-around h-16 px-4">
        <Link href={`/${username}`} className={`flex flex-col items-center justify-center w-14 h-full gap-1 transition-colors ${isShop ? 'text-[#111111]' : 'text-slate-400'}`}>
          <Home className={`w-5 h-5 ${isShop ? 'fill-current' : ''}`} />
          <span className="text-[10px] font-extrabold mt-0.5">Shop</span>
        </Link>
        
        <Link href={`/${username}/saved`} className={`flex flex-col items-center justify-center w-14 h-full gap-1 transition-colors ${isSaved ? 'text-[#111111]' : 'text-slate-400'}`}>
          <Heart className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
          <span className="text-[10px] font-extrabold mt-0.5">Saved</span>
        </Link>

        <Link href={`/${username}/cart`} className={`flex flex-col items-center justify-center w-14 h-full gap-1 transition-colors relative ${isCart ? 'text-[#111111]' : 'text-slate-400'}`}>
          <ShoppingCart className={`w-5 h-5 ${isCart ? 'fill-current' : ''}`} />
          {cartCount > 0 && (
            <span className="absolute top-2 right-2 w-4 h-4 bg-[#111111] text-white text-[8px] font-black flex items-center justify-center rounded-full border border-white">
              {cartCount}
            </span>
          )}
          <span className="text-[10px] font-extrabold mt-0.5">Cart</span>
        </Link>
        
        <Link href={`/${username}/track`} className={`flex flex-col items-center justify-center w-14 h-full gap-1 transition-colors ${isTrack ? 'text-[#111111]' : 'text-slate-400'}`}>
          <Truck className="w-5 h-5" />
          <span className="text-[10px] font-extrabold mt-0.5">Track</span>
        </Link>
      </div>
    </nav>
  );
}
