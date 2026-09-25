"use client";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings, Percent, Bell, Shield, Mail, CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function AdminSettingsPage() {
  const [platformSettings, setPlatformSettings] = useState({
    platform_fee: "2",
    fixed_fee: "0",
    global_banner: "",
    enable_banner: false,
    sender_email: "hello@zoopcart.com"
  });
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    async function loadSettings() {
      const { data } = await supabase.from('platform_settings').select('*').single();
      if (data) {
        setPlatformSettings({
          platform_fee: data.platform_fee?.toString() || "2",
          fixed_fee: data.fixed_fee?.toString() || "0",
          global_banner: data.global_banner || "",
          enable_banner: !!data.enable_banner,
          sender_email: data.sender_email || "hello@zoopcart.com"
        });
      }
    }
    loadSettings();
  }, []);

  const saveSettings = async (updatedFields: Partial<typeof platformSettings>) => {
    setLoading(true);
    setSuccessMsg("");

    const newSettings = { ...platformSettings, ...updatedFields };
    setPlatformSettings(newSettings);

    // Upsert logic for single row platform settings
    const { data: existing } = await supabase.from('platform_settings').select('id');

    let error;
    const payload = {
      platform_fee: parseFloat(newSettings.platform_fee),
      fixed_fee: parseFloat(newSettings.fixed_fee),
      global_banner: newSettings.global_banner,
      enable_banner: newSettings.enable_banner,
      sender_email: newSettings.sender_email,
      updated_at: new Date().toISOString()
    };

    if (existing && existing.length > 0) {
      const { error: err } = await supabase.from('platform_settings').update(payload).eq('id', existing[0].id);
      error = err;
    } else {
      const { error: err } = await supabase.from('platform_settings').insert([payload]);
      error = err;
    }

    if (!error) {
      setSuccessMsg("Settings updated successfully and applied live!");
      setTimeout(() => setSuccessMsg(""), 4000);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-[#0F172A]">Platform Settings</h2>
          <p className="text-sm text-slate-500 mt-1">Configure global platform variables and security.</p>
        </div>
        {successMsg && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> {successMsg}
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6 rounded-3xl border-slate-200 shadow-sm bg-white border">
          <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-[#111111] flex items-center justify-center">
              <Percent className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-lg text-[#0F172A]">Fees & Commission</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 mb-1.5 block">Platform Fee (%)</label>
              <input
                type="number"
                value={platformSettings.platform_fee}
                onChange={e => setPlatformSettings({...platformSettings, platform_fee: e.target.value})}
                className="w-full h-12 px-4 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 bg-slate-50 outline-none focus:border-[#111111]"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 mb-1.5 block">Fixed Transaction Fee (₹)</label>
              <input
                type="number"
                value={platformSettings.fixed_fee}
                onChange={e => setPlatformSettings({...platformSettings, fixed_fee: e.target.value})}
                className="w-full h-12 px-4 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 bg-slate-50 outline-none focus:border-[#111111]"
              />
            </div>
            <Button disabled={loading} onClick={() => saveSettings({})} className="w-full bg-slate-900 text-white font-bold rounded-xl mt-2 h-12 hover:bg-slate-800">
              {loading ? "Saving Changes..." : "Save Financials & Apply Live"}
            </Button>
          </div>
        </Card>

        <Card className="p-6 rounded-3xl border-slate-200 shadow-sm bg-white border">
          <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
              <Bell className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-lg text-[#0F172A]">Global Dashboard Banner</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 mb-1.5 block">Banner Message</label>
              <textarea
                value={platformSettings.global_banner}
                onChange={e => setPlatformSettings({...platformSettings, global_banner: e.target.value})}
                placeholder="Show an urgent announcement on all seller dashboards..."
                className="w-full p-4 rounded-xl border border-slate-200 text-sm font-medium text-slate-900 bg-slate-50 outline-none focus:border-[#111111] h-24 resize-none"
              ></textarea>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="enable_banner"
                checked={platformSettings.enable_banner}
                onChange={e => saveSettings({ enable_banner: e.target.checked })}
                className="rounded text-[#111111] w-4 h-4 cursor-pointer"
              />
              <label htmlFor="enable_banner" className="text-sm font-bold text-slate-700 cursor-pointer">Enable Banner Globally</label>
            </div>
            <Button disabled={loading} onClick={() => saveSettings({})} className="w-full bg-slate-900 text-white font-bold rounded-xl h-12 hover:bg-slate-800">
              Update Banner Content
            </Button>
          </div>
        </Card>
        
        <Card className="p-6 rounded-3xl border-slate-200 shadow-sm bg-white border">
          <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
              <Mail className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-lg text-[#0F172A]">Email & Notification Broadcast</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 mb-1.5 block">Sender Verified Address (Resend)</label>
              <input
                type="email"
                value={platformSettings.sender_email}
                onChange={e => setPlatformSettings({...platformSettings, sender_email: e.target.value})}
                className="w-full h-12 px-4 rounded-xl border border-slate-200 text-sm font-medium text-slate-900 bg-slate-50 outline-none focus:border-[#111111]"
              />
            </div>
            <Button disabled={loading} onClick={() => saveSettings({})} className="w-full bg-slate-900 text-white font-bold rounded-xl mt-2 h-12 hover:bg-slate-800">
              Save Sender Address
            </Button>
          </div>
        </Card>

        <Card className="p-6 rounded-3xl border-slate-200 shadow-sm bg-white border">
          <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-lg text-[#0F172A]">Security Controls</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 mb-1.5 block">Master Admin Authorized Email</label>
              <input type="email" defaultValue="admin@zoopcart.com" disabled className="w-full h-12 px-4 rounded-xl border border-slate-200 text-sm font-bold text-slate-400 bg-slate-100 cursor-not-allowed outline-none" />
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div className="text-xs font-bold text-slate-500 uppercase">Current Access Mode</div>
              <div className="text-sm font-bold text-slate-800 mt-1">Master Cookie Key Authentication</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
