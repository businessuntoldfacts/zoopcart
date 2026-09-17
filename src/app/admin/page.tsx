"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Users, ShoppingBag, Store, TrendingUp, Activity, IndianRupee } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    stores: 0,
    orders: 0,
    volume: 0,
    activeStores: 0
  });

  useEffect(() => {
    async function loadStats() {
      const { data: businesses } = await supabase.from('businesses').select('id');
      const { data: orders } = await supabase.from('orders').select('*, products(price)');
      
      let vol = 0;
      if (orders) {
        orders.forEach(o => {
           if (o.products && o.products.price) {
             vol += o.products.price;
           }
        });
      }

      setStats({
        stores: businesses?.length || 0,
        orders: orders?.length || 0,
        volume: vol,
        activeStores: businesses?.length || 0 // Mock logic
      });
    }
    loadStats();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <div>
          <h2 className="text-2xl font-extrabold text-[#0F172A]">Platform Overview</h2>
          <p className="text-sm text-slate-500 mt-1">Monitor Zypcart's total growth and performance.</p>
        </div>
        <select className="bg-white border border-slate-200 text-sm font-semibold text-[#0F172A] rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500/20 shadow-sm cursor-pointer">
          <option>Last 30 Days</option>
          <option>Last 7 Days</option>
          <option>All Time</option>
        </select>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white border-slate-200 shadow-sm rounded-2xl p-5 border">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="text-2xl font-extrabold text-[#0F172A]">{stats.stores}</div>
              <div className="text-[11px] font-bold text-slate-400 uppercase mt-1">Total Stores</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
              <Store className="w-5 h-5 text-blue-500" />
            </div>
          </div>
          <div className="flex items-center text-xs font-bold text-green-600">
            <TrendingUp className="w-3 h-3 mr-1" /> +12 this week
          </div>
        </Card>

        <Card className="bg-white border-slate-200 shadow-sm rounded-2xl p-5 border">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="text-2xl font-extrabold text-[#0F172A]">{stats.orders}</div>
              <div className="text-[11px] font-bold text-slate-400 uppercase mt-1">Total Orders</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-orange-500" />
            </div>
          </div>
          <div className="flex items-center text-xs font-bold text-green-600">
            <TrendingUp className="w-3 h-3 mr-1" /> +154 this week
          </div>
        </Card>

        <Card className="bg-white border-slate-200 shadow-sm rounded-2xl p-5 border">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="text-2xl font-extrabold text-[#0F172A]">₹{stats.volume.toLocaleString()}</div>
              <div className="text-[11px] font-bold text-slate-400 uppercase mt-1">GMV (Volume)</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
              <IndianRupee className="w-5 h-5 text-green-500" />
            </div>
          </div>
          <div className="flex items-center text-xs font-bold text-green-600">
            <TrendingUp className="w-3 h-3 mr-1" /> +8% vs last month
          </div>
        </Card>

        <Card className="bg-white border-slate-200 shadow-sm rounded-2xl p-5 border">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="text-2xl font-extrabold text-[#0F172A]">{stats.activeStores}</div>
              <div className="text-[11px] font-bold text-slate-400 uppercase mt-1">Active Sellers</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
              <Activity className="w-5 h-5 text-purple-500" />
            </div>
          </div>
          <div className="flex items-center text-xs font-bold text-slate-400">
            Across 12 cities
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-white border-slate-200 shadow-sm rounded-2xl p-6 border h-80 flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-[#0F172A]">Platform Growth (Orders)</h3>
            </div>
            <div className="flex-1 relative flex items-end">
              {/* Fake SVG Chart representing growth */}
              <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
                <path d="M0 40 L10 38 L20 35 L30 30 L40 25 L50 22 L60 18 L70 12 L80 15 L90 5 L100 2 L100 40 Z" fill="url(#admin-blue-gradient)" opacity="0.1"/>
                <path d="M0 40 L10 38 L20 35 L30 30 L40 25 L50 22 L60 18 L70 12 L80 15 L90 5 L100 2" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <defs>
                  <linearGradient id="admin-blue-gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563EB" />
                    <stop offset="100%" stopColor="#ffffff" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="bg-white border-slate-200 shadow-sm rounded-2xl border h-80 flex flex-col p-6">
             <h3 className="font-bold text-[#0F172A] mb-4">Quick Actions</h3>
             <div className="space-y-3">
               <button className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 p-3 rounded-xl flex items-center justify-between text-sm font-bold text-[#0F172A] transition-colors">
                 <span>Suspend a Store</span>
                 <span className="text-slate-400">→</span>
               </button>
               <button className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 p-3 rounded-xl flex items-center justify-between text-sm font-bold text-[#0F172A] transition-colors">
                 <span>Generate Monthly Report</span>
                 <span className="text-slate-400">→</span>
               </button>
               <button className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 p-3 rounded-xl flex items-center justify-between text-sm font-bold text-[#0F172A] transition-colors">
                 <span>Manage Categories</span>
                 <span className="text-slate-400">→</span>
               </button>
             </div>
             
             <div className="mt-auto bg-green-50 p-4 rounded-xl border border-green-100">
               <div className="text-xs font-bold text-green-800 uppercase tracking-wider mb-1">System Status</div>
               <div className="flex items-center gap-2 text-sm font-medium text-green-700">
                 <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div> All systems operational
               </div>
             </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
