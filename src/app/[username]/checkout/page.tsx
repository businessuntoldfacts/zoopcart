"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, CheckCircle2, User, Phone, Mail, MapPin, Calendar, ChevronDown, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CheckoutPage({ params }: { params: { username: string } }) {
  const router = useRouter();
  const [business, setBusiness] = useState<any>(null);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [orderToken, setOrderToken] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    delivery_location: ""
  });

  useEffect(() => {
    async function fetchData() {
      const { data: b } = await supabase.from('businesses').select('*').eq('username', params.username.toLowerCase()).single();
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
          } else {
            router.push(`/${params.username}/cart`);
          }
        } catch (e) {
          console.error("Error parsing cart", e);
        }
      } else {
        router.push(`/${params.username}/cart`);
      }
      setLoading(false);
    }
    fetchData();
  }, [params.username, router]);

  const calculateTotal = () => {
    return cartItems.reduce((acc, item) => {
      const product = products.find(p => p.id === item.id);
      return acc + (product?.price || 0) * item.quantity;
    }, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!business || cartItems.length === 0) return;
    setSubmitting(true);

    const token = Math.random().toString(36).substring(2, 10).toUpperCase();
    const total = calculateTotal();

    // Create order entries for each product or one summary order
    // For now, we'll create one summary order with item details in notes
    const itemDetails = cartItems.map(item => {
      const p = products.find(prod => prod.id === item.id);
      return `${p?.name} (x${item.quantity}) - ₹${(p?.price || 0) * item.quantity}`;
    }).join(", ");

    const { error } = await supabase.from('orders').insert([{
      business_id: business.id,
      customer_name: formData.name,
      customer_phone: formData.phone,
      customer_email: formData.email, // Save email in its own column
      budget: total,
      notes: `Cart Items: ${itemDetails}`,
      delivery_location: formData.delivery_location,
      tracking_token: token,
      status: 'new'
    }]);

    if (!error) {
      // Send email
      if (formData.email) {
        try {
          await fetch("/api/send", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              type: "order_notification",
              email: formData.email,
              orderId: token,
              customerName: formData.name,
              customerPhone: formData.phone,
              productName: "Multiple Items (Cart)",
              price: total,
              quantity: cartItems.length,
              deliveryLocation: formData.delivery_location,
              trackingLink: `${window.location.origin}/${business.username}/track?token=${token}`
            })
          });
        } catch (emailErr) {}
      }

      localStorage.removeItem('zypcart_cart');
      window.dispatchEvent(new Event('cart-updated'));
      setOrderToken(token);
      setIsSubmitted(true);
    } else {
      alert("Error submitting order.");
    }
    setSubmitting(false);
  };

  if (loading) return <div className="min-h-screen bg-slate-50 flex items-center justify-center"><Loader2 className="w-8 h-8 text-slate-300 animate-spin" /></div>;

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-slate-50 font-sans p-4 flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-green-500/20">
          <CheckCircle2 className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 mb-2">Order Placed!</h1>
        <p className="text-sm font-medium text-slate-500 mb-8">Your order ID is <span className="text-slate-900 font-extrabold">#{orderToken}</span>. We've sent the details to your phone.</p>
        <Link href={`/${business.username}/track?token=${orderToken}`} className="w-full max-w-xs">
          <button className="w-full h-14 bg-[#111111] text-white rounded-2xl font-extrabold shadow-lg">Track Order</button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-32">
      <header className="bg-white px-4 h-16 flex items-center justify-center sticky top-0 z-50 border-b border-slate-100 shadow-sm relative">
        <button onClick={() => router.back()} className="absolute left-4 w-10 h-10 flex items-center justify-center text-slate-900">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="font-extrabold text-base text-slate-900 tracking-tight">Checkout</h1>
      </header>

      <div className="max-w-md mx-auto px-4 pt-6">
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 mb-1.5 block">Full Name *</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="Enter your name" className="w-full h-14 pl-11 pr-4 rounded-xl border border-slate-200 bg-white outline-none focus:border-[#111111] text-sm font-medium" />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 mb-1.5 block">Phone Number *</label>
              <div className="relative flex">
                <div className="h-14 px-4 bg-slate-50 border border-r-0 border-slate-200 rounded-l-xl flex items-center gap-2">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <span className="text-sm font-bold text-slate-600">+91</span>
                </div>
                <input required type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} placeholder="Mobile number" className="w-full h-14 pl-4 pr-4 rounded-r-xl border border-slate-200 bg-white outline-none focus:border-[#111111] text-sm font-medium" />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 mb-1.5 block">Email (Optional)</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="Enter your email" className="w-full h-14 pl-11 pr-4 rounded-xl border border-slate-200 bg-white outline-none focus:border-[#111111] text-sm font-medium" />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 mb-1.5 block">Delivery Address *</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-4 w-4 h-4 text-slate-400" />
                <textarea required value={formData.delivery_location} onChange={(e) => setFormData({...formData, delivery_location: e.target.value})} placeholder="Enter full address" className="w-full h-24 pt-4 pl-11 pr-4 rounded-xl border border-slate-200 bg-white outline-none focus:border-[#111111] text-sm font-medium resize-none"></textarea>
              </div>
            </div>
          </div>

          <div className="mt-8 bg-white rounded-3xl p-5 border border-slate-100 shadow-sm mb-24">
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

          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 z-50 p-4 pb-safe">
            <div className="max-w-md mx-auto">
              <button disabled={submitting} type="submit" className="w-full h-14 rounded-2xl bg-[#111111] text-white font-extrabold text-lg flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.98] disabled:opacity-50">
                {submitting ? "Processing..." : "Confirm Order"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
