"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";

export default function StoreSettingsPage() {
  const [business, setBusiness] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase.from('businesses').select('*').eq('user_id', user.id).single();
        if (data) setBusiness(data);
      }
      setLoading(false);
    }
    loadProfile();
  }, []);

  const handleSave = async () => {
    setMessage("Saving...");
    const { error } = await supabase
      .from('businesses')
      .update({
        business_name: business.business_name,
        description: business.description,
        profile_image: business.profile_image,
        category: business.category,
        instagram_handle: business.instagram_handle,
        whatsapp_country_code: business.whatsapp_country_code,
        whatsapp_number: business.whatsapp_number,
      })
      .eq('id', business.id);

    if (error) {
      setMessage("Error saving profile.");
    } else {
      setMessage("Profile saved successfully!");
    }
  };

  if (loading) return <div className="p-8 text-slate-700">Loading profile...</div>;
  if (!business) return <div className="p-8 text-slate-700">Please log in to manage store.</div>;

  return (
    <div className="max-w-3xl mx-auto pb-12">
      <div className="mb-6">
        <h2 className="text-2xl font-extrabold text-zyp-textPrimary">Store Settings</h2>
        <p className="text-sm text-zyp-textMuted mt-1">Manage your account and preferences.</p>
      </div>

      {message && <div className="p-4 mb-6 bg-blue-50 text-blue-700 rounded-xl font-medium border border-blue-100">{message}</div>}

      <Card className="bg-white border-zyp-border shadow-sm rounded-3xl overflow-hidden">
        <CardHeader className="bg-slate-50 border-b border-zyp-border pb-4 pt-6 px-6">
          <CardTitle className="text-lg font-extrabold text-[#0F172A]">Business Details</CardTitle>
          <CardDescription className="text-sm font-medium text-slate-500">
            This information will be visible on your public store. <br/>
            <a href={`/${business.username}`} target="_blank" className="text-zyp-primary hover:underline font-bold mt-1 inline-block">zypcart.com/{business.username} ↗</a>
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
                setMessage("Uploading image...");
                
                const fileExt = file.name.split('.').pop();
                const fileName = `${business.id}-${Math.random()}.${fileExt}`;
                
                const { error: uploadError } = await supabase.storage.from('images').upload(fileName, file);
                if (uploadError) {
                  setMessage("Upload failed. Make sure you created a public 'images' bucket in Supabase.");
                  return;
                }
                
                const { data } = supabase.storage.from('images').getPublicUrl(fileName);
                setBusiness({...business, profile_image: data.publicUrl});
                setMessage("Image uploaded! Don't forget to click Save Profile.");
              }} className="bg-slate-50 border-zyp-border cursor-pointer w-full max-w-sm" />
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
            <Input value={business.description || ""} onChange={e => setBusiness({...business, description: e.target.value})} placeholder="Custom cakes for every celebration 💖" className="bg-slate-50" />
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

          <div className="pt-6 border-t border-slate-100 flex justify-end">
             <Button onClick={handleSave} variant="primary" className="font-bold rounded-xl px-8 shadow-md">
               Save Changes
             </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
