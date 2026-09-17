"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, CheckCircle2, Lock, QrCode } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function PaymentSettingsPage() {
  const [method, setMethod] = useState("upi");
  const [upiData, setUpiData] = useState({
    id: "9305293501@ybl",
    name: "Faisal",
    qr: ""
  });
  const [saving, setSaving] = useState(false);
  const [businessName, setBusinessName] = useState("");

  useEffect(() => {
    async function fetchName() {
       const { data: { user } } = await supabase.auth.getUser();
       if (user) {
         const { data } = await supabase.from('businesses').select('business_name').eq('user_id', user.id).single();
         if (data?.business_name) setBusinessName(data.business_name);
       }
    }
    fetchName();
  }, []);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      alert("Payment details saved successfully!");
    }, 500);
  };

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
      
      <div className="text-center md:text-left mb-8">
        <h2 className="text-3xl font-extrabold text-slate-900">Payment Details</h2>
      </div>

      <div className="space-y-6">
        <h3 className="text-xs font-bold text-slate-500 tracking-wider uppercase ml-1">How you get paid</h3>
        
        <div className="bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm space-y-6">
          <div>
            <label className="text-sm font-bold text-slate-900 mb-2 block">Method</label>
            <div className="flex p-1 bg-slate-50 rounded-xl border border-slate-100 relative">
              <button 
                className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${method === 'upi' ? 'bg-white shadow-sm text-slate-900 border border-slate-200' : 'text-slate-500'}`}
                onClick={() => setMethod('upi')}
              >
                UPI
              </button>
              <button 
                className={`flex-1 flex items-center justify-center gap-1 py-2.5 text-sm font-bold rounded-lg transition-all ${method === 'razorpay' ? 'bg-white shadow-sm text-slate-900 border border-slate-200' : 'text-slate-400'}`}
              >
                Razorpay <Lock className="w-3 h-3" />
              </button>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-slate-700 bg-emerald-50/50 p-4 rounded-xl border border-emerald-100">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span className="font-medium">Live now: <strong>UPI</strong></span>
          </div>
          
          <p className="text-sm text-slate-600 font-medium leading-relaxed">
            Customers pay you directly by UPI and you confirm the order once the money lands.
          </p>
        </div>

        <h3 className="text-xs font-bold text-slate-500 tracking-wider uppercase ml-1 mt-8">UPI</h3>
        
        <div className="bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm space-y-6">
          <div className="border border-dashed border-slate-300 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors">
            <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center mb-2">
              <QrCode className="w-6 h-6 text-slate-600" />
            </div>
            <span className="text-sm font-bold text-slate-900">Upload your UPI QR</span>
          </div>
          <p className="text-xs text-slate-500">
            Screenshot the QR from your bank or payment app and we'll fill in the details below.
          </p>
          
          <div>
            <label className="text-sm font-bold text-slate-900 mb-1.5 block">UPI ID <span className="text-pink-500">*</span></label>
            <Input value={upiData.id} onChange={e => setUpiData({...upiData, id: e.target.value})} className="bg-slate-50 border-slate-200 h-12 rounded-xl text-slate-900" />
          </div>
          
          <div>
            <label className="text-sm font-bold text-slate-900 mb-1.5 block">Payee name <span className="text-pink-500">*</span></label>
            <Input value={businessName || upiData.name} onChange={e => setUpiData({...upiData, name: e.target.value})} className="bg-slate-50 border-slate-200 h-12 rounded-xl text-slate-900" />
            <p className="text-xs text-slate-500 mt-2">Shown in the customer's UPI app. Match your bank account name.</p>
          </div>
          
          <div className="pt-4 border-t border-slate-100">
            <p className="text-xs text-slate-500 font-medium">This is the ID customers send money to at checkout.</p>
          </div>
        </div>

      </div>
    </div>
  );
}
