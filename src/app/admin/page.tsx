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

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      const { data: businesses, error: bizError } = await supabase.from('businesses').select('id, status');
      const { data: orders, error: ordError } = await supabase.from('orders').select('*, products(price)');
      
      let vol = 0;
      let ordCount = 0;
      if (orders) {
        orders.forEach(o => {
           if (o.status !== 'platform_review') {
             ordCount++;
             if (o.budget) {
               vol += o.budget;
             } else if (o.products && o.products.price) {
               vol += (o.products.price * (o.quantity || 1));
             }
           }
        });
      }

      setStats({
        stores: businesses ? businesses.length : 0,
        orders: ordCount,
        volume: vol,
        activeStores: businesses ? businesses.filter(b => b.status !== 'suspended').length : 0
      });
      setLoading(false);
    }
    loadStats();
  }, []);

  if (loading) {
    return <div className="text-slate-500 font-bold p-8">Loading Platform Stats...</div>;
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-[#0F172A]">Platform Overview</h2>
          <p className="text-sm text-slate-500 mt-1">Real-time metrics for the Zoopcart ecosystem.</p>
        </div>
        <div className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-xl text-sm font-bold border border-green-100">
          <Activity className="w-4 h-4" /> Live Data
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white border-slate-200 shadow-sm rounded-2xl p-5 border">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="text-2xl font-extrabold text-[#0F172A]">{stats.stores}</div>
              <div className="text-[11px] font-bold text-slate-400 uppercase mt-1">Total Stores</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Store className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="bg-white border-slate-200 shadow-sm rounded-2xl p-5 border">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="text-2xl font-extrabold text-[#0F172A]">{stats.orders}</div>
              <div className="text-[11px] font-bold text-slate-400 uppercase mt-1">Total Orders</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="bg-white border-slate-200 shadow-sm rounded-2xl p-5 border">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="text-2xl font-extrabold text-[#0F172A]">₹{stats.volume.toLocaleString()}</div>
              <div className="text-[11px] font-bold text-slate-400 uppercase mt-1">Estimated GMV</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
              <IndianRupee className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="bg-white border-slate-200 shadow-sm rounded-2xl p-5 border">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="text-2xl font-extrabold text-[#0F172A]">{stats.activeStores}</div>
              <div className="text-[11px] font-bold text-slate-400 uppercase mt-1">Active Sellers</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
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
              <svg className="w-full h-full text-blue-100" preserveAspectRatio="none" viewBox="0 0 100 100">
                <path d="M0,100 L0,80 C20,80 30,90 50,70 C70,50 80,60 100,20 L100,100 Z" fill="currentColor"></path>
                <path d="M0,80 C20,80 30,90 50,70 C70,50 80,60 100,20" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-500"></path>
              </svg>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="bg-white border-slate-200 shadow-sm rounded-2xl border h-80 flex flex-col p-6">
             <h3 className="font-bold text-[#0F172A] mb-4">Quick Actions</h3>
             <div className="space-y-3">
               <button onClick={() => window.location.href='/admin/sellers'} className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 p-3 rounded-xl flex items-center justify-between text-sm font-bold text-[#0F172A] transition-colors">
                 <span>Manage Stores</span>
                 <span className="text-slate-400">→</span>
               </button>
               <button onClick={() => window.location.href='/admin/orders'} className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 p-3 rounded-xl flex items-center justify-between text-sm font-bold text-[#0F172A] transition-colors">
                 <span>View Recent Orders</span>
                 <span className="text-slate-400">→</span>
               </button>
               <button onClick={() => window.location.href='/admin/settings'} className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 p-3 rounded-xl flex items-center justify-between text-sm font-bold text-[#0F172A] transition-colors">
                 <span>Platform Configuration</span>
                 <span className="text-slate-400">→</span>
               </button>
             </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
