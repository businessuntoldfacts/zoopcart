"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle2, LayoutTemplate } from "lucide-react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useDashboardData, invalidateDashboardCache } from "@/lib/useDashboardData";

export default function ThemeSettingsPage() {
  const router = useRouter();
  const { business: cachedBusiness, loading } = useDashboardData();
  const [business, setBusiness] = useState<any>({ id: null, theme: "light" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (cachedBusiness) {
      let t = "light";
      try {
        if (cachedBusiness.instagram_profile_url && cachedBusiness.instagram_profile_url.startsWith('{')) {
          const parsed = JSON.parse(cachedBusiness.instagram_profile_url);
          if (parsed.theme) t = parsed.theme;
        } else if (cachedBusiness.instagram_profile_url) {
          t = cachedBusiness.instagram_profile_url; // fallback for old data
        }
      } catch (e) {}
      setBusiness({ id: cachedBusiness.id, theme: t });
    }
  }, [cachedBusiness]);

  const handleSave = async () => {
    if (!business.id) return;
    setSaving(true);
    
    // Merge existing JSON
    const { data: currentData } = await supabase.from('businesses').select('instagram_profile_url').eq('id', business.id).single();
    let extraSettings: any = {};
    try {
      if (currentData?.instagram_profile_url && currentData.instagram_profile_url.startsWith('{')) {
        extraSettings = JSON.parse(currentData.instagram_profile_url);
      }
    } catch (e) {}

    extraSettings.theme = business.theme;
    
    const { error } = await supabase.from('businesses').update({
      instagram_profile_url: JSON.stringify(extraSettings)
    }).eq('id', business.id);
    
    if (error) {
      alert("Error saving: " + error.message);
    } else {
      alert("Theme saved successfully!");
    }
    setSaving(false);
  };

  const themes = [
    { id: 'light', name: 'Minimal Light', desc: 'Clean, white backgrounds with soft borders.' },
    { id: 'dark', name: 'Midnight Dark', desc: 'Sleek dark mode with electric blue accents.' },
    { id: 'playful', name: 'Playful Sunset', desc: 'Warm yellow and orange tones for a vibrant feel.' }
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12 pt-4">
      <div className="flex items-center justify-between">
        <Link href="/dashboard/settings" className="flex items-center text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1" /> Settings
        </Link>
        <Button onClick={handleSave} disabled={saving} variant="primary" className="rounded-xl px-6 bg-blue-500 hover:bg-blue-600 border-none shadow-md font-bold text-white">
          {saving ? "Saving..." : "Save"}
        </Button>
      </div>
      
      <div>
        <h2 className="text-3xl font-extrabold text-slate-900">Website Theme</h2>
        <p className="text-sm text-slate-500 font-medium mt-1">Choose how your storefront looks to customers.</p>
      </div>

      <div className="space-y-6">
        <div className="bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {themes.map(t => (
              <div 
                key={t.id}
                onClick={() => setBusiness({...business, theme: t.id})}
                className={`border-2 rounded-2xl p-4 cursor-pointer transition-all relative ${business.theme === t.id ? 'border-blue-500 bg-blue-50' : 'border-slate-100 hover:border-slate-300'}`}
              >
                {business.theme === t.id && (
                  <div className="absolute -top-3 -right-3 bg-blue-500 text-white rounded-full p-1 border-2 border-white shadow-sm">
                     <CheckCircle2 className="w-4 h-4" />
                  </div>
                )}
                <div className={`w-full h-24 rounded-lg mb-4 shadow-sm border ${
                  t.id === 'light' ? 'bg-white border-slate-200' : 
                  t.id === 'dark' ? 'bg-slate-950 border-slate-800' : 
                  'bg-yellow-50 border-yellow-200'
                }`}>
                   <div className="p-3 space-y-2 h-full flex flex-col justify-end">
                     <div className={`w-1/2 h-2 rounded-full ${t.id === 'dark' ? 'bg-slate-800' : t.id === 'light' ? 'bg-slate-200' : 'bg-yellow-200'}`}></div>
                     <div className={`w-3/4 h-2 rounded-full ${t.id === 'dark' ? 'bg-slate-800' : t.id === 'light' ? 'bg-slate-200' : 'bg-yellow-200'}`}></div>
                   </div>
                </div>
                <h4 className="font-bold text-slate-900 text-sm mb-1">{t.name}</h4>
                <p className="text-[11px] text-slate-500 leading-tight">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

