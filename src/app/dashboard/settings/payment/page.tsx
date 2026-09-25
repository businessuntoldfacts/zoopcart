"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, CheckCircle2, Lock, QrCode } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

import { useDashboardData } from "@/lib/useDashboardData";

export default function PaymentSettingsPage() {
  const { business: cachedBusiness, loading } = useDashboardData();
  const [method, setMethod] = useState("upi");
  const [upiData, setUpiData] = useState({ id: "", name: "", qr: "" });
  const [upiEnabled, setUpiEnabled] = useState(true);
  const [codEnabled, setCodEnabled] = useState(true);
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadingQr, setUploadingQr] = useState(false);

  useEffect(() => {
    if (cachedBusiness) {
      setBusinessId(cachedBusiness.id);
      
      let upi = { id: "", name: "", qr: "" };
      let cod = true;
      let upiOn = true;

      try {
        let settings: any = {};
        if (cachedBusiness.instagram_profile_url && cachedBusiness.instagram_profile_url.startsWith('{')) {
          settings = JSON.parse(cachedBusiness.instagram_profile_url);
        }

        if (settings.upiId || settings.upiName || settings.upiQr) {
          upi = {
            id: settings.upiId || "",
            name: settings.upiName || "",
            qr: settings.upiQr || ""
          };
        }
        if (settings.codEnabled !== undefined) cod = settings.codEnabled;
        if (settings.upiEnabled !== undefined) upiOn = settings.upiEnabled;
        if (settings.paymentMethod) setMethod(settings.paymentMethod);
      } catch (e) {}
      
      setUpiData(upi);
      setCodEnabled(cod);
      setUpiEnabled(upiOn);
    }
  }, [cachedBusiness]);

  const handleQrUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setUploadingQr(true);
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 500; 
        let scaleSize = 1;
        if (img.width > MAX_WIDTH) {
          scaleSize = MAX_WIDTH / img.width;
        }
        canvas.width = img.width * scaleSize;
        canvas.height = img.height * scaleSize;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.6); 
        setUpiData({...upiData, qr: compressedBase64});
        setUploadingQr(false);
      };
      if (event.target?.result) {
        img.src = event.target.result as string;
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!businessId) return;
    setSaving(true);
    
    const { data: currentData } = await supabase.from('businesses').select('instagram_profile_url').eq('id', businessId).single();
    let extraSettings: any = {};
    try {
      if (currentData?.instagram_profile_url && currentData.instagram_profile_url.startsWith('{')) {
        extraSettings = JSON.parse(currentData.instagram_profile_url);
      } else if (currentData?.instagram_profile_url) {
        extraSettings = { theme: currentData.instagram_profile_url };
      }
    } catch (e) {}

    const newExtraSettings = {
      ...extraSettings,
      paymentMethod: method,
      upiId: upiData.id,
      upiName: upiData.name,
      upiQr: upiData.qr,
      codEnabled: codEnabled,
      upiEnabled: upiEnabled
    };
    
    const { error } = await supabase.from('businesses').update({
      instagram_profile_url: JSON.stringify(newExtraSettings)
    }).eq('id', businessId);
    
    if (error) {
      alert("Error saving: " + error.message);
    } else {
      alert("Payment details saved successfully!");
    }
    setSaving(false);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12 pt-4 px-4">
      <div className="flex items-center justify-between">
        <Link href="/dashboard/settings" className="flex items-center text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1" /> Settings
        </Link>
        <Button onClick={handleSave} disabled={saving} variant="primary" className="rounded-xl px-6 bg-[#111111] hover:bg-[#111111] border-none shadow-md font-bold text-white">
          {saving ? "Saving..." : "Save"}
        </Button>
      </div>
      
      <div className="text-center md:text-left mb-8">
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Payment Setup</h2>
        <p className="text-slate-500 font-medium mt-1">Configure how your customers pay you.</p>
      </div>

      <div className="space-y-6">
        <div className="bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-extrabold text-slate-900 block">Cash on Delivery (COD)</label>
              <p className="text-xs text-slate-500 font-medium">Allow customers to pay when they receive the order.</p>
            </div>
            <button
              onClick={() => setCodEnabled(!codEnabled)}
              className={`w-12 h-6 rounded-full transition-colors relative ${codEnabled ? 'bg-green-500' : 'bg-slate-200'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${codEnabled ? 'left-7' : 'left-1'}`} />
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-extrabold text-slate-900 block">UPI / Online Payment</label>
              <p className="text-xs text-slate-500 font-medium">Accept instant payments via any UPI app (GPay, PhonePe, etc.)</p>
            </div>
            <button
              onClick={() => setUpiEnabled(!upiEnabled)}
              className={`w-12 h-6 rounded-full transition-colors relative ${upiEnabled ? 'bg-green-500' : 'bg-slate-200'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${upiEnabled ? 'left-7' : 'left-1'}`} />
            </button>
          </div>

          {upiEnabled && (
            <div className="space-y-6 pt-4 border-t border-slate-100 animate-in fade-in duration-300">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Choose Method</label>
                <div className="flex p-1 bg-slate-50 rounded-xl border border-slate-100 relative">
                  <button
                    className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${method === 'upi' ? 'bg-white shadow-sm text-slate-900 border border-slate-200' : 'text-slate-500'}`}
                    onClick={() => setMethod('upi')}
                  >
                    Direct UPI
                  </button>
                  <button
                    className={`flex-1 flex items-center justify-center gap-1 py-2.5 text-sm font-bold rounded-lg transition-all text-slate-300 cursor-not-allowed`}
                    disabled
                  >
                    Razorpay <Lock className="w-3 h-3" />
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="relative border border-dashed border-slate-300 rounded-xl overflow-hidden flex flex-col items-center justify-center hover:bg-slate-50 transition-colors bg-slate-50/50">
                  {upiData.qr ? (
                    <img src={upiData.qr} alt="UPI QR" className="w-full max-w-[200px] object-contain p-4" />
                  ) : (
                    <div className="p-8 flex flex-col items-center">
                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center mb-2 shadow-sm">
                        <QrCode className="w-6 h-6 text-slate-400" />
                      </div>
                      <span className="text-sm font-bold text-slate-900">Upload UPI QR Screenshot</span>
                    </div>
                  )}
                  <Input type="file" accept="image/*" onChange={handleQrUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                  {uploadingQr && (
                    <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-20">
                      <Loader2 className="w-6 h-6 text-slate-900 animate-spin" />
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-bold text-slate-900 mb-1.5 block">UPI ID <span className="text-red-500">*</span></label>
                    <Input placeholder="example@okaxis" value={upiData.id} onChange={(e: any) => setUpiData({...upiData, id: e.target.value})} className="bg-slate-50 border-slate-200 h-12 rounded-xl text-slate-900 font-medium" />
                  </div>

                  <div>
                    <label className="text-sm font-bold text-slate-900 mb-1.5 block">Payee Name <span className="text-red-500">*</span></label>
                    <Input placeholder="Your Name" value={upiData.name} onChange={(e: any) => setUpiData({...upiData, name: e.target.value})} className="bg-slate-50 border-slate-200 h-12 rounded-xl text-slate-900 font-medium" />
                  </div>
                </div>
              </div>

              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <p className="text-xs text-emerald-800 font-medium leading-relaxed">
                  Customers will see your QR code and UPI ID at checkout. They will upload a screenshot of the payment which you can verify from your orders dashboard.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}



