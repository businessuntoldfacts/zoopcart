"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, CheckCircle2, User, Phone, Mail, MapPin, Calendar, ChevronDown, Loader2, QrCode } from "lucide-react";
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
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [paymentSettings, setPaymentSettings] = useState<any>({ codEnabled: true, upiEnabled: false });
  const [paymentScreenshot, setPaymentScreenshot] = useState("");
  const [uploadingScreenshot, setUploadingScreenshot] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const { data: b } = await supabase.from('businesses').select('*').eq('username', params.username.toLowerCase()).single();
      if (!b) return router.push('/');
      setBusiness(b);

      try {
        let settings = { codEnabled: true, upiEnabled: false, upiId: "" };
        if (b.instagram_profile_url && b.instagram_profile_url.startsWith('{')) {
          const parsed = JSON.parse(b.instagram_profile_url);
          settings = { ...settings, ...parsed };
        }
        setPaymentSettings(settings);

        // Logic for initial selection:
        // 1. If COD is enabled, default to COD
        // 2. If only UPI is enabled, default to UPI
        if (settings.codEnabled !== false) {
          setPaymentMethod('cod');
        } else if (settings.upiEnabled !== false && settings.upiId) {
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
        if (img.width > MAX_WIDTH) {
          scaleSize = MAX_WIDTH / img.width;
        }
        canvas.width = img.width * scaleSize;
        canvas.height = img.height * scaleSize;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.6);
        setPaymentScreenshot(compressedBase64);
        setUploadingScreenshot(false);
      };
      if (event.target?.result) {
        img.src = event.target.result as string;
      }
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
    const firstProductId = cartItems.length > 0 ? cartItems[0].id : null;

    // Create order entries for each product or one summary order
    // For now, we'll create one summary order with item details in notes
    const itemDetails = cartItems.map(item => {
      const p = products.find(prod => prod.id === item.id);
      return `${p?.name} (x${item.quantity})`;
    }).join(", ");

    const { error } = await supabase.from('orders').insert([{
      business_id: business.id,
      product_id: firstProductId,
      customer_name: formData.name,
      customer_phone: formData.phone,
      customer_email: formData.email,
      quantity: totalQuantity,
      budget: total,
      notes: `Payment: ${paymentMethod.toUpperCase()}. Cart Items: ${itemDetails}. ${formData.delivery_location}`,
      delivery_location: formData.delivery_location,
      tracking_token: token,
      status: 'pending',
      reference_image: paymentScreenshot || null
    }]);

    if (!error) {
      // 1. Send email to Buyer
      console.log("Attempting to send Buyer email to:", formData.email);
      if (formData.email) {
        try {
          const buyerRes = await fetch("/api/send", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              type: "order_notification",
              email: formData.email,
              orderId: token,
              customerName: formData.name,
              customerPhone: formData.phone,
              productName: itemDetails,
              price: total,
              quantity: totalQuantity,
              deliveryLocation: formData.delivery_location,
              trackingLink: `${window.location.origin}/${business.username}/track?token=${token}`
            })
          });
          const buyerResult = await buyerRes.json();
          if (buyerRes.ok) {
            console.log("✅ Buyer Email Sent Successfully:", buyerResult);
          } else {
            console.error("❌ Buyer Email Error:", buyerResult);
          }
        } catch (emailErr) {
          console.error("❌ Buyer email failed to fetch:", emailErr);
        }
      } else {
        console.log("ℹ️ No buyer email provided, skipping.");
      }

      // 2. Send email to Seller
      try {
        let sellerEmail = "";
        try {
          if (business.instagram_profile_url && business.instagram_profile_url.startsWith('{')) {
            const settings = JSON.parse(business.instagram_profile_url);
            sellerEmail = settings.email;
          }
        } catch (e) {}

        console.log("Attempting to send Seller email to:", sellerEmail);
        if (sellerEmail) {
          const sellerRes = await fetch("/api/send", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              type: "seller_order_notification",
              email: sellerEmail,
              orderId: token,
              customerName: formData.name,
              customerPhone: formData.phone,
              productName: itemDetails,
              price: total,
              quantity: totalQuantity,
              deliveryLocation: formData.delivery_location,
              notes: formData.delivery_location
            })
          });
          const sellerResult = await sellerRes.json();
          if (sellerRes.ok) {
            console.log("✅ Seller Email Sent Successfully:", sellerResult);
          } else {
            console.error("❌ Seller Email Error:", sellerResult);
          }
        } else {
          console.log("ℹ️ Seller email not found in business settings, skipping.");
        }
      } catch (sellerEmailErr) {
        console.error("❌ Seller notification failed to fetch:", sellerEmailErr);
      }

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
    const amount = calculateTotal();
    return `upi://pay?pa=${paymentSettings.upiId}&pn=${name}&am=${amount}&cu=INR`;
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

          <div className="mt-8 bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-4">
            <h3 className="font-extrabold text-slate-900 text-sm">Payment Method</h3>

            <div className="space-y-3">
              {/* Show COD if enabled (defaults to true) */}
              {paymentSettings?.codEnabled !== false && (
                <label className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all cursor-pointer ${paymentMethod === 'cod' ? 'border-[#111111] bg-slate-50' : 'border-slate-100 opacity-60'}`}>
                  <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={(e) => setPaymentMethod(e.target.value)} className="hidden" />
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'cod' ? 'border-[#111111]' : 'border-slate-300'}`}>
                    {paymentMethod === 'cod' && <div className="w-2.5 h-2.5 rounded-full bg-[#111111]" />}
                  </div>
                  <div>
                    <div className="font-bold text-sm text-slate-900">Cash on Delivery</div>
                    <div className="text-[10px] text-slate-500 font-medium uppercase tracking-tight">Pay when you receive the order</div>
                  </div>
                </label>
              )}

              {/* Show UPI if merchant has provided a UPI ID */}
              {paymentSettings?.upiId && (
                <div className="space-y-3">
                  <label className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all cursor-pointer ${paymentMethod === 'upi' ? 'border-[#111111] bg-slate-50' : 'border-slate-100 opacity-60'}`}>
                    <input type="radio" name="payment" value="upi" checked={paymentMethod === 'upi'} onChange={(e) => setPaymentMethod(e.target.value)} className="hidden" />
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'upi' ? 'border-[#111111]' : 'border-slate-300'}`}>
                      {paymentMethod === 'upi' && <div className="w-2.5 h-2.5 rounded-full bg-[#111111]" />}
                    </div>
                    <div>
                      <div className="font-bold text-sm text-slate-900">UPI / Online Payment</div>
                      <div className="text-[10px] text-slate-500 font-medium uppercase tracking-tight">Instant payment via GPay, PhonePe, etc.</div>
                    </div>
                  </label>

                  {paymentMethod === 'upi' && (
                    <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 animate-in fade-in slide-in-from-top-2 duration-300">
                      <div className="flex flex-col items-center text-center space-y-4">
                        {paymentSettings.upiQr && (
                          <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100">
                            <img src={paymentSettings.upiQr} alt="Payment QR" className="w-40 h-40 object-contain" />
                          </div>
                        )}
                        <div>
                          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Payable Amount</p>
                          <p className="text-2xl font-black text-slate-900">₹{calculateTotal()}</p>
                        </div>

                        {/* Mobile Direct Pay Button */}
                        <a
                          href={getUpiLink()}
                          className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-md active:scale-[0.98] transition-all"
                        >
                          <Phone className="w-4 h-4" /> Pay via UPI App
                        </a>

                        <div className="w-full space-y-2">
                          <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between text-left">
                            <div>
                              <p className="text-[10px] font-bold text-slate-400 uppercase">UPI ID</p>
                              <p className="text-sm font-bold text-slate-900">{paymentSettings.upiId}</p>
                            </div>
                            <button type="button" onClick={() => {navigator.clipboard.writeText(paymentSettings.upiId); alert('UPI ID Copied!')}} className="text-[10px] font-bold text-blue-600 px-2 py-1 bg-blue-50 rounded-md">COPY</button>
                          </div>

                          {paymentSettings.upiName && (
                            <div className="p-3 bg-white rounded-xl border border-slate-200 text-left">
                              <p className="text-[10px] font-bold text-slate-400 uppercase">Verified Name</p>
                              <p className="text-sm font-bold text-slate-900">{paymentSettings.upiName}</p>
                            </div>
                          )}
                        </div>

                        <div className="w-full pt-4 border-t border-slate-200">
                          <p className="text-xs font-bold text-slate-900 mb-3">Upload Payment Screenshot *</p>
                          <div className="relative h-32 w-full border-2 border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center bg-white hover:bg-slate-50 transition-colors cursor-pointer overflow-hidden">
                            {paymentScreenshot ? (
                              <img src={paymentScreenshot} alt="Payment Proof" className="w-full h-full object-contain p-2" />
                            ) : (
                              <div className="flex flex-col items-center">
                                <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center mb-2">
                                  <QrCode className="w-4 h-4 text-slate-400" />
                                </div>
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Tap to upload screenshot</span>
                              </div>
                            )}
                            <input type="file" accept="image/*" onChange={handleScreenshotUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                            {uploadingScreenshot && (
                              <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                                <Loader2 className="w-5 h-5 text-slate-900 animate-spin" />
                              </div>
                            )}
                          </div>
                        </div>

                        <p className="text-[10px] text-slate-500 font-medium italic leading-relaxed">Please pay exactly ₹{calculateTotal()} and upload the screenshot. Your order will be confirmed after verification.</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
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
