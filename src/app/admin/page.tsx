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
    activeStores: 0,
    todayOrders: 0,
    todayRevenue: 0,
    chartData: [] as number[]
  });

  const [loading, setLoading] = useState(true);

  const loadStats = async () => {
    const { data: businesses } = await supabase.from('businesses').select('id, status, created_at');
    const { data: orders } = await supabase.from('orders').select('*, products(price)');

    let vol = 0;
    let ordCount = 0;
    let tOrd = 0;
    let tRev = 0;
    const today = new Date().toDateString();

    // Chart logic: Last 7 days
    const last7Days = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toDateString();
    }).reverse();

    const dailyData = new Array(7).fill(0);

    if (orders) {
      orders.forEach(o => {
         const isRealOrder = !['store_view', 'product_view', 'review', 'platform_review'].includes(o.status);
         if (isRealOrder) {
           ordCount++;
           const orderDate = new Date(o.created_at).toDateString();
           const orderVal = o.budget || (o.products?.price * (o.quantity || 1)) || 0;

           vol += orderVal;

           if (orderDate === today) {
             tOrd++;
             tRev += orderVal;
           }

           const dayIndex = last7Days.indexOf(orderDate);
           if (dayIndex !== -1) {
             dailyData[dayIndex]++;
           }
         }
      });
    }

    setStats({
      stores: businesses ? businesses.length : 0,
      orders: ordCount,
      volume: vol,
      activeStores: businesses ? businesses.filter(b => b.status !== 'suspended').length : 0,
      todayOrders: tOrd,
      todayRevenue: tRev,
      chartData: dailyData
    });
    setLoading(false);
  };

  useEffect(() => {
    loadStats();

    // REALTIME: Listen for new orders or business signups
    const channel = supabase.channel('admin-stats')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => loadStats())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'businesses' }, () => loadStats())
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
        <span className="ml-3 font-bold text-slate-500">Syncing Platform Data...</span>
      </div>
    );
  }

  // Simple SVG Path generator for chart
  const maxVal = Math.max(...stats.chartData, 5);
  const chartPoints = stats.chartData.map((val, i) => `${i * 15},${80 - (val / maxVal * 60)}`).join(' ');

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-[#0F172A]">Platform Overview</h2>
          <p className="text-sm text-slate-500 mt-1">Real-time metrics for the Zoopcart ecosystem.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex flex-col items-end">
             <span className="text-[10px] font-bold text-slate-400 uppercase">Today&apos;s Revenue</span>
             <span className="text-sm font-black text-green-600">₹{stats.todayRevenue.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-xl text-sm font-bold border border-green-100">
            <Activity className="w-4 h-4 animate-pulse" /> Live
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white border-slate-200 shadow-sm rounded-2xl p-5 border group hover:border-slate-900 transition-all">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="text-2xl font-extrabold text-[#0F172A]">{stats.stores}</div>
              <div className="text-[11px] font-bold text-slate-400 uppercase mt-1">Total Stores</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-slate-50 text-[#111111] flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-colors">
              <Store className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="bg-white border-slate-200 shadow-sm rounded-2xl p-5 border group hover:border-slate-900 transition-all">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="text-2xl font-extrabold text-[#0F172A]">{stats.orders}</div>
              <div className="text-[11px] font-bold text-slate-400 uppercase mt-1">Total Orders</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-slate-50 text-[#111111] flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-colors">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="bg-white border-slate-200 shadow-sm rounded-2xl p-5 border group hover:border-green-600 transition-all">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="text-2xl font-extrabold text-[#0F172A]">₹{stats.volume.toLocaleString()}</div>
              <div className="text-[11px] font-bold text-slate-400 uppercase mt-1">Estimated GMV</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center group-hover:bg-green-600 group-hover:text-white transition-colors">
              <IndianRupee className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="bg-white border-slate-200 shadow-sm rounded-2xl p-5 border group hover:border-orange-600 transition-all">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="text-2xl font-extrabold text-[#0F172A]">{stats.activeStores}</div>
              <div className="text-[11px] font-bold text-slate-400 uppercase mt-1">Active Sellers</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center group-hover:bg-orange-600 group-hover:text-white transition-colors">
              <Users className="w-5 h-5" />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-white border-slate-200 shadow-sm rounded-2xl p-6 border h-80 flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-bold text-[#0F172A]">Order Growth</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Last 7 Days Activity</p>
              </div>
              <div className="text-right">
                <div className="text-xl font-black text-slate-900">{stats.todayOrders}</div>
                <div className="text-[9px] font-bold text-slate-400 uppercase">New Today</div>
              </div>
            </div>
            <div className="flex-1 relative flex items-end px-2">
              <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 90 80">
                <polyline
                  fill="none"
                  stroke="#111111"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={chartPoints}
                />
                {/* Dots on points */}
                {stats.chartData.map((val, i) => (
                  <circle
                    key={i}
                    cx={i * 15}
                    cy={80 - (val / maxVal * 60)}
                    r="3"
                    fill="#111111"
                  />
                ))}
              </svg>
            </div>
            <div className="flex justify-between mt-4 px-1">
               {[...Array(7)].map((_, i) => (
                 <span key={i} className="text-[9px] font-bold text-slate-400 uppercase">Day {i+1}</span>
               ))}
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
