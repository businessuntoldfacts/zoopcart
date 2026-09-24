"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, CheckCircle2, Copy, MessageCircle, User, Phone, Mail, FileText, MapPin, Calendar, CreditCard, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RequestForm({ params }: { params: { username: string, productSlug: string } }) {
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [business, setBusiness] = useState<any>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [orderData, setOrderData] = useState<any>(null);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    quantity: 1,
        requiredDate: "",
    delivery_location: ""
  });

  useEffect(() => {
    async function fetchData() {
      const { data: b } = await supabase.from('businesses').select('*').eq('username', params.username.toLowerCase()).single();
      if (!b) return router.push('/');
      setBusiness(b);

      const { data: p } = await supabase.from('products').select('*').eq('business_id', b.id).eq('slug', params.productSlug).single();
      if (!p) return router.push(`/${b.username}`);
      setProduct(p);
    }
    fetchData();
  }, [params.username, params.productSlug, router]);

  
  let deliveryType = "free";
  let deliveryCharge = 0;
  let cleanDescription = product?.description || "";
  if (cleanDescription.includes('---ZYP_DELIVERY:')) {
    const parts = cleanDescription.split('---ZYP_DELIVERY:');
    try {
      const meta = JSON.parse(parts[1].split('---')[0]);
      deliveryType = meta.type || "free";
      deliveryCharge = meta.charge ? parseFloat(meta.charge) : 0;
    } catch(e) {}
  }
  
  const productTotal = (product?.price || 0) * formData.quantity;
  const finalPrice = productTotal + (deliveryType === 'paid' ? deliveryCharge : 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product || !business) return;
    setLoading(true);

    const token = Math.random().toString(36).substring(2, 10).toUpperCase();

    const { error } = await supabase.from('orders').insert([{
      business_id: business.id,
      product_id: product.id,
      customer_name: formData.name,
      customer_phone: formData.phone,
      customer_email: formData.email,
      quantity: formData.quantity,
      budget: finalPrice,
      required_date: formData.requiredDate || null,
      notes: `Total: ₹${finalPrice} (Product: ₹${productTotal} + Delivery: ₹${deliveryType === "paid" ? deliveryCharge : 0})`,
      delivery_location: formData.delivery_location,
      tracking_token: token,
      status: 'pending'
    }]);

    // Send high-quality branded email notification instantly to the buyer if email is provided
    if (!error) {
      // 1. Send to Buyer
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
              productName: product.name,
              price: product.price,
              quantity: formData.quantity,
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
          console.error("❌ Order notification email failed:", emailErr);
        }
      } else {
        console.log("ℹ️ No buyer email provided, skipping.");
      }

      // 2. Send to Seller
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
              productName: product.name,
              price: finalPrice,
              quantity: formData.quantity,
              deliveryLocation: formData.delivery_location,
              notes: `Total: ₹${finalPrice} (Product: ₹${productTotal} + Delivery: ₹${deliveryType === "paid" ? deliveryCharge : 0})`
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
        console.error("❌ Seller notification failed:", sellerEmailErr);
      }
    }

    setLoading(false);
    if (error) {
      alert("Error submitting request. Please try again.");
    } else {
      const message = encodeURIComponent(`Hi, I've just submitted a request for ${product.name} (Qty: ${formData.quantity}).\n\nOrder ID: ${token}\nTotal: ₹${finalPrice}\n\nLink: ${window.location.origin}/${business.username}/track?token=${token}`);
      const whatsappUrl = `https://wa.me/${business.whatsapp_country_code || '91'}${business.whatsapp_number || ''}?text=${message}`;

      setOrderData({ token, product, date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }), whatsappUrl });
      setIsSubmitted(true);
    }
  };

  if (!product || !business) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center"><div className="w-8 h-8 border-4 border-slate-300 border-t-blue-500 rounded-full animate-spin"></div></div>;
  }

  if (isSubmitted && orderData) {
    return (
      <div className="min-h-screen bg-slate-50 font-sans pb-8 px-4 flex flex-col pt-12">
        <div className="max-w-md mx-auto w-full flex-1 flex flex-col">
          {/* Success Screen (Screen 4) */}
          <div className="flex flex-col items-center text-center mt-8">
            <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center relative mb-6 animate-in zoom-in duration-500">
               <div className="absolute -inset-4 bg-confetti bg-cover bg-center opacity-50"></div>
               <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center shadow-lg shadow-green-500/30">
                 <CheckCircle2 className="w-8 h-8 text-white" />
               </div>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 mb-2">Request Submitted!</h1>
            <p className="text-sm font-medium text-slate-500 max-w-[260px] mx-auto leading-relaxed">
              Your request has been sent to the seller. The seller will review your request and contact you soon.
            </p>
          </div>

          <div className="bg-white rounded-[24px] border border-slate-100 p-1 shadow-sm mt-8">
            <div className="p-4 border-b border-slate-50 flex gap-4">
              <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Request ID</div>
                <div className="font-extrabold text-slate-900 text-base flex items-center justify-between">
                  {orderData.token}
                  <button className="text-slate-400 hover:text-slate-900" onClick={() => navigator.clipboard.writeText(orderData.token)}><Copy className="w-4 h-4" /></button>
                </div>
              </div>
            </div>
            <div className="p-4 border-b border-slate-50 flex gap-4">
              <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden shrink-0">
                {product.image ? <img src={product.image} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-indigo-200 text-[10px] font-bold">N/A</div>}
              </div>
              <div className="flex-1">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Product</div>
                <div className="font-extrabold text-slate-900 text-sm leading-tight">{product.name}</div>
              </div>
            </div>
            <div className="p-4 border-b border-slate-50 flex gap-4">
              <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              </div>
              <div className="flex-1">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Submitted On</div>
                <div className="font-extrabold text-slate-900 text-sm">{orderData.date}</div>
              </div>
            </div>
            <div className="p-4 flex gap-4">
              <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-500 shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
              </div>
              <div className="flex-1 flex flex-col justify-center">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Status</div>
                <div className="bg-orange-100 text-orange-600 text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded self-start">Pending Review</div>
              </div>
            </div>
          </div>

          <div className="mt-8 space-y-3 pb-8">
            <Link href={`/${business.username}/track`} className="flex">
              <button className="w-full h-14 rounded-2xl bg-[#111111] hover:bg-[#111111] text-white font-extrabold text-lg flex items-center justify-center gap-2 shadow-lg shadow-black/20 transition-all">
                Track Request
              </button>
            </Link>
            <Link href={`/${business.username}`} className="flex">
              <button className="w-full h-14 rounded-2xl bg-white border border-slate-200 text-slate-900 hover:bg-slate-50 font-extrabold text-lg flex items-center justify-center gap-2 transition-all">
                Back to Store
              </button>
            </Link>
          </div>
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
        <h1 className="font-extrabold text-base text-slate-900 tracking-tight">Request Product</h1>
      </header>

      <div className="max-w-md mx-auto">
        
        {/* Product Mini Card */}
        <div className="m-4 bg-white rounded-2xl p-3 flex items-center gap-4 border border-slate-100 shadow-sm">
          <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-50 border border-slate-100 shrink-0">
             {product.image ? <img src={product.image} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-slate-300 text-[10px] font-bold">N/A</div>}
          </div>
          <div>
             <h2 className="font-extrabold text-sm text-slate-900 line-clamp-1">{product.name}</h2>
             <div className="font-extrabold text-[#111111] text-base mt-0.5">₹{product.price}</div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="px-4 mt-6">
          <h3 className="font-extrabold text-slate-900 mb-4 text-sm tracking-wider uppercase">Your Details</h3>
          
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 mb-1.5 block">Full Name <span className="text-[#111111]">*</span></label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="Enter your full name" className="w-full h-14 pl-11 pr-4 rounded-xl border border-slate-200 bg-white outline-none focus:border-[#111111] focus:ring-2 focus:ring-[#111111]/20 text-sm font-medium transition-all" />
              </div>
            </div>
            
            <div>
              <label className="text-xs font-bold text-slate-700 mb-1.5 block">Phone Number <span className="text-[#111111]">*</span></label>
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
          </div>

          
          <h3 className="font-extrabold text-slate-900 mb-4 mt-8 text-sm tracking-wider uppercase">Request Details</h3>
          
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 mb-1.5 block">Quantity <span className="text-[#111111]">*</span></label>
              <div className="relative">
                <select value={formData.quantity} onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value)})} className="w-full h-14 pl-4 pr-10 rounded-xl border border-slate-200 bg-white outline-none focus:border-[#111111] focus:ring-2 focus:ring-[#111111]/20 text-sm font-extrabold appearance-none transition-all">
                  {[1, 2, 3, 4, 5, 10, 20, 50].map(num => <option key={num} value={num}>{num}</option>)}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
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
              <label className="text-xs font-bold text-slate-700 mb-1.5 block">Delivery Location <span className="text-[#111111]">*</span></label>
              <div className="relative">
                <MapPin className="absolute left-4 top-4 w-4 h-4 text-slate-400" />
                <textarea required value={formData.delivery_location} onChange={(e) => setFormData({...formData, delivery_location: e.target.value})} placeholder="Enter full address" className="w-full h-24 pt-4 pb-4 pl-11 pr-4 rounded-xl border border-slate-200 bg-white outline-none focus:border-[#111111] focus:ring-2 focus:ring-[#111111]/20 text-sm font-medium transition-all resize-none"></textarea>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 mt-6 mb-24">

            <h4 className="font-extrabold text-slate-900 text-sm mb-3">Order Summary</h4>
            <div className="flex justify-between text-sm font-medium text-slate-600 mb-2">
              <span>Item Total ({formData.quantity}x)</span>
              <span>₹{productTotal}</span>
            </div>
            <div className="flex justify-between text-sm font-medium text-slate-600 mb-3 pb-3 border-b border-slate-200">
              <span>Delivery Charge</span>
              <span className={deliveryType === 'free' ? "text-green-600 font-bold" : ""}>{deliveryType === 'free' ? "Free" : `₹${deliveryCharge}`}</span>
            </div>
            <div className="flex justify-between text-lg font-extrabold text-slate-900">
              <span>Final Price</span>
              <span>₹{finalPrice}</span>
            </div>
          </div>

          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 z-50 p-4 pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.06)]">
            <div className="max-w-md mx-auto">
              <button disabled={loading} type="submit" className="w-full h-14 rounded-2xl bg-[#111111] hover:bg-[#111111] disabled:opacity-50 text-white font-extrabold text-lg flex items-center justify-center gap-2 shadow-lg shadow-black/20 transition-all active:scale-[0.98]">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                {loading ? "Submitting..." : "Submit Request"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
