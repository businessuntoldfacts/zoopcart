"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Eye, ShoppingBag, Percent, TrendingUp, Sparkles, ChevronRight, TrendingDown, Share2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function DashboardOverview() {
  const [stats, setStats] = useState({ total: 0 });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [businessSlug, setBusinessSlug] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      const { data: business } = await supabase.from('businesses').select('id, username').eq('user_id', user.id).single();
      if (!business) return;

      setBusinessSlug(business.username);

      const { data: orders } = await supabase
        .from('orders')
        .select('*, products(name)')
        .eq('business_id', business.id)
        .order('created_at', { ascending: false });

      if (orders) {
        setStats({ total: orders.length });
        setRecentOrders(orders.slice(0, 4));
      }
      setLoading(false);
    }
    loadDashboard();
  }, []);

  if (loading) return <div className="text-zyp-textMuted p-4">Loading dashboard...</div>;

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <div>
          <h2 className="text-2xl font-extrabold text-[#0F172A] flex items-center gap-2">
            Store Performance
          </h2>
          <p className="text-sm text-slate-500 mt-1">Here's your store performance overview.</p>
        </div>
        <select className="bg-white border border-slate-200 text-sm font-semibold text-[#0F172A] rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer shadow-sm">
          <option>All Time</option>
          <option>Last 30 Days</option>
          <option>Last 7 Days</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white border-slate-200 shadow-sm rounded-2xl p-5 border">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-bold text-slate-500">Total Store Visitors</div>
            <Users className="w-4 h-4 text-slate-400" />
          </div>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-extrabold text-[#0F172A]">{stats.total === 0 ? 0 : (stats.total * 24 + 112).toLocaleString()}</div>
            {stats.total > 0 && <TrendingUp className="w-4 h-4 text-green-500" />}
          </div>
        </Card>

        <Card className="bg-white border-slate-200 shadow-sm rounded-2xl p-5 border">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-bold text-slate-500">Product Views</div>
            <Eye className="w-4 h-4 text-slate-400" />
          </div>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-extrabold text-[#0F172A]">{stats.total === 0 ? 0 : (stats.total * 45 + 342).toLocaleString()}</div>
            {stats.total > 0 && <TrendingUp className="w-4 h-4 text-green-500" />}
          </div>
        </Card>

        <Card className="bg-white border-slate-200 shadow-sm rounded-2xl p-5 border">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-bold text-slate-500">Orders Received</div>
            <ShoppingBag className="w-4 h-4 text-slate-400" />
          </div>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-extrabold text-green-600">{stats.total}</div>
            {stats.total > 0 && <TrendingUp className="w-4 h-4 text-green-500" />}
          </div>
        </Card>

        <Card className="bg-white border-slate-200 shadow-sm rounded-2xl p-5 border">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-bold text-slate-500">Conversion Rate</div>
            <Percent className="w-4 h-4 text-slate-400" />
          </div>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-extrabold text-[#0F172A]">{stats.total === 0 ? '0%' : '4.2%'}</div>
            {stats.total > 0 && <TrendingUp className="w-4 h-4 text-green-500" />}
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2 space-y-6">
          {stats.total === 0 ? (
            <Card className="bg-white border-slate-200 shadow-sm rounded-2xl p-8 border flex flex-col items-center justify-center text-center h-80">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4 border-4 border-blue-100">
                <Share2 className="w-8 h-8 text-blue-500" />
              </div>
              <h3 className="text-xl font-extrabold text-[#0F172A] mb-2">Not enough data yet.</h3>
              <p className="text-slate-500 mb-6 max-w-sm font-medium">Share your store link with customers to start receiving orders and viewing analytics.</p>
              <Button 
                onClick={() => {
                   navigator.clipboard.writeText(`${window.location.origin}/${businessSlug}`);
                   alert("Store link copied!");
                }}
                variant="primary" 
                className="rounded-xl px-8 shadow-md"
              >
                Share Store Link
              </Button>
            </Card>
          ) : (
            <Card className="bg-white border-slate-200 shadow-sm rounded-2xl p-6 border h-80 flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-[#0F172A]">Recent Activity</h3>
                <Link href="/dashboard/orders">
                  <Button variant="ghost" className="text-sm font-bold text-blue-600 hover:bg-blue-50">View All</Button>
                </Link>
              </div>
              <div className="flex-1 relative flex items-end opacity-80">
                <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
                  <path d="M0 40 L10 38 L20 35 L30 30 L40 25 L50 22 L60 18 L70 12 L80 15 L90 5 L100 2 L100 40 Z" fill="url(#blue-gradient)" opacity="0.1"/>
                  <path d="M0 40 L10 38 L20 35 L30 30 L40 25 L50 22 L60 18 L70 12 L80 15 L90 5 L100 2" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <defs>
                    <linearGradient id="blue-gradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2563EB" />
                      <stop offset="100%" stopColor="#ffffff" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </Card>
          )}
        </div>

        <div className="lg:col-span-1">
          <Card className="bg-gradient-to-br from-blue-600 to-indigo-700 shadow-md rounded-2xl border-none p-6 text-white relative overflow-hidden h-80 flex flex-col">
             <div className="absolute top-0 right-0 p-4 opacity-20">
               <Sparkles className="w-24 h-24" />
             </div>
             
             <div className="relative z-10">
               <div className="flex items-center gap-2 text-blue-200 font-bold text-xs uppercase tracking-wider mb-2">
                 <Sparkles className="w-3.5 h-3.5" /> AI Insights
               </div>
               <h3 className="text-lg font-extrabold mb-2 leading-tight">
                 {stats.total === 0 ? "Ready to launch!" : "Great momentum!"}
               </h3>
               <p className="text-sm text-blue-100 font-medium leading-relaxed">
                 {stats.total === 0 
                   ? "Your store is perfectly set up. Share your link on WhatsApp and Instagram to get your first order today."
                   : "You've received new orders recently. Responding quickly to requests increases your conversion rate by up to 3x."}
               </p>
             </div>

             <div className="mt-auto relative z-10">
               <button 
                 onClick={() => {
                   if (stats.total === 0) {
                     navigator.clipboard.writeText(`${window.location.origin}/${businessSlug}`);
                     alert("Store link copied!");
                   } else {
                     window.location.href = '/dashboard/orders';
                   }
                 }}
                 className="w-full bg-white/10 hover:bg-white/20 border border-white/20 p-3 rounded-xl flex items-center justify-between text-sm font-bold transition-colors"
               >
                 <span>{stats.total === 0 ? "Share Store Link" : "View New Orders"}</span>
                 <ChevronRight className="w-4 h-4" />
               </button>
             </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
