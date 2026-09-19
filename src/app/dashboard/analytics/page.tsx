"use client";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Users, Eye, TrendingUp, Percent, Share2, ShoppingBag } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";

import { useDashboardData } from "@/lib/useDashboardData";

export default function AnalyticsPage() {
  const { business, orders: cachedOrders, loading } = useDashboardData();
  const [stats, setStats] = useState({ totalOrders: 0, storeViews: 0, productViews: 0, conversionRate: "0.0" });
  const [businessSlug, setBusinessSlug] = useState("");

  useEffect(() => {
    if (business) setBusinessSlug(business.username);
    if (cachedOrders) {
      const realOrders = cachedOrders.filter(o => !['store_view', 'product_view', 'review', 'platform_review'].includes(o.status));
      const storeViews = cachedOrders.filter(o => o.status === 'store_view').length;
      const productViews = cachedOrders.filter(o => o.status === 'product_view').length;
      const totalOrdersCount = realOrders.length;
      const conversionRate = storeViews > 0 ? ((totalOrdersCount / storeViews) * 100).toFixed(1) : "0.0";
      setStats({ totalOrders: totalOrdersCount, storeViews, productViews, conversionRate });
    }
  }, [business, cachedOrders]);

  if (loading) return <div className="p-4 text-slate-400 font-medium">Loading analytics...</div>;

  return (
    <div className="space-y-6 pb-20">
      <h2 className="text-2xl font-extrabold text-[#0F172A]">Store Performance</h2>
      
      <div className="space-y-4">
        {/* Visitors */}
        <Card className="bg-white border-slate-100 shadow-sm rounded-2xl p-6 border flex items-center justify-between">
          <div>
            <div className="text-sm font-bold text-slate-500 mb-2">Total Store Visitors</div>
            <div className="text-2xl font-extrabold text-[#0F172A]">{stats.storeViews}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center"><Users className="w-5 h-5 text-blue-500" /></div>
        </Card>

        {/* Views */}
        <Card className="bg-white border-slate-100 shadow-sm rounded-2xl p-6 border flex items-center justify-between">
          <div>
            <div className="text-sm font-bold text-slate-500 mb-2">Product Views</div>
            <div className="text-2xl font-extrabold text-[#0F172A]">{stats.productViews}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center"><Eye className="w-5 h-5 text-indigo-500" /></div>
        </Card>

        {/* Orders */}
        <Card className="bg-white border-slate-100 shadow-sm rounded-2xl p-6 border flex items-center justify-between">
          <div>
            <div className="text-sm font-bold text-slate-500 mb-2">Orders Received</div>
            <div className="text-2xl font-extrabold text-[#0F172A]">{stats.totalOrders}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center"><ShoppingBag className="w-5 h-5 text-purple-500" /></div>
        </Card>

        {/* Conversion Rate */}
        <Card className="bg-white border-slate-100 shadow-sm rounded-2xl p-6 border flex items-center justify-between">
          <div>
            <div className="text-sm font-bold text-slate-500 mb-2">Conversion Rate</div>
            <div className="text-2xl font-extrabold text-[#0F172A]">{stats.conversionRate}%</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center"><Percent className="w-5 h-5 text-emerald-500" /></div>
        </Card>
      </div>

      {stats.storeViews === 0 && stats.totalOrders === 0 && (
        <Card className="bg-white border-slate-100 shadow-sm rounded-2xl p-8 border flex flex-col items-center justify-center text-center mt-8">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
            <Share2 className="w-8 h-8 text-blue-500" />
          </div>
          <h3 className="text-lg font-extrabold text-[#0F172A] mb-2">Not enough data yet.</h3>
          <p className="text-slate-500 mb-6 text-sm font-medium">Share your store link with customers to start receiving orders.</p>
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
      )}
    </div>
  );
}

