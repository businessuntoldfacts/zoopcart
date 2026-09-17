"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";

export default function StorePage() {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [business, setBusiness] = useState<any>(null);
  
  useEffect(() => {
    async function loadProfile() {
      setLoading(true);
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
    if (!business) return;
    setSaving(true);
    setMessage("");
    
    try {
      const { error } = await supabase.from('businesses')
        .update({
          business_name: business.business_name,
          description: business.description,
          category: business.category,
          instagram_handle: business.instagram_handle,
          whatsapp_country_code: business.whatsapp_country_code,
          whatsapp_number: business.whatsapp_number
        })
        .eq('id', business.id);
        
      if (error) throw error;
      setMessage("Profile saved successfully!");
    } catch (err: any) {
      setMessage("Error saving profile: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-white">Loading profile...</div>;
  if (!business) return <div className="p-8 text-white">Please log in to manage store.</div>;

  return (
    <div className="max-w-2xl space-y-6">
      <h2 className="text-xl font-semibold text-white">Store Profile</h2>

      {message && <div className="p-4 bg-zyp-accent/20 text-white rounded-[16px]">{message}</div>}

      <Card>
        <CardHeader>
          <CardTitle>Business Details</CardTitle>
          <CardDescription>This information will be visible on your public store. (zypcart.com/{business.username})</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Business Name</label>
            <Input value={business.business_name || ""} onChange={e => setBusiness({...business, business_name: e.target.value})} placeholder="E.g., The Cake Studio" />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <textarea 
              value={business.description || ""} onChange={e => setBusiness({...business, description: e.target.value})}
              className="flex w-full rounded-[16px] border border-white/10 bg-zyp-surface px-4 py-3 text-sm text-zyp-textPrimary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zyp-accent min-h-[100px]"
              placeholder="Tell customers about your business..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Category</label>
            <select value={business.category || ""} onChange={e => setBusiness({...business, category: e.target.value})} className="flex h-12 w-full rounded-[16px] border border-white/10 bg-zyp-surface px-4 py-2 text-sm text-zyp-textPrimary focus:outline-none focus:ring-2 focus:ring-zyp-accent">
              <option value="Home Bakers">Home Bakers</option>
              <option value="Clothing Sellers">Clothing Sellers</option>
              <option value="Jewellery Businesses">Jewellery Businesses</option>
              <option value="Others">Others</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Social & Contact</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Instagram Handle</label>
            <div className="flex">
              <span className="inline-flex items-center px-4 rounded-l-[16px] border border-r-0 border-white/10 bg-white/5 text-zyp-textMuted text-sm">
                @
              </span>
              <Input className="rounded-l-none border-l-0" value={business.instagram_handle || ""} onChange={e => setBusiness({...business, instagram_handle: e.target.value})} placeholder="zypcart_store" />
            </div>
            <p className="text-xs text-zyp-textMuted mt-1">Status: {business.instagram_handle ? "Connected" : "Not Connected"}</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">WhatsApp Number</label>
            <div className="flex gap-2">
              <select value={business.whatsapp_country_code || "+91"} onChange={e => setBusiness({...business, whatsapp_country_code: e.target.value})} className="flex h-12 w-24 rounded-[16px] border border-white/10 bg-zyp-surface px-4 py-2 text-sm text-zyp-textPrimary focus:outline-none focus:ring-2 focus:ring-zyp-accent">
                <option value="+91">+91 (IN)</option>
                <option value="+1">+1 (US)</option>
                <option value="+44">+44 (UK)</option>
              </select>
              <Input className="flex-1" value={business.whatsapp_number || ""} onChange={e => setBusiness({...business, whatsapp_number: e.target.value})} placeholder="9876543210" />
            </div>
          </div>
          
          <Button onClick={handleSave} className="mt-4" disabled={saving}>
            {saving ? "Saving..." : "Save Profile"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
