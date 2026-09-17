"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrders() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: business } = await supabase.from('businesses').select('id').eq('user_id', user.id).single();
      if (!business) return;

      const { data } = await supabase
        .from('orders')
        .select('*, products(name)')
        .eq('business_id', business.id)
        .order('created_at', { ascending: false });

      if (data) setOrders(data);
      setLoading(false);
    }
    loadOrders();
  }, []);

  if (loading) return <div className="text-white p-4">Loading orders...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-white">All Orders</h2>
      
      {orders.length === 0 ? (
        <Card className="bg-zyp-surface border-white/5">
          <CardContent className="p-8 text-center text-zyp-textMuted">
            No orders found yet.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id} className="bg-zyp-surface border-white/5">
              <CardContent className="p-4 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div>
                  <div className="font-semibold text-white">{order.products?.name}</div>
                  <div className="text-sm text-zyp-textMuted">
                    {order.customer_name} • {order.customer_phone}
                  </div>
                </div>
                <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                  <div className="text-sm font-mono text-zyp-textMuted">#{order.tracking_token.substring(0,8)}</div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                    order.status === 'new' ? 'bg-zyp-accent/20 text-zyp-accent border-zyp-accent/20' : 
                    order.status === 'completed' ? 'bg-zyp-success/20 text-zyp-success border-zyp-success/20' : 
                    'bg-white/10 text-white border-white/10'
                  }`}>
                    {order.status.replace('_', ' ')}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
