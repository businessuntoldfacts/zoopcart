"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, ShoppingBag, CheckCircle2, Clock } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function DashboardOverview() {
  const [stats, setStats] = useState({ new: 0, accepted: 0, in_progress: 0, completed: 0 });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: business } = await supabase.from('businesses').select('id').eq('user_id', user.id).single();
      if (!business) return;

      // Fetch all orders to calculate stats
      const { data: orders } = await supabase
        .from('orders')
        .select('*, products(name)')
        .eq('business_id', business.id)
        .order('created_at', { ascending: false });

      if (orders) {
        const newStats = { new: 0, accepted: 0, in_progress: 0, completed: 0 };
        orders.forEach(o => {
          if (newStats[o.status as keyof typeof newStats] !== undefined) {
            newStats[o.status as keyof typeof newStats]++;
          }
        });
        setStats(newStats);
        setRecentOrders(orders.slice(0, 5)); // Top 5 recent
      }
      setLoading(false);
    }
    loadDashboard();
  }, []);

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    await supabase.from('orders').update({ status: newStatus }).eq('id', orderId);
    setRecentOrders(recentOrders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    
    // Refresh stats locally
    setStats(prev => {
      const oldOrder = recentOrders.find(o => o.id === orderId);
      const oldStatus = oldOrder?.status as keyof typeof prev;
      const nextStatus = newStatus as keyof typeof prev;
      return {
        ...prev,
        [oldStatus]: Math.max(0, prev[oldStatus] - 1),
        [nextStatus]: prev[nextStatus] + 1
      };
    });
  };

  if (loading) return <div className="text-white p-4">Loading dashboard...</div>;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        <Card className="bg-zyp-surface border-white/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-zyp-textMuted">New Requests</CardTitle>
            <Package className="w-4 h-4 text-zyp-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl md:text-3xl font-bold font-display text-white">{stats.new}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-zyp-surface border-white/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-zyp-textMuted">Accepted</CardTitle>
            <CheckCircle2 className="w-4 h-4 text-zyp-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl md:text-3xl font-bold font-display text-white">{stats.accepted}</div>
          </CardContent>
        </Card>

        <Card className="bg-zyp-surface border-white/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-zyp-textMuted">In Progress</CardTitle>
            <Clock className="w-4 h-4 text-zyp-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl md:text-3xl font-bold font-display text-white">{stats.in_progress}</div>
          </CardContent>
        </Card>

        <Card className="bg-zyp-surface border-white/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-zyp-textMuted">Completed</CardTitle>
            <ShoppingBag className="w-4 h-4 text-white" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl md:text-3xl font-bold font-display text-white">{stats.completed}</div>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-white mb-4">Recent Orders</h2>
        {recentOrders.length === 0 ? (
          <Card className="bg-zyp-surface border-white/5">
            <div className="p-12 text-center flex flex-col items-center justify-center text-zyp-textMuted">
              <ShoppingBag className="w-12 h-12 mb-4 opacity-20" />
              <p className="text-lg font-medium text-white mb-1">No orders yet</p>
              <p className="text-sm">When customers place orders, they will appear here.</p>
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <Card key={order.id} className="bg-zyp-surface border-white/5">
                <CardContent className="p-4 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                  <div>
                    <div className="font-semibold text-white">{order.products?.name}</div>
                    <div className="text-sm text-zyp-textMuted mt-1">
                      {order.customer_name} • {order.customer_phone}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                    <div className="text-sm font-mono text-zyp-textMuted">#{order.tracking_token.substring(0,8)}</div>
                    
                    <select 
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border focus:outline-none appearance-none cursor-pointer ${
                        order.status === 'new' ? 'bg-zyp-accent/20 text-zyp-accent border-zyp-accent/20' : 
                        order.status === 'completed' ? 'bg-zyp-success/20 text-zyp-success border-zyp-success/20' : 
                        order.status === 'accepted' ? 'bg-white/20 text-white border-white/20' :
                        'bg-zyp-warning/20 text-zyp-warning border-zyp-warning/20'
                      }`}
                    >
                      <option value="new" className="text-black bg-white">New Request</option>
                      <option value="accepted" className="text-black bg-white">Accepted</option>
                      <option value="in_progress" className="text-black bg-white">In Progress</option>
                      <option value="completed" className="text-black bg-white">Completed</option>
                    </select>

                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
