"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import { ShieldCheck, ChevronLeft, CheckCircle2, Copy, MessageCircle, UploadCloud } from "lucide-react";
import Link from "next/link";

export default function RequestForm({ params }: { params: { username: string, productSlug: string } }) {
  const [product, setProduct] = useState<any>(null);
  const [business, setBusiness] = useState<any>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [trackingToken, setTrackingToken] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    quantity: 1,
    budget: "",
    requiredDate: "",
    notes: "",
    delivery_location: "",
    city: "",
    pincode: "",
    reference_image: ""
  });

  useEffect(() => {
    async function loadData() {
      const { data: b } = await supabase.from('businesses').select('*').eq('username', params.username.toLowerCase()).single();
      if (b) {
        setBusiness(b);
        const { data: p } = await supabase.from('products').select('*').eq('business_id', b.id).eq('slug', params.productSlug).single();
        if (p) setProduct(p);
      }
    }
    loadData();
  }, [params.username, params.productSlug]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploadingImage(true);
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 600;
        const scaleSize = Math.min(MAX_WIDTH / img.width, 1);
        canvas.width = img.width * scaleSize;
        canvas.height = img.height * scaleSize;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        setFormData({...formData, reference_image: canvas.toDataURL('image/jpeg', 0.6)});
        setUploadingImage(false);
      };
      if (event.target?.result) img.src = event.target.result as string;
    };
    reader.readAsDataURL(file);
  };

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
      budget: formData.budget ? parseFloat(formData.budget) : null,
      required_date: formData.requiredDate || null,
      notes: formData.notes,
      delivery_location: formData.delivery_location,
      city: formData.city,
      pincode: formData.pincode,
      reference_image: formData.reference_image,
      tracking_token: token,
      status: 'new'
    }]);

    setLoading(false);
    if (!error) {
      setTrackingToken(token);
      setIsSubmitted(true);
    } else {
      alert("Error submitting request: " + (error.message || "Please try again."));
    }
  };

  if (!product || !business) return <div className="p-8 text-center text-slate-500 font-bold">Loading...</div>;

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-zyp-bg flex flex-col items-center justify-center p-6 font-sans text-center">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 border-8 border-white shadow-xl shadow-green-900/5 relative">
          <CheckCircle2 className="w-12 h-12 text-green-500 absolute" />
          <div className="absolute top-0 right-0 w-3 h-3 bg-blue-500 rounded-full animate-ping"></div>
          <div className="absolute bottom-2 left-2 w-2 h-2 bg-yellow-400 rounded-full"></div>
          <div className="absolute top-4 left-0 w-1.5 h-1.5 bg-red-400 rounded-full"></div>
        </div>
        
        <h1 className="text-3xl font-extrabold text-[#0F172A] mb-2">Request Submitted!</h1>
        <p className="text-sm font-medium text-slate-500 max-w-xs mb-8">
          Your request has been sent to <span className="font-bold text-[#0F172A]">{business.business_name}</span>.
        </p>

        <div className="bg-white p-6 rounded-3xl border border-zyp-border shadow-sm w-full max-w-sm mb-6 relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-400 to-indigo-500"></div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Order ID</p>
          <div className="text-2xl font-extrabold text-[#0F172A] font-mono mb-2 tracking-widest flex items-center justify-center gap-3">
            ORD-{trackingToken} <Copy className="w-5 h-5 text-slate-300 hover:text-zyp-primary cursor-pointer transition-colors" />
          </div>
          <p className="text-xs text-slate-500 font-medium leading-relaxed">
            The seller will review your request and update the status. You can track your order anytime using the link below.
          </p>
        </div>

        <div className="w-full max-w-sm space-y-3 mb-8">
          <Link href={`/order/${trackingToken}`}>
            <Button variant="primary" className="w-full h-14 rounded-2xl text-lg font-bold shadow-lg shadow-zyp-primary/20 bg-zyp-primary">
              View Request &rarr;
            </Button>
          </Link>
          <Link href={`/${business.username}`}>
            <Button variant="secondary" className="w-full h-12 rounded-xl text-sm font-bold bg-white text-[#0F172A] border border-zyp-border hover:bg-slate-50">
              <ChevronLeft className="w-4 h-4 mr-1" /> Back to Store
            </Button>
          </Link>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-zyp-border shadow-sm w-full max-w-sm text-left">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Track your order anytime</p>
          <p className="text-[10px] text-slate-500 mb-3 font-medium">Save this link to check updates</p>
          <div className="flex gap-2">
            <input readOnly value={`zypcart.com/order/${trackingToken}`} className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 text-xs font-mono text-slate-600 outline-none" />
            <button className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center shrink-0 hover:bg-blue-100"><Copy className="w-4 h-4" /></button>
          </div>
        </div>
        
        <a href={`https://wa.me/${business.whatsapp_country_code}${business.whatsapp_number}?text=Hi, I just submitted an order request (ORD-${trackingToken})`} target="_blank" className="mt-4 w-full max-w-sm">
          <div className="bg-green-50 p-4 rounded-2xl flex items-center gap-4 text-left border border-green-100">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white shrink-0 shadow-md">
              <MessageCircle className="w-5 h-5 fill-current" />
            </div>
            <div>
              <div className="text-sm font-bold text-green-900">Need to talk to the seller?</div>
              <div className="text-xs font-medium text-green-700">You can also contact {business.business_name} on WhatsApp.</div>
            </div>
          </div>
        </a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zyp-bg font-sans pb-8">
      <header className="bg-white px-4 h-14 flex items-center justify-between sticky top-0 z-50 border-b border-zyp-border">
        <Link href={`/${business.username}/${product.slug}`} className="flex items-center text-sm font-bold text-[#0F172A] -ml-2">
          <ChevronLeft className="w-6 h-6" /> Back to Product
        </Link>
        <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50 px-2 py-1 rounded">
          <ShieldCheck className="w-3.5 h-3.5 text-green-500" /> Secure Request
        </div>
      </header>

      <div className="max-w-md mx-auto p-4 pt-6">
        <h1 className="text-2xl font-extrabold text-[#0F172A] mb-1">Request This Product</h1>
        <p className="text-sm font-medium text-slate-500 mb-6">Fill in your details to send a request to <span className="font-bold text-[#0F172A]">{business.business_name}</span>.</p>

        <div className="bg-white p-3 rounded-2xl flex items-center gap-4 border border-zyp-border shadow-sm mb-8">
          <div className="w-16 h-16 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-100">
            {product.image ? <img src={product.image} className="w-full h-full object-cover" /> : <div className="w-full h-full" />}
          </div>
          <div>
            <h3 className="font-extrabold text-[#0F172A] text-sm">{product.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="font-extrabold text-[#0F172A]">₹{product.price}</span>
              <span className="text-xs font-bold text-slate-400 line-through">₹{Math.round(product.price * 1.3)}</span>
            </div>
            <div className="mt-1 flex items-center text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded w-max">
              <CheckCircle2 className="w-3 h-3 mr-1" /> By {business.business_name}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#0F172A] ml-1">Full Name *</label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">👤</div>
              <Input required placeholder="Enter your full name" className="pl-10 bg-white" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
          </div>
          
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#0F172A] ml-1">Phone Number *</label>
            <div className="flex gap-2">
              <div className="w-24 bg-white border border-zyp-border rounded-lg flex items-center justify-center gap-2 text-sm font-bold text-[#0F172A]">
                🇮🇳 +91
              </div>
              <Input required type="tel" placeholder="9876543210" className="flex-1 bg-white" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#0F172A] ml-1">Email Address *</label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">✉️</div>
              <Input required type="email" placeholder="you@example.com" className="pl-10 bg-white" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#0F172A] ml-1">Quantity *</label>
              <div className="flex items-center justify-between border border-zyp-border rounded-lg bg-white overflow-hidden h-12">
                <button type="button" onClick={() => setFormData({...formData, quantity: Math.max(1, formData.quantity - 1)})} className="w-12 h-full flex items-center justify-center font-bold text-slate-400 hover:bg-slate-50">-</button>
                <div className="font-extrabold text-[#0F172A]">{formData.quantity}</div>
                <button type="button" onClick={() => setFormData({...formData, quantity: formData.quantity + 1})} className="w-12 h-full flex items-center justify-center font-bold text-slate-400 hover:bg-slate-50">+</button>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#0F172A] ml-1">Your Budget (₹) *</label>
              <Input required type="number" placeholder="1000" className="bg-white" value={formData.budget} onChange={e => setFormData({...formData, budget: e.target.value})} />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#0F172A] ml-1">Required Date *</label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">📅</div>
              <Input required type="date" className="pl-10 bg-white" value={formData.requiredDate} onChange={e => setFormData({...formData, requiredDate: e.target.value})} />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#0F172A] ml-1">Address / Location *</label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">📍</div>
              <Input required placeholder="Enter your complete address" className="pl-10 bg-white" value={formData.delivery_location} onChange={e => setFormData({...formData, delivery_location: e.target.value})} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#0F172A] ml-1">City *</label>
              <Input required placeholder="Lucknow" className="bg-white" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#0F172A] ml-1">Pincode *</label>
              <Input required placeholder="226001" className="bg-white" value={formData.pincode} onChange={e => setFormData({...formData, pincode: e.target.value})} />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#0F172A] ml-1">Notes (Optional)</label>
            <textarea placeholder="Any special request? (e.g. design, message on cake, etc.)" className="w-full rounded-xl border border-zyp-border bg-white px-4 py-3 text-sm text-[#0F172A] placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-zyp-primary/20 min-h-[100px]" value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#0F172A] ml-1">Reference Image (Optional)</label>
            <div className="w-full rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 p-4 flex flex-col items-center justify-center relative cursor-pointer hover:border-zyp-primary/50 transition-colors">
              {formData.reference_image ? (
                <img src={formData.reference_image} className="h-32 object-contain" />
              ) : (
                <>
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm mb-2 text-blue-600">
                    <UploadCloud className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-bold text-zyp-textPrimary">Choose Image</span>
                  <span className="text-[10px] text-slate-400 font-medium">JPG, PNG, WEBP (Max 5MB)</span>
                </>
              )}
              <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
            </div>
            {uploadingImage && <div className="text-[10px] font-bold text-zyp-primary text-center mt-1">Processing image...</div>}
          </div>

          <Button type="submit" variant="primary" className="w-full h-14 rounded-xl text-lg font-bold shadow-lg shadow-zyp-primary/20 mt-8">
            {loading ? "Submitting..." : (
               <span className="flex items-center">Submit Request <span className="text-xl ml-2">✈️</span></span>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
