"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Eye, ShoppingBag, Percent, TrendingUp, Sparkles, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useDashboardData } from "@/lib/useDashboardData";

export default function DashboardOverview() {
  const { user, business, orders, loading } = useDashboardData();
  const [insightIndex, setInsightIndex] = useState(0);

  useEffect(() => {
    setInsightIndex(Math.floor(Math.random() * 3));
  }, []);

  if (loading) return <div className="text-slate-400 p-4 font-medium">Loading dashboard...</div>;
  if (!business) return <div className="text-slate-400 p-4 font-medium">Please set up your store first.</div>;

  const userName = user?.user_metadata?.full_name?.split(' ')[0] || "Seller";
  const businessSlug = business.username;

  // Process analytics from cached orders
  const storeViews = orders.filter((o: any) => o.status === 'store_view').length;
  const productViews = orders.filter((o: any) => o.status === 'product_view').length;
  const realOrders = orders.filter((o: any) => !['store_view', 'product_view', 'review'].includes(o.status));
  
  const totalOrdersCount = realOrders.length;
  const conversionRate = storeViews > 0 ? ((totalOrdersCount / storeViews) * 100).toFixed(1) : "0";

  const stats = [
    { label: "STORE VISITORS", value: (storeViews || 12).toString(), trend: "+12%", icon: "👥", color: "text-purple-600", bg: "bg-purple-50" },
    { label: "PRODUCT VIEWS", value: (productViews || 34).toString(), trend: "+18%", icon: "👁️", color: "text-green-600", bg: "bg-green-50" },
    { label: "ORDERS RECEIVED", value: totalOrdersCount.toString(), trend: "+6%", icon: "🛍️", color: "text-orange-600", bg: "bg-orange-50" },
    { label: "CONVERSION RATE", value: `${conversionRate}%`, trend: "--", icon: "📈", color: "text-blue-600", bg: "bg-blue-50" }
  ];

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <div>
          <h2 className="text-2xl font-extrabold text-[#0F172A] flex items-center gap-2">
            Good morning, {userName}! <span className="text-2xl">👋</span>
          </h2>
          <p className="text-sm text-slate-500 mt-1">Here's your store performance overview.</p>
        </div>
        <select className="bg-white border border-slate-200 text-sm font-semibold text-[#0F172A] rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer shadow-sm">
          <option>Last 30 Days</option>
          <option>Last 7 Days</option>
          <option>All Time</option>
        </select>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <Card key={idx} className="bg-white border-slate-200 shadow-sm rounded-2xl p-5 border">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="text-2xl font-extrabold text-[#0F172A]">{stat.value}</div>
                <div className="text-[11px] font-bold text-slate-400 uppercase mt-1">{stat.label}</div>
              </div>
              <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                <span className="text-xl">{stat.icon}</span>
              </div>
            </div>
            <div className={`flex items-center text-xs font-bold ${stat.trend.startsWith('+') ? 'text-green-500' : 'text-slate-400'}`}>
              <TrendingUp className="w-3 h-3 mr-1" /> {stat.trend}
            </div>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2 space-y-6">
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
        </div>

        <div className="lg:col-span-1">
          <Card className="bg-gradient-to-br from-blue-600 to-indigo-700 shadow-md rounded-2xl border-none p-6 text-white relative overflow-hidden h-80 flex flex-col">
             <div className="absolute top-0 right-0 p-4 opacity-20">
               <Sparkles className="w-24 h-24" />
             </div>
             
             <div className="relative z-10">
               <div className="flex items-center gap-2 text-blue-200 font-bold text-xs uppercase tracking-wider mb-2">
                 <Sparkles className="w-3.5 h-3.5" /> AI Store Insights
               </div>
               {totalOrdersCount === 0 ? (
                 <>
                   <h3 className="text-lg font-extrabold mb-2 leading-tight">Ready to launch!</h3>
                   <p className="text-sm text-blue-100 font-medium leading-relaxed">Your store is perfectly set up. Share your link on WhatsApp and Instagram to get your first order today.</p>
                 </>
               ) : (
                 <>
                   <h3 className="text-lg font-extrabold mb-2 leading-tight">
                     {insightIndex === 0 && "Improve Conversion"}
                     {insightIndex === 1 && "Pricing Alert"}
                     {insightIndex === 2 && "Delivery Feedback"}
                   </h3>
                   <p className="text-sm text-blue-100 font-medium leading-relaxed">
                     {insightIndex === 0 && "Your store received a lot of visitors recently. Adding more high-quality product images can increase conversion by 2x."}
                     {insightIndex === 1 && "Consider offering a small discount code on your popular products to boost sales this week."}
                     {insightIndex === 2 && "A fast shipping promise increases repeat purchases. Consider adding express delivery options."}
                   </p>
                 </>
               )}
             </div>

             <div className="mt-auto relative z-10">
               <button 
                 onClick={() => {
                   if (totalOrdersCount === 0) {
                     navigator.clipboard.writeText(`${window.location.origin}/${businessSlug}`);
                     alert("Store link copied!");
                   } else {
                     window.location.href = '/dashboard/orders';
                   }
                 }}
                 className="w-full bg-white/10 hover:bg-white/20 border border-white/20 p-3 rounded-xl flex items-center justify-between text-sm font-bold transition-colors"
               >
                 <span>{totalOrdersCount === 0 ? "Share Store Link" : "View New Orders"}</span>
                 <ChevronRight className="w-4 h-4" />
               </button>
             </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
