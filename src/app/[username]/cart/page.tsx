"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { ShoppingCart, ArrowLeft, Trash2, Plus, Minus, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import StoreBottomNav from "@/components/StoreBottomNav";

export default function CartPage({ params }: { params: { username: string } }) {
  const router = useRouter();
  const [business, setBusiness] = useState<any>(null);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const { data: b } = await supabase
        .from('businesses')
        .select('*')
        .eq('username', params.username.toLowerCase())
        .single();

      if (!b) return router.push('/');
      setBusiness(b);

      const cart = localStorage.getItem('zypcart_cart');
      if (cart) {
        try {
          const items = JSON.parse(cart);
          setCartItems(items);
          if (items.length > 0) {
            const ids = items.map((i: any) => i.id);
            const { data: p } = await supabase
              .from('products')
              .select('*')
              .in('id', ids)
              .eq('business_id', b.id);
            setProducts(p || []);
          }
        } catch (e) {
          console.error("Error parsing cart", e);
        }
      }
      setLoading(false);
    }
    fetchData();
  }, [params.username, router]);

  const updateQuantity = (productId: string, delta: number) => {
    const newCart = cartItems.map(item => {
      if (item.id === productId) {
        return { ...item, quantity: Math.max(1, item.quantity + delta) };
      }
      return item;
    });
    setCartItems(newCart);
    localStorage.setItem('zypcart_cart', JSON.stringify(newCart));
    window.dispatchEvent(new Event('cart-updated'));
  };

  const removeItem = (productId: string) => {
    const newCart = cartItems.filter(item => item.id !== productId);
    setCartItems(newCart);
    setProducts(products.filter(p => p.id !== productId));
    localStorage.setItem('zypcart_cart', JSON.stringify(newCart));
    window.dispatchEvent(new Event('cart-updated'));
  };

  const getProductData = (id: string) => products.find(p => p.id === id);

  const calculateTotal = () => {
    return cartItems.reduce((acc, item) => {
      const product = getProductData(item.id);
      return acc + (product?.price || 0) * item.quantity;
    }, 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-slate-300 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-32">
      {/* Top Header */}
      <header className="bg-white px-4 h-16 flex items-center justify-center sticky top-0 z-50 border-b border-slate-100 shadow-sm relative">
        <Link href={`/${business.username}`} className="absolute left-4 w-10 h-10 flex items-center justify-center text-slate-900">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="font-extrabold text-base text-slate-900 tracking-tight">Your Cart</h1>
      </header>

      <div className="max-w-md mx-auto px-4 pt-6">
        {cartItems.length === 0 ? (
          <div className="pt-24 pb-12 flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center mb-6 shadow-sm border border-slate-100 text-slate-200">
              <ShoppingCart className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 mb-2">Cart is empty</h2>
            <p className="text-sm font-medium text-slate-500 leading-relaxed max-w-[260px] mb-8">
              Looks like you haven't added anything to your cart yet.
            </p>
            <Link href={`/${business.username}`}>
              <button className="px-8 py-3.5 bg-[#111111] text-white font-extrabold rounded-2xl shadow-lg shadow-black/10 transition-transform active:scale-95 text-sm">
                Start Shopping
              </button>
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {cartItems.map((item) => {
                const product = getProductData(item.id);
                if (!product) return null;
                return (
                  <div key={item.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex p-3 gap-4 relative">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-50 shrink-0 border border-slate-50">
                      {product.image ? (
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300 font-bold text-[10px]">No Image</div>
                      )}
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-0.5">
                      <div>
                        <h3 className="font-extrabold text-sm text-slate-900 leading-tight line-clamp-1 pr-8">{product.name}</h3>
                        <div className="text-sm font-extrabold text-slate-900 mt-1">₹{product.price}</div>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center bg-slate-50 rounded-xl p-1 border border-slate-100">
                          <button onClick={() => updateQuantity(item.id, -1)} className="w-8 h-8 flex items-center justify-center text-slate-600 hover:text-black">
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-8 text-center text-xs font-extrabold">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)} className="w-8 h-8 flex items-center justify-center text-slate-600 hover:text-black">
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <button onClick={() => removeItem(item.id)} className="text-slate-300 hover:text-red-500 transition-colors mr-1">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 bg-white rounded-3xl p-5 border border-slate-100 shadow-sm">
              <h3 className="font-extrabold text-slate-900 text-sm mb-4">Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm font-medium text-slate-500">
                  <span>Subtotal</span>
                  <span className="text-slate-900">₹{calculateTotal()}</span>
                </div>
                <div className="flex justify-between text-sm font-medium text-slate-500">
                  <span>Delivery</span>
                  <span className="text-green-600 font-bold">Free</span>
                </div>
                <div className="h-px bg-slate-50 my-2"></div>
                <div className="flex justify-between text-lg font-extrabold text-slate-900">
                  <span>Total</span>
                  <span>₹{calculateTotal()}</span>
                </div>
              </div>
            </div>

            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 z-50 p-4 pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.06)]">
              <div className="max-w-md mx-auto">
                <button className="w-full h-14 rounded-2xl bg-[#111111] hover:bg-black text-white font-extrabold text-lg flex items-center justify-center gap-2 shadow-lg shadow-black/20 transition-all active:scale-[0.98]">
                  Checkout Now
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <StoreBottomNav username={business.username} />
    </div>
  );
}
