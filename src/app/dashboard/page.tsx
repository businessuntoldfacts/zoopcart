"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Eye, ShoppingBag, Percent, TrendingUp, Sparkles, ChevronRight, TrendingDown } from "lucide-react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function DashboardOverview() {
  const [stats, setStats] = useState({ total: 0 });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("John");

  useEffect(() => {
    async function loadDashboard() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      setUserName(user.user_metadata?.full_name?.split(' ')[0] || "Seller");

      const { data: business } = await supabase.from('businesses').select('id').eq('user_id', user.id).single();
      if (!business) return;

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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <div>
          <h2 className="text-2xl font-extrabold text-zyp-textPrimary flex items-center gap-2">
            Good morning, {userName}! <span className="text-2xl">👋</span>
          </h2>
          <p className="text-sm text-zyp-textMuted mt-1">Here's your store performance overview.</p>
        </div>
        <select className="bg-white border border-zyp-border text-sm font-semibold text-zyp-textPrimary rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-zyp-primary/20 cursor-pointer">
          <option>Last 30 Days</option>
          <option>Last 7 Days</option>
          <option>All Time</option>
        </select>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Visitors (Mock) */}
        <Card className="bg-white border-zyp-border shadow-sm rounded-2xl p-5 border">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="text-2xl font-extrabold text-zyp-textPrimary">1,240</div>
              <div className="text-[11px] font-bold text-zyp-textMuted uppercase mt-1">Store Visitors</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
              <Users className="w-5 h-5 text-purple-500" />
            </div>
          </div>
          <div className="flex items-center text-xs font-bold text-zyp-success">
            <TrendingUp className="w-3 h-3 mr-1" /> 12%
          </div>
        </Card>

        {/* Product Views (Mock) */}
        <Card className="bg-white border-zyp-border shadow-sm rounded-2xl p-5 border">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="text-2xl font-extrabold text-zyp-textPrimary">3,842</div>
              <div className="text-[11px] font-bold text-zyp-textMuted uppercase mt-1">Product Views</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
              <Eye className="w-5 h-5 text-green-500" />
            </div>
          </div>
          <div className="flex items-center text-xs font-bold text-zyp-success">
            <TrendingUp className="w-3 h-3 mr-1" /> 18%
          </div>
        </Card>

        {/* Orders Received (Actual) */}
        <Card className="bg-white border-zyp-border shadow-sm rounded-2xl p-5 border">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="text-2xl font-extrabold text-zyp-textPrimary">{stats.total}</div>
              <div className="text-[11px] font-bold text-zyp-textMuted uppercase mt-1">Orders Received</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-orange-500" />
            </div>
          </div>
          <div className="flex items-center text-xs font-bold text-zyp-success">
            <TrendingUp className="w-3 h-3 mr-1" /> 6%
          </div>
        </Card>

        {/* Conversion Rate (Mock) */}
        <Card className="bg-white border-zyp-border shadow-sm rounded-2xl p-5 border">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="text-2xl font-extrabold text-zyp-textPrimary">1.45%</div>
              <div className="text-[11px] font-bold text-zyp-textMuted uppercase mt-1">Conversion Rate</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center">
              <Percent className="w-5 h-5 text-pink-500" />
            </div>
          </div>
          <div className="flex items-center text-xs font-bold text-zyp-danger">
            <TrendingDown className="w-3 h-3 mr-1" /> 2%
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Mock Chart Section */}
          <Card className="bg-white border-zyp-border shadow-sm rounded-2xl p-6 border h-80 flex flex-col">
            <div className="flex items-center gap-4 mb-6">
              <h3 className="font-bold text-zyp-textPrimary">Store Visitors & Orders</h3>
              <div className="flex items-center gap-4 text-xs font-semibold text-zyp-textMuted ml-auto">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-zyp-primary"></span> Visitors</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span> Orders</span>
              </div>
            </div>
            <div className="flex-1 relative flex items-end opacity-60">
              {/* Fake SVG Chart representing growth */}
              <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
                <path d="M0 40 L10 35 L20 38 L30 25 L40 28 L50 15 L60 20 L70 10 L80 12 L90 2 L100 5 L100 40 Z" fill="url(#blue-gradient)" opacity="0.2"/>
                <path d="M0 40 L10 35 L20 38 L30 25 L40 28 L50 15 L60 20 L70 10 L80 12 L90 2 L100 5" fill="none" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                
                <path d="M0 40 L10 38 L20 39 L30 32 L40 33 L50 25 L60 28 L70 20 L80 22 L90 15 L100 18 L100 40 Z" fill="url(#green-gradient)" opacity="0.2"/>
                <path d="M0 40 L10 38 L20 39 L30 32 L40 33 L50 25 L60 28 L70 20 L80 22 L90 15 L100 18" fill="none" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                
                <defs>
                  <linearGradient id="blue-gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563EB" />
                    <stop offset="100%" stopColor="#ffffff" />
                  </linearGradient>
                  <linearGradient id="green-gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10B981" />
                    <stop offset="100%" stopColor="#ffffff" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div className="flex justify-between text-[10px] font-bold text-zyp-textMuted mt-4 uppercase tracking-wider">
              <span>1 Sep</span><span>5 Sep</span><span>10 Sep</span><span>15 Sep</span><span>20 Sep</span><span>25 Sep</span><span>30 Sep</span>
            </div>
          </Card>

          {/* AI Insights Card */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-6 shadow-sm flex items-start gap-5">
            <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xl shrink-0 shadow-lg shadow-blue-600/30">
              AI
            </div>
            <div>
              <h3 className="font-extrabold text-blue-900 text-lg mb-2 flex items-center gap-2">
                AI Store Insights <Sparkles className="w-4 h-4 text-yellow-500" />
              </h3>
              <p className="text-blue-800/80 text-sm font-medium leading-relaxed mb-4">
                Your store received 1,240 visitors but only 18 orders, giving you a 1.45% conversion rate. Your traffic is good, but conversion can be improved by adding more product images.
              </p>
              <Button variant="secondary" size="sm" className="bg-white text-blue-600 border-white hover:bg-blue-50 shadow-sm font-bold">
                View AI Suggestions <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>

        {/* Recent Orders List */}
        <div className="lg:col-span-1">
          <Card className="bg-white border-zyp-border shadow-sm rounded-2xl border h-full flex flex-col">
            <div className="p-5 border-b border-zyp-border flex justify-between items-center">
              <h3 className="font-extrabold text-zyp-textPrimary">Recent Orders</h3>
              <Link href="/dashboard/orders" className="text-xs font-bold text-zyp-primary hover:underline">View All</Link>
            </div>
            <div className="flex-1 overflow-auto p-0">
              {recentOrders.length === 0 ? (
                <div className="p-8 text-center text-sm font-medium text-zyp-textMuted">
                  No recent orders.
                </div>
              ) : (
                <div className="divide-y divide-zyp-border">
                  {recentOrders.map(order => (
                    <div key={order.id} className="p-4 hover:bg-slate-50 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-bold text-zyp-textMuted font-mono">ORD-{order.tracking_token.substring(0,4).toUpperCase()}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          order.status === 'new' ? 'bg-yellow-100 text-yellow-700' : 
                          order.status === 'completed' ? 'bg-green-100 text-green-700' : 
                          order.status === 'accepted' ? 'bg-blue-100 text-blue-700' :
                          'bg-purple-100 text-purple-700'
                        }`}>
                          {order.status.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="text-sm font-bold text-zyp-textPrimary mb-0.5">{order.customer_name}</div>
                      <div className="text-xs font-medium text-zyp-textMuted truncate">{order.products?.name}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
