"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings, Percent, Bell, Shield, Mail } from "lucide-react";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6 pb-12">
      <div>
        <h2 className="text-2xl font-extrabold text-[#0F172A]">Platform Settings</h2>
        <p className="text-sm text-slate-500 mt-1">Configure global platform variables and security.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6 rounded-3xl border-slate-100 shadow-sm bg-white">
          <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Percent className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-lg text-[#0F172A]">Fees & Commission</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 mb-1.5 block">Platform Fee (%)</label>
              <input type="number" defaultValue="2" className="w-full h-12 px-4 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 bg-slate-50 outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 mb-1.5 block">Fixed Transaction Fee (₹)</label>
              <input type="number" defaultValue="0" className="w-full h-12 px-4 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 bg-slate-50 outline-none focus:border-blue-500" />
            </div>
            <Button className="w-full bg-slate-900 text-white font-bold rounded-xl mt-2 h-10">Save Financials</Button>
          </div>
        </Card>

        <Card className="p-6 rounded-3xl border-slate-100 shadow-sm bg-white">
          <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
              <Bell className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-lg text-[#0F172A]">Global Announcements</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 mb-1.5 block">Banner Message</label>
              <textarea placeholder="Show a message on all seller dashboards..." className="w-full p-4 rounded-xl border border-slate-200 text-sm font-medium text-slate-900 bg-slate-50 outline-none focus:border-blue-500 h-24 resize-none"></textarea>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="enable_banner" className="rounded text-blue-600 w-4 h-4" />
              <label htmlFor="enable_banner" className="text-sm font-bold text-slate-700">Enable Banner Globally</label>
            </div>
            <Button className="w-full bg-slate-900 text-white font-bold rounded-xl h-10">Publish Announcement</Button>
          </div>
        </Card>
        
        <Card className="p-6 rounded-3xl border-slate-100 shadow-sm bg-white">
          <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
              <Mail className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-lg text-[#0F172A]">Email Configuration</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 mb-1.5 block">Sender Email</label>
              <input type="email" defaultValue="hello@zoopcart.com" className="w-full h-12 px-4 rounded-xl border border-slate-200 text-sm font-medium text-slate-900 bg-slate-50 outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 mb-1.5 block">API Key (Resend)</label>
              <input type="password" placeholder="re_****************" className="w-full h-12 px-4 rounded-xl border border-slate-200 text-sm font-medium text-slate-900 bg-slate-50 outline-none focus:border-blue-500" />
            </div>
            <Button className="w-full bg-slate-900 text-white font-bold rounded-xl mt-2 h-10">Verify Configuration</Button>
          </div>
        </Card>

        <Card className="p-6 rounded-3xl border-slate-100 shadow-sm bg-white">
          <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-lg text-[#0F172A]">Security</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 mb-1.5 block">Admin Access Email</label>
              <input type="email" defaultValue="admin@zoopcart.com" className="w-full h-12 px-4 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 bg-slate-50 outline-none focus:border-blue-500" />
            </div>
            <div className="pt-2">
              <button className="text-red-500 text-sm font-bold hover:text-red-600 underline">Reset Admin Password</button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
