"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { ArrowLeft, UploadCloud } from "lucide-react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function StoreSettingsPage() {
  const router = useRouter();
  const [business, setBusiness] = useState<any>({
    profile_image: "",
    business_name: "",
    username: "",
    instagram_handle: "",
    city: "",
    description: "",
    // Fake states for UI matching
    email: "mofaisalmalik885522@gmail.com",
    orderPrefix: "FAI",
    freeShipping: false,
    shippingCharge: "500",
    freeAbove: "5",
    oneCityOnly: false,
    dispatchDays: "1"
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    async function loadBusiness() {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      const { data } = await supabase.from('businesses').select('*').eq('user_id', user.id).single();
      if (data) {
        setBusiness({
          ...business,
          id: data.id,
          profile_image: data.profile_image || "",
          business_name: data.business_name || "",
          username: data.username || "",
          instagram_handle: data.instagram_handle || "",
          city: data.city || "",
          description: data.description || ""
        });
      }
      setLoading(false);
    }
    loadBusiness();
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setUploadingImage(true);
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 400; 
        let scaleSize = 1;
        if (img.width > MAX_WIDTH) {
          scaleSize = MAX_WIDTH / img.width;
        }
        canvas.width = img.width * scaleSize;
        canvas.height = img.height * scaleSize;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.6); 
        setBusiness({...business, profile_image: compressedBase64});
        setUploadingImage(false);
      };
      if (event.target?.result) {
        img.src = event.target.result as string;
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!business.id) return;
    setSaving(true);
    
    const { error } = await supabase.from('businesses').update({
      business_name: business.business_name,
      instagram_handle: business.instagram_handle,
      city: business.city,
      description: business.description,
      profile_image: business.profile_image
    }).eq('id', business.id);
    
    if (error) {
      alert("Error saving: " + error.message);
    } else {
      alert("Store settings saved successfully!");
    }
    setSaving(false);
  };

  if (loading) return <div className="p-4 text-slate-500 font-medium">Loading settings...</div>;

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12 pt-4">
      <div className="flex items-center justify-between">
        <Link href="/dashboard/settings" className="flex items-center text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1" /> Settings
        </Link>
        <Button onClick={handleSave} disabled={saving} variant="primary" className="rounded-xl px-6 bg-pink-500 hover:bg-pink-600 border-none shadow-md font-bold text-white">
          {saving ? "Saving..." : "Save"}
        </Button>
      </div>
      
      <div>
        <h2 className="text-3xl font-extrabold text-slate-900">Store Settings</h2>
      </div>

      <div className="space-y-8">
        
        {/* DETAILS SECTION */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-500 tracking-wider uppercase ml-1">Details</h3>
          <div className="bg-white p-6 md:p-8 rounded-[24px] border border-slate-200 shadow-sm space-y-6">
            
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="w-24 h-24 rounded-full border-4 border-slate-50 bg-slate-100 overflow-hidden relative flex flex-col items-center justify-center text-center shadow-sm">
                {business.profile_image ? (
                  <img src={business.profile_image} alt="Logo" className="w-full h-full object-cover absolute inset-0" />
                ) : (
                  <div className="w-full h-full bg-blue-50 text-blue-500 flex items-center justify-center text-sm font-bold">
                    {business.business_name.charAt(0).toUpperCase() || "S"}
                  </div>
                )}
                <Input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
              </div>
              <div className="flex-1 text-center sm:text-left space-y-2">
                <h4 className="font-bold text-slate-900">Your Logo</h4>
                <div className="relative inline-block">
                  <Button type="button" variant="ghost" className="rounded-full bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 font-bold px-4 py-1.5 h-auto text-sm">
                    <UploadCloud className="w-4 h-4 mr-2" /> Replace logo
                  </Button>
                  <Input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
                <p className="text-xs text-slate-500 font-medium">JPG, PNG or WebP • up to 5 MB</p>
                {uploadingImage && <p className="text-xs text-pink-500 font-bold animate-pulse">Uploading...</p>}
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <label className="text-sm font-bold text-slate-900 mb-1.5 block">Store name <span className="text-pink-500">*</span></label>
                <Input value={business.business_name} onChange={e => setBusiness({...business, business_name: e.target.value})} className="bg-slate-50 border-slate-200 h-12 rounded-xl text-slate-900" />
              </div>
              <div>
                <label className="text-sm font-bold text-slate-900 mb-1.5 block">Instagram username</label>
                <Input value={business.instagram_handle} onChange={e => setBusiness({...business, instagram_handle: e.target.value})} className="bg-slate-50 border-slate-200 h-12 rounded-xl text-slate-900" placeholder="@ " />
              </div>
              <div>
                <label className="text-sm font-bold text-slate-900 mb-1.5 block">Email</label>
                <Input value={business.email} onChange={e => setBusiness({...business, email: e.target.value})} className="bg-slate-50 border-slate-200 h-12 rounded-xl text-slate-900" />
              </div>
              <div>
                <label className="text-sm font-bold text-slate-900 mb-1.5 block">Location</label>
                <Input value={business.city} onChange={e => setBusiness({...business, city: e.target.value})} className="bg-slate-50 border-slate-200 h-12 rounded-xl text-slate-900" />
              </div>
              <div>
                <label className="text-sm font-bold text-slate-900 mb-1.5 block">Description</label>
                <textarea value={business.description} onChange={e => setBusiness({...business, description: e.target.value})} className="w-full bg-slate-50 border border-slate-200 p-3 h-24 rounded-xl text-slate-900 resize-none text-sm outline-none focus:border-pink-500" placeholder="Shown on your storefront. What you make, and for whom." />
                <p className="text-xs text-slate-500 mt-2">Shown on your storefront. What you make, and for whom.</p>
              </div>
              <div className="pt-2">
                <p className="text-sm font-medium text-slate-600">Your storefront: <span className="font-bold">{business.username}.zypcart.com</span></p>
              </div>
            </div>
          </div>
        </div>

        {/* ORDERS SECTION */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-500 tracking-wider uppercase ml-1">Orders</h3>
          <div className="bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm">
            <label className="text-sm font-bold text-slate-900 mb-1.5 block">Order prefix</label>
            <Input value={business.orderPrefix} onChange={e => setBusiness({...business, orderPrefix: e.target.value})} className="bg-slate-50 border-slate-200 h-12 rounded-xl text-slate-900" />
            <p className="text-xs text-slate-500 mt-2">Order numbers will look like {business.orderPrefix}-1001.</p>
          </div>
        </div>

        {/* SHIPPING SECTION */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-500 tracking-wider uppercase ml-1">Shipping</h3>
          <div className="bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm space-y-6">
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-slate-900 font-bold text-sm">Free shipping</h4>
                <p className="text-xs text-slate-500">Customers pay the charge below.</p>
              </div>
              <button type="button" onClick={() => setBusiness({...business, freeShipping: !business.freeShipping})} className={`w-12 h-6 rounded-full transition-colors relative ${business.freeShipping ? 'bg-pink-500' : 'bg-slate-200'}`}>
                <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 shadow-sm transition-transform ${business.freeShipping ? 'translate-x-6' : 'translate-x-0.5'}`}></div>
              </button>
            </div>

            <div>
              <label className="text-sm font-bold text-slate-900 mb-1.5 block">Charge</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">₹</span>
                <Input type="number" value={business.shippingCharge} onChange={e => setBusiness({...business, shippingCharge: e.target.value})} className="bg-slate-50 border-slate-200 h-12 rounded-xl pl-8 text-slate-900" />
              </div>
            </div>

            <div>
              <label className="text-sm font-bold text-slate-900 mb-1.5 block">Free above</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">₹</span>
                <Input type="number" value={business.freeAbove} onChange={e => setBusiness({...business, freeAbove: e.target.value})} className="bg-slate-50 border-slate-200 h-12 rounded-xl pl-8 text-slate-900" />
              </div>
              <p className="text-xs text-slate-500 mt-2">Order value that earns free shipping. 0 for never.</p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <div>
                <h4 className="text-slate-900 font-bold text-sm">Deliver to one city only</h4>
                <p className="text-xs text-slate-500">Your storefront says you ship across India.</p>
              </div>
              <button type="button" onClick={() => setBusiness({...business, oneCityOnly: !business.oneCityOnly})} className={`w-12 h-6 rounded-full transition-colors relative ${business.oneCityOnly ? 'bg-pink-500' : 'bg-slate-200'}`}>
                <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 shadow-sm transition-transform ${business.oneCityOnly ? 'translate-x-6' : 'translate-x-0.5'}`}></div>
              </button>
            </div>

            <div>
              <label className="text-sm font-bold text-slate-900 mb-1.5 block">Dispatch</label>
              <Input type="number" value={business.dispatchDays} onChange={e => setBusiness({...business, dispatchDays: e.target.value})} className="bg-slate-50 border-slate-200 h-12 rounded-xl text-slate-900" />
              <p className="text-xs text-slate-500 mt-2">How many days it usually takes to dispatch an order.</p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

