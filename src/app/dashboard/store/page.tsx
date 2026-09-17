"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { CheckCircle2, XCircle, LayoutTemplate } from "lucide-react";

export default function StoreSettingsPage() {
  const [business, setBusiness] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' | 'loading' | null }>({ message: '', type: null });

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase.from('businesses').select('*').eq('user_id', user.id).single();
        if (data) {
          if (!data.theme) data.theme = data.instagram_profile_url || 'light';
          setBusiness(data);
        }
      }
      setLoading(false);
    }
    loadProfile();
  }, []);

  const showToast = (message: string, type: 'success' | 'error' | 'loading') => {
    setToast({ message, type });
    if (type !== 'loading') {
      setTimeout(() => setToast({ message: '', type: null }), 3000);
    }
  };

  const handleSave = async () => {
    showToast("Saving changes...", 'loading');
    
    const updateData: any = {
        business_name: business.business_name,
        description: business.description,
        profile_image: business.profile_image,
        category: business.category,
        instagram_handle: business.instagram_handle,
        instagram_profile_url: business.theme, // Storing theme here since there is no dedicated column
        whatsapp_country_code: business.whatsapp_country_code,
        whatsapp_number: business.whatsapp_number,
    };

    const { error } = await supabase.from('businesses').update(updateData).eq('id', business.id);

    if (error) {
      showToast("Error saving profile.", 'error');
    } else {
      showToast("Settings saved successfully!", 'success');
    }
  };

  if (loading) return <div className="p-8 text-slate-700">Loading profile...</div>;
  if (!business) return <div className="p-8 text-slate-700">Please log in to manage store.</div>;

  return (
    <div className="max-w-3xl mx-auto pb-12 relative">
      {/* Animated Toast */}
      <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 transform ${toast.type ? 'translate-y-0 opacity-100' : '-translate-y-12 opacity-0'}`}>
        {toast.type && (
          <div className={`flex items-center gap-2 px-4 py-3 rounded-2xl shadow-lg border text-sm font-bold ${
            toast.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 
            toast.type === 'error' ? 'bg-red-50 border-red-200 text-red-700' : 
            'bg-blue-50 border-blue-200 text-blue-700'
          }`}>
            {toast.type === 'success' && <CheckCircle2 className="w-5 h-5" />}
            {toast.type === 'error' && <XCircle className="w-5 h-5" />}
            {toast.type === 'loading' && <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />}
            {toast.message}
          </div>
        )}
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-extrabold text-[#0F172A]">Store Settings</h2>
        <p className="text-sm text-slate-500 mt-1">Manage your account and preferences.</p>
      </div>

      <Card className="bg-white border-slate-200 shadow-sm rounded-3xl overflow-hidden mb-6">
        <CardHeader className="bg-slate-50 border-b border-slate-200 pb-4 pt-6 px-6">
          <CardTitle className="text-lg font-extrabold text-[#0F172A]">Business Details</CardTitle>
          <CardDescription className="text-sm font-medium text-slate-500">
            This information will be visible on your public store. <br/>
            <a href={`/${business.username}`} target="_blank" className="text-blue-600 hover:underline font-bold mt-1 inline-block">zypcart.com/{business.username} ↗</a>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-[#0F172A]">Store Logo / Profile Photo</label>
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-slate-100 overflow-hidden border-4 border-white shadow-sm shrink-0">
                {business.profile_image ? (
                  <img src={business.profile_image} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs font-bold">Upload</div>
                )}
              </div>
              <Input type="file" accept="image/*" onChange={async (e) => {
                if (!e.target.files || e.target.files.length === 0) return;
                const file = e.target.files[0];
                showToast("Processing image...", 'loading');
                
                // Compress image client-side to ensure small base64 string
                const reader = new FileReader();
                reader.onload = (event) => {
                  const img = new Image();
                  img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const MAX_WIDTH = 400; // smaller for profile pics
                    const scaleSize = Math.min(MAX_WIDTH / img.width, 1);
                    canvas.width = img.width * scaleSize;
                    canvas.height = img.height * scaleSize;
                    const ctx = canvas.getContext('2d');
                    ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
                    const compressedBase64 = canvas.toDataURL('image/jpeg', 0.6); // 60% quality JPEG
                    
                    setBusiness({...business, profile_image: compressedBase64});
                    showToast("Image updated! Don't forget to click Save.", 'success');
                  };
                  if (event.target?.result) {
                    img.src = event.target.result as string;
                  }
                };
                reader.readAsDataURL(file);
              }} className="bg-slate-50 border-slate-200 cursor-pointer w-full max-w-sm" />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-[#0F172A]">Business Name</label>
              <Input value={business.business_name || ""} onChange={e => setBusiness({...business, business_name: e.target.value})} placeholder="E.g., ABC Cakes" className="bg-slate-50" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-[#0F172A]">Category</label>
              <Input value={business.category || ""} onChange={e => setBusiness({...business, category: e.target.value})} placeholder="e.g. Home Bakers" className="bg-slate-50" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-[#0F172A]">Description</label>
            <Input value={business.description || ""} onChange={e => setBusiness({...business, description: e.target.value})} placeholder="Custom cakes for every celebration 🎉" className="bg-slate-50" />
          </div>
          
          <div className="grid sm:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
            <div className="space-y-2">
              <label className="text-sm font-bold text-[#0F172A]">Instagram Handle</label>
              <Input value={business.instagram_handle || ""} onChange={e => setBusiness({...business, instagram_handle: e.target.value})} placeholder="@abc_cakes" className="bg-slate-50" />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-bold text-[#0F172A]">WhatsApp Number</label>
              <div className="flex gap-2">
                <Input className="w-20 bg-slate-50 text-center" value={business.whatsapp_country_code || "91"} onChange={e => setBusiness({...business, whatsapp_country_code: e.target.value})} placeholder="91" />
                <Input className="flex-1 bg-slate-50" value={business.whatsapp_number || ""} onChange={e => setBusiness({...business, whatsapp_number: e.target.value})} placeholder="9876543210" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white border-slate-200 shadow-sm rounded-3xl overflow-hidden mb-6">
        <CardHeader className="bg-slate-50 border-b border-slate-200 pb-4 pt-6 px-6">
          <CardTitle className="text-lg font-extrabold text-[#0F172A] flex items-center gap-2">
            <LayoutTemplate className="w-5 h-5 text-blue-500" />
            Store Theme
          </CardTitle>
          <CardDescription className="text-sm font-medium text-slate-500">
            Choose a design theme for your customer-facing store.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {['light', 'dark', 'playful'].map(t => (
              <div 
                key={t}
                onClick={() => setBusiness({...business, theme: t})}
                className={`border-2 rounded-2xl p-4 cursor-pointer transition-all ${business.theme === t ? 'border-blue-500 bg-blue-50/50' : 'border-slate-100 hover:border-slate-300'}`}
              >
                <div className={`w-full h-24 rounded-lg mb-3 ${
                  t === 'light' ? 'bg-white border border-slate-200' : 
                  t === 'dark' ? 'bg-slate-900 border border-slate-800' : 
                  'bg-gradient-to-br from-pink-100 to-orange-100 border border-pink-200'
                }`}>
                   <div className="p-2 space-y-2">
                     <div className={`w-1/2 h-2 rounded-full ${t === 'dark' ? 'bg-slate-700' : 'bg-slate-200'}`}></div>
                     <div className={`w-3/4 h-2 rounded-full ${t === 'dark' ? 'bg-slate-800' : 'bg-slate-100'}`}></div>
                   </div>
                </div>
                <h4 className="font-bold text-[#0F172A] text-center capitalize">{t} Theme</h4>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end pb-8">
        <Button onClick={handleSave} variant="primary" className="font-bold rounded-xl px-8 shadow-md h-12">
          Save All Changes
        </Button>
      </div>
    </div>
  );
}
