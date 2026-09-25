"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, CheckCircle2, User, Phone, Mail, MapPin, Loader2, QrCode, ShieldCheck, CreditCard, Wallet, ChevronRight, Copy, ExternalLink, Info } from "lucide-react";
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
    delivery_location: ""
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

        // Ensure at least one method is available
        if (settings.codEnabled === false && !settings.upiId) {
          settings.codEnabled = true;
        }

        setPaymentSettings(settings);

        if (settings.codEnabled !== false) {
          setPaymentMethod('cod');
        } else if (settings.upiId) {
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
    const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    const itemDetails = cartItems.map(item => {
      const p = products.find(prod => prod.id === item.id);
      return `${p?.name} (x${item.quantity})`;
    }).join(", ");

    const { error } = await supabase.from('orders').insert([{
      business_id: business.id,
      product_id: cartItems[0]?.id,
      customer_name: formData.name,
      customer_phone: formData.phone,
      customer_email: formData.email,
      quantity: totalQuantity,
      budget: total,
      notes: `Method: ${paymentMethod.toUpperCase()}. Items: ${itemDetails}. Addr: ${formData.delivery_location}`,
      delivery_location: formData.delivery_location,
      tracking_token: token,
      status: 'pending',
      reference_image: paymentScreenshot || null
    }]);

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
    const name = encodeURIComponent(paymentSettings.upiName || business?.name || "Zoopcart Order");
    return `upi://pay?pa=${paymentSettings.upiId}&pn=${name}&am=${calculateTotal()}&cu=INR`;
  };

  if (loading) return <div className="min-h-screen bg-white flex items-center justify-center"><Loader2 className="w-8 h-8 text-blue-600 animate-spin" /></div>;

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white p-8 rounded-[32px] shadow-xl text-center max-w-sm w-full">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 mb-2">Order Confirmed!</h1>
          <p className="text-slate-500 font-medium mb-8">Order ID: <span className="text-slate-900 font-bold">#{orderToken}</span></p>
          <Link href={`/${business.username}/track?token=${orderToken}`} className="block">
            <button className="w-full py-4 bg-[#111111] text-white rounded-2xl font-bold shadow-lg">Track My Order</button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans pb-32">
      {/* Premium Gateway Header */}
      <div className="bg-white border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between">
          <button onClick={() => router.back()} className="w-10 h-10 flex items-center justify-center text-slate-400">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
            <span className="font-black text-slate-900 tracking-tight uppercase text-sm">Secure Checkout</span>
          </div>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 pt-6 space-y-6">
        {/* Merchant Branding */}
        <div className="flex items-center gap-3 p-1">
          <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white font-bold text-xs">
            {business.name.substring(0,2).toUpperCase()}
          </div>
          <div>
            <h2 className="text-sm font-black text-slate-900">{business.name}</h2>
            <div className="flex items-center gap-1 text-[10px] text-green-600 font-bold uppercase tracking-wider">
              <div className="w-1 h-1 bg-green-600 rounded-full"></div> Verified Merchant
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Shipping Details */}
          <div className="bg-white rounded-[28px] p-6 shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                <MapPin className="w-4 h-4 text-blue-600" />
              </div>
              <h3 className="font-black text-slate-900 text-sm">Shipping Information</h3>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Full Name</label>
                <input required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="John Doe" className="w-full h-12 px-4 rounded-xl border border-slate-100 bg-slate-50 focus:bg-white focus:border-blue-600 outline-none text-sm font-bold transition-all" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Phone Number</label>
                <div className="relative">
                   <div className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">+91</div>
                   <input required type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} placeholder="9876543210" className="w-full h-12 pl-12 pr-4 rounded-xl border border-slate-100 bg-slate-50 focus:bg-white focus:border-blue-600 outline-none text-sm font-bold transition-all" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Delivery Address</label>
                <textarea required value={formData.delivery_location} onChange={(e) => setFormData({...formData, delivery_location: e.target.value})} placeholder="House no, Building, Street name..." className="w-full h-24 p-4 rounded-xl border border-slate-100 bg-slate-50 focus:bg-white focus:border-blue-600 outline-none text-sm font-bold transition-all resize-none" />
              </div>
            </div>
          </div>

          {/* Payment Gateway Section */}
          <div className="bg-white rounded-[28px] p-6 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-4 h-4 text-purple-600" />
                </div>
                <h3 className="font-black text-slate-900 text-sm">Select Payment</h3>
              </div>
              <span className="text-[10px] font-black text-slate-400 bg-slate-50 px-2 py-1 rounded-md uppercase tracking-tight">Step 2 of 2</span>
            </div>

            <div className="space-y-3">
              {paymentSettings.codEnabled !== false && (
                <div
                  onClick={() => setPaymentMethod('cod')}
                  className={`group relative p-4 rounded-2xl border-2 cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-blue-600 bg-blue-50/30' : 'border-slate-50 bg-slate-50/50 hover:border-slate-200'}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${paymentMethod === 'cod' ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-white text-slate-400'}`}>
                        <Wallet className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-sm font-black text-slate-900">Cash on Delivery</div>
                        <div className="text-[10px] text-slate-500 font-bold">Pay at your doorstep</div>
                      </div>
                    </div>
                    {paymentMethod === 'cod' && <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center"><CheckCircle2 className="w-3 h-3 text-white" /></div>}
                  </div>
                </div>
              )}

              {paymentSettings.upiId && (
                <div
                  onClick={() => setPaymentMethod('upi')}
                  className={`group relative p-4 rounded-2xl border-2 cursor-pointer transition-all ${paymentMethod === 'upi' ? 'border-blue-600 bg-blue-50/30' : 'border-slate-50 bg-slate-50/50 hover:border-slate-200'}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${paymentMethod === 'upi' ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-white text-slate-400'}`}>
                        <QrCode className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-sm font-black text-slate-900">UPI / Online Pay</div>
                        <div className="text-[10px] text-slate-500 font-bold">GPay, PhonePe, Paytm</div>
                      </div>
                    </div>
                    {paymentMethod === 'upi' && <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center"><CheckCircle2 className="w-3 h-3 text-white" /></div>}
                  </div>
                </div>
              )}
            </div>

            <AnimatePresence>
              {paymentMethod === 'upi' && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden mt-6">
                  <div className="p-5 bg-slate-900 rounded-2xl text-white space-y-6">
                     <div className="flex justify-between items-start">
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Payable Amount</p>
                          <p className="text-2xl font-black">₹{calculateTotal()}</p>
                        </div>
                        <div className="bg-white/10 p-2 rounded-lg">
                          <ShieldCheck className="w-5 h-5 text-blue-400" />
                        </div>
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
                              <div className="absolute inset-0 flex flex-col items-center justify-center">
                                 <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center mb-2">
                                    <Info className="w-4 h-4 text-slate-400" />
                                 </div>
                                 <span className="text-[10px] font-bold text-slate-500 uppercase">Tap to upload screenshot</span>
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

          {/* Order Summary */}
          <div className="bg-white rounded-[28px] p-6 shadow-sm border border-slate-100">
             <h3 className="font-black text-slate-900 text-sm mb-4">Order Summary</h3>
             <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center text-slate-500 font-medium">
                   <span>Items ({cartItems.length})</span>
                   <span className="text-slate-900 font-bold">₹{calculateTotal()}</span>
                </div>
                <div className="flex justify-between items-center text-slate-500 font-medium">
                   <span>Delivery</span>
                   <span className="text-green-600 font-black uppercase text-[10px]">Free Delivery</span>
                </div>
                <div className="pt-3 border-t border-slate-50 flex justify-between items-center">
                   <span className="text-slate-900 font-black">Grand Total</span>
                   <span className="text-blue-600 font-black text-lg">₹{calculateTotal()}</span>
                </div>
             </div>
          </div>

          {/* Trust Footer */}
          <div className="flex flex-col items-center gap-4 py-4 opacity-50">
             <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                   <ShieldCheck className="w-3 h-3" />
                   <span className="text-[9px] font-bold uppercase tracking-widest">SSL Secure</span>
                </div>
                <div className="flex items-center gap-1">
                   <CreditCard className="w-3 h-3" />
                   <span className="text-[9px] font-bold uppercase tracking-widest">Safe Payment</span>
                </div>
             </div>
             <p className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.2em]">Powered by Zoopcart Technology</p>
          </div>

          {/* Action Button */}
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 p-4 z-50">
            <div className="max-w-md mx-auto">
              <button
                disabled={submitting}
                type="submit"
                className="group w-full h-14 bg-[#111111] text-white rounded-[20px] font-black text-base flex items-center justify-center gap-2 shadow-xl shadow-slate-200 active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {submitting ? (
                   <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                   <>
                     Confirm & Place Order
                     <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                   </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
