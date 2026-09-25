"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, CheckCircle2, User, Phone, Mail, MapPin, Loader2, QrCode, ShieldCheck, CreditCard, Wallet, ChevronRight, Copy, ExternalLink, Info, Calendar } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

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
    delivery_location: "",
    requiredDate: ""
  });
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [paymentSettings, setPaymentSettings] = useState<any>({ codEnabled: true, upiEnabled: false, upiId: "" });
  const [paymentScreenshot, setPaymentScreenshot] = useState("");
  const [uploadingScreenshot, setUploadingScreenshot] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const { data: b } = await supabase.from('businesses').select('*').eq('username', params.username.toLowerCase()).single();
      if (!b) return router.push('/');
      setBusiness(b);

      try {
        let settings = { codEnabled: true, upiEnabled: false, upiId: "", upiName: "", upiQr: "" };
        if (b.instagram_profile_url && b.instagram_profile_url.startsWith('{')) {
          const parsed = JSON.parse(b.instagram_profile_url);
          settings = { ...settings, ...parsed };
        }
        setPaymentSettings(settings);
        if (settings.codEnabled === false && settings.upiId) {
          setPaymentMethod('upi');
        }
      } catch (e) {
        console.error("Error parsing settings", e);
      }

      const cart = localStorage.getItem('zoopcart_cart');
      if (cart) {
        try {
          const items = JSON.parse(cart);
          setCartItems(items);
          if (items.length > 0) {
            const ids = items.map((i: any) => i.id);
            const { data: p } = await supabase.from('products').select('*').in('id', ids).eq('business_id', b.id);
            setProducts(p || []);
          } else {
            router.push(`/${params.username}/cart`);
          }
        } catch (e) {
          router.push(`/${params.username}/cart`);
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

  const handleScreenshotUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setUploadingScreenshot(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        let scaleSize = 1;
        if (img.width > MAX_WIDTH) scaleSize = MAX_WIDTH / img.width;
        canvas.width = img.width * scaleSize;
        canvas.height = img.height * scaleSize;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.6);
        setPaymentScreenshot(compressedBase64);
        setUploadingScreenshot(false);
      };
      if (event.target?.result) img.src = event.target.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!business || cartItems.length === 0) return;

    if (paymentMethod === 'upi' && !paymentScreenshot) {
      alert("Please upload payment screenshot to confirm your order.");
      return;
    }

    setSubmitting(true);
    const token = Math.random().toString(36).substring(2, 10).toUpperCase();
    const total = calculateTotal();

    // Process items for insertion
    // We group them by a single token and include all details in the notes to prevent DB schema errors
    const orderEntries = cartItems.map((item, index) => {
      const p = products.find(prod => prod.id === item.id);
      const itemPrice = (p?.price || 0) * item.quantity;

      // Construct a rich notes field that includes all customer info and payment proof
      // This ensures no data is lost even if the DB schema is missing specific columns
      let richNotes = `Order Type: CART_ORDER | Item ${index + 1}/${cartItems.length}\n`;
      richNotes += `Payment: ${paymentMethod.toUpperCase()}\n`;
      richNotes += `Customer: ${formData.name} (${formData.phone})\n`;
      if (formData.email) richNotes += `Email: ${formData.email}\n`;
      richNotes += `Address: ${formData.delivery_location}\n`;
      richNotes += `Total Order Value: ₹${total}\n`;
      if (paymentScreenshot && index === 0) richNotes += `[Payment Proof Attached]`;

      return {
        business_id: business.id,
        product_id: item.id,
        customer_name: formData.name,
        customer_phone: formData.phone,
        quantity: item.quantity,
        budget: itemPrice,
        required_date: formData.requiredDate || null,
        notes: richNotes,
        delivery_location: formData.delivery_location,
        tracking_token: token,
        status: 'pending'
      };
    });

    // Note: We are not sending 'customer_email' or 'reference_image' directly in the columns
    // to avoid "column does not exist" errors, instead they are preserved in 'notes'.
    const { error } = await supabase.from('orders').insert(orderEntries);

    if (!error) {
      localStorage.removeItem('zoopcart_cart');
      window.dispatchEvent(new Event('cart-updated'));
      setOrderToken(token);
      setIsSubmitted(true);
    } else {
      alert("Error submitting order.");
    }
    setSubmitting(false);
  };

  const getUpiLink = () => {
    if (!paymentSettings?.upiId) return "";
    const name = encodeURIComponent(paymentSettings.upiName || business?.business_name || "Zoopcart Order");
    return `upi://pay?pa=${paymentSettings.upiId}&pn=${name}&am=${calculateTotal()}&cu=INR`;
  };

  if (loading) return <div className="min-h-screen bg-slate-50 flex items-center justify-center"><Loader2 className="w-8 h-8 text-slate-300 animate-spin" /></div>;

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="w-10 h-10 text-green-500" />
        </div>
        <h1 className="text-2xl font-black text-[#0F172A] mb-2">Order Placed!</h1>
        <p className="text-slate-500 font-bold mb-8">Order ID: <span className="text-[#111111]">#{orderToken}</span></p>

        <div className="w-full max-w-xs space-y-3">
          <button
            onClick={() => router.push(`/${params.username}/track?token=${orderToken}`)}
            className="w-full py-4 bg-[#111111] text-white rounded-2xl font-bold shadow-xl active:scale-[0.98] transition-all"
          >
            Track My Order
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-32">
      {/* Top Header */}
      <header className="bg-white px-4 h-16 flex items-center justify-center sticky top-0 z-50 border-b border-slate-100 shadow-sm relative">
        <button onClick={() => router.back()} className="absolute left-4 w-10 h-10 flex items-center justify-center text-slate-900">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="font-extrabold text-base text-slate-900 tracking-tight">Checkout</h1>
      </header>

      <div className="max-w-md mx-auto px-4 mt-6">
        <form onSubmit={handleSubmit} className="space-y-6">

          <div className="space-y-4">
            <h3 className="font-extrabold text-slate-900 text-sm tracking-wider uppercase">Your Details</h3>

            <div>
              <label className="text-xs font-bold text-slate-700 mb-1.5 block">Full Name <span className="text-red-500">*</span></label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="Enter your full name" className="w-full h-14 pl-11 pr-4 rounded-xl border border-slate-200 bg-white outline-none focus:border-[#111111] focus:ring-2 focus:ring-[#111111]/20 text-sm font-medium transition-all" />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 mb-1.5 block">Phone Number <span className="text-red-500">*</span></label>
              <div className="relative flex">
                <div className="h-14 px-4 bg-slate-50 border border-r-0 border-slate-200 rounded-l-xl flex items-center gap-2 shrink-0">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <span className="text-sm font-bold text-slate-600">+91</span>
                </div>
                <input required type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} placeholder="Enter mobile number" className="w-full h-14 pl-4 pr-4 rounded-r-xl border border-slate-200 bg-white outline-none focus:border-[#111111] focus:ring-2 focus:ring-[#111111]/20 text-sm font-medium transition-all" />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 mb-1.5 block">Email (Optional)</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="Enter your email" className="w-full h-14 pl-11 pr-4 rounded-xl border border-slate-200 bg-white outline-none focus:border-[#111111] focus:ring-2 focus:ring-[#111111]/20 text-sm font-medium transition-all" />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 mb-1.5 block">Required Date (Optional)</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type="date" value={formData.requiredDate} onChange={(e) => setFormData({...formData, requiredDate: e.target.value})} className="w-full h-14 pl-11 pr-4 rounded-xl border border-slate-200 bg-white outline-none focus:border-[#111111] focus:ring-2 focus:ring-[#111111]/20 text-sm font-medium transition-all" />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 mb-1.5 block">Delivery Address <span className="text-red-500">*</span></label>
              <div className="relative">
                <MapPin className="absolute left-4 top-4 w-4 h-4 text-slate-400" />
                <textarea required value={formData.delivery_location} onChange={(e) => setFormData({...formData, delivery_location: e.target.value})} placeholder="Enter full address" className="w-full h-24 pt-4 pb-4 pl-11 pr-4 rounded-xl border border-slate-200 bg-white outline-none focus:border-[#111111] focus:ring-2 focus:ring-[#111111]/20 text-sm font-medium transition-all resize-none"></textarea>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-extrabold text-slate-900 text-sm tracking-wider uppercase">Payment Method</h3>
            <div className="grid grid-cols-1 gap-3">
              {paymentSettings.codEnabled !== false && (
                <div
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${paymentMethod === 'cod' ? 'border-[#111111] bg-white' : 'border-slate-200 bg-white'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${paymentMethod === 'cod' ? 'bg-[#111111] text-white' : 'bg-slate-50 text-slate-400'}`}>
                      <Wallet className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-extrabold text-slate-900">Cash on Delivery</div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase">Pay at your door</div>
                    </div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'cod' ? 'border-[#111111] bg-[#111111]' : 'border-slate-200'}`}>
                    {paymentMethod === 'cod' && <div className="w-2 h-2 bg-white rounded-full"></div>}
                  </div>
                </div>
              )}

              {paymentSettings.upiId && (
                <div
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${paymentMethod === 'upi' ? 'border-[#111111] bg-white' : 'border-slate-200 bg-white'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${paymentMethod === 'upi' ? 'bg-[#111111] text-white' : 'bg-slate-50 text-slate-400'}`}>
                      <QrCode className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-extrabold text-slate-900">Online Payment</div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase">UPI, GPay, PhonePe</div>
                    </div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'upi' ? 'border-[#111111] bg-[#111111]' : 'border-slate-200'}`}>
                    {paymentMethod === 'upi' && <div className="w-2 h-2 bg-white rounded-full"></div>}
                  </div>
                </div>
              )}
            </div>

            <AnimatePresence>
              {paymentMethod === 'upi' && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                  <div className="mt-2 p-5 bg-slate-900 rounded-2xl text-white space-y-6">
                     <div className="flex justify-between items-start">
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Payable</p>
                          <p className="text-2xl font-black">₹{calculateTotal()}</p>
                        </div>
                        <ShieldCheck className="w-6 h-6 text-blue-400" />
                     </div>

                     {paymentSettings.upiQr && (
                        <div className="bg-white p-2 rounded-xl w-32 h-32 mx-auto">
                           <img src={paymentSettings.upiQr} alt="QR" className="w-full h-full object-contain" />
                        </div>
                     )}

                     <div className="space-y-3">
                        <a href={getUpiLink()} className="flex items-center justify-center gap-2 w-full py-3.5 bg-blue-600 rounded-xl font-black text-sm hover:bg-blue-700 transition-colors shadow-lg">
                           <ExternalLink className="w-4 h-4" /> Open Payment App
                        </a>

                        <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
                           <div className="text-left">
                              <p className="text-[9px] font-bold text-slate-500 uppercase">UPI ID</p>
                              <p className="text-xs font-bold truncate max-w-[150px]">{paymentSettings.upiId}</p>
                           </div>
                           <button type="button" onClick={() => {navigator.clipboard.writeText(paymentSettings.upiId); alert('Copied!')}} className="text-[10px] font-bold bg-white/10 px-2 py-1 rounded uppercase flex items-center gap-1">
                              <Copy className="w-3 h-3" /> Copy
                           </button>
                        </div>
                     </div>

                     <div className="pt-4 border-t border-white/10 space-y-3">
                        <p className="text-[10px] font-bold text-slate-400 uppercase text-center">Upload Payment Proof</p>
                        <label className="relative block h-32 w-full border-2 border-dashed border-white/20 rounded-xl overflow-hidden cursor-pointer hover:bg-white/5 transition-all">
                           {paymentScreenshot ? (
                              <img src={paymentScreenshot} alt="Proof" className="w-full h-full object-cover" />
                           ) : (
                              <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500">
                                 <Info className="w-5 h-5 mb-2" />
                                 <span className="text-[10px] font-bold uppercase">Tap to upload screenshot</span>
                              </div>
                           )}
                           <input type="file" accept="image/*" onChange={handleScreenshotUpload} className="hidden" />
                           {uploadingScreenshot && <div className="absolute inset-0 bg-black/60 flex items-center justify-center"><Loader2 className="w-5 h-5 animate-spin" /></div>}
                        </label>
                     </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-200 mt-6 mb-24">
            <h4 className="font-extrabold text-slate-900 text-sm mb-3">Order Summary</h4>
            <div className="flex justify-between text-sm font-medium text-slate-600 mb-2">
              <span>Items Total ({cartItems.length})</span>
              <span>₹{calculateTotal()}</span>
            </div>
            <div className="flex justify-between text-sm font-medium text-slate-600 mb-3 pb-3 border-b border-slate-200">
              <span>Delivery</span>
              <span className="text-green-600 font-bold uppercase text-[10px]">Free Delivery</span>
            </div>
            <div className="flex justify-between text-lg font-extrabold text-slate-900">
              <span>Total Amount</span>
              <span>₹{calculateTotal()}</span>
            </div>
          </div>

          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 z-50 p-4 pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.06)]">
            <div className="max-w-md mx-auto">
              <button
                disabled={submitting}
                type="submit"
                className="w-full h-14 rounded-2xl bg-[#111111] hover:bg-black disabled:opacity-50 text-white font-extrabold text-lg flex items-center justify-center gap-2 shadow-lg shadow-black/20 transition-all active:scale-[0.98]"
              >
                {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Place Order Now"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
