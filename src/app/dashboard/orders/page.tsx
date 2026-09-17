"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { Search, MapPin, Calendar, Clock, CheckCircle, Smartphone } from "lucide-react";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  useEffect(() => {
    async function loadOrders() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: business } = await supabase.from('businesses').select('id').eq('user_id', user.id).single();
      if (!business) return;

      const { data } = await supabase
        .from('orders')
        .select('*, products(*)')
        .eq('business_id', business.id)
        .order('created_at', { ascending: false });

      if (data) setOrders(data);
      setLoading(false);
    }
    loadOrders();
  }, []);

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    await supabase.from('orders').update({ status: newStatus }).eq('id', orderId);
    setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    if (selectedOrder?.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
  };

  if (loading) return <div className="text-zyp-textMuted font-medium p-4">Loading orders...</div>;

  return (
    <div className="flex h-[calc(100vh-140px)] gap-6">
      {/* Orders List */}
      <div className={`flex-1 flex flex-col ${selectedOrder ? 'hidden lg:flex' : 'flex'}`}>
        <div className="mb-6">
          <h2 className="text-2xl font-extrabold text-zyp-textPrimary">Customer Orders</h2>
          <p className="text-sm text-zyp-textMuted mt-1">Manage all customer requests.</p>
        </div>

        <div className="bg-white rounded-3xl border border-zyp-border shadow-sm flex-1 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-zyp-border flex gap-3 bg-slate-50">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input placeholder="Search orders..." className="w-full pl-9 h-10 rounded-lg border border-zyp-border bg-white text-sm outline-none focus:ring-2 focus:ring-zyp-primary/20" />
            </div>
            <select className="h-10 rounded-lg border border-zyp-border bg-white text-sm font-semibold px-3 outline-none">
              <option>All Status</option>
            </select>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {orders.length === 0 ? (
              <div className="p-12 text-center text-zyp-textMuted text-sm font-medium">No orders found.</div>
            ) : (
              <div className="divide-y divide-zyp-border">
                {orders.map((order) => (
                  <div 
                    key={order.id} 
                    onClick={() => setSelectedOrder(order)}
                    className={`p-4 cursor-pointer transition-colors hover:bg-blue-50 ${selectedOrder?.id === order.id ? 'bg-blue-50/50' : ''}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[11px] font-bold text-zyp-textMuted font-mono uppercase">ORD-{order.tracking_token.substring(0,4)}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        order.status === 'new' ? 'bg-yellow-100 text-yellow-700' : 
                        order.status === 'completed' ? 'bg-green-100 text-green-700' : 
                        order.status === 'accepted' ? 'bg-blue-100 text-blue-700' :
                        'bg-purple-100 text-purple-700'
                      }`}>
                        {order.status.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="text-sm font-extrabold text-[#0F172A] mb-1">{order.customer_name}</div>
                    <div className="text-xs font-medium text-slate-500 truncate">{order.products?.name}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Side Panel (Screen 12 equivalent) */}
      {selectedOrder && (
        <div className="w-full lg:w-[400px] xl:w-[480px] bg-white rounded-3xl border border-zyp-border shadow-sm flex flex-col shrink-0 overflow-hidden">
          <div className="p-4 border-b border-zyp-border flex items-center justify-between bg-slate-50">
            <div>
              <div className="text-lg font-extrabold text-[#0F172A] uppercase">Order ORD-{selectedOrder.tracking_token.substring(0,4)}</div>
              <div className="text-xs font-medium text-slate-500">Received on {new Date(selectedOrder.created_at).toLocaleDateString()}</div>
            </div>
            <button onClick={() => setSelectedOrder(null)} className="lg:hidden text-sm font-bold text-slate-400">Close</button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            {/* Customer Details */}
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Customer Details</h3>
              <div className="bg-slate-50 rounded-xl p-4 space-y-3 border border-slate-100">
                <div className="flex items-center gap-3 text-sm font-bold text-[#0F172A]">
                  <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center shrink-0">👤</div>
                  {selectedOrder.customer_name}
                </div>
                <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
                  <Smartphone className="w-4 h-4 text-slate-400" />
                  +91 {selectedOrder.customer_phone}
                  <a href={`https://wa.me/91${selectedOrder.customer_phone}`} target="_blank" className="ml-auto text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">WhatsApp</a>
                </div>
              </div>
            </div>

            {/* Product Details */}
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Product Details</h3>
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex gap-4 items-center">
                <div className="w-16 h-16 rounded-lg bg-white border border-slate-200 overflow-hidden shrink-0">
                  {selectedOrder.products?.image && <img src={selectedOrder.products.image} className="w-full h-full object-cover" />}
                </div>
                <div>
                  <div className="font-bold text-[#0F172A]">{selectedOrder.products?.name}</div>
                  <div className="text-sm font-extrabold text-zyp-primary mt-1">₹{selectedOrder.products?.price}</div>
                </div>
              </div>
            </div>

            {/* Status Update Actions */}
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Update Order Status</h3>
              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={() => updateOrderStatus(selectedOrder.id, 'accepted')}
                  className={`py-3 rounded-xl text-sm font-bold border transition-colors ${selectedOrder.status === 'accepted' ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'bg-white text-blue-600 border-blue-200 hover:bg-blue-50'}`}
                >
                  Accept Order
                </button>
                <button 
                  onClick={() => updateOrderStatus(selectedOrder.id, 'in_progress')}
                  className={`py-3 rounded-xl text-sm font-bold border transition-colors ${selectedOrder.status === 'in_progress' ? 'bg-purple-600 text-white border-purple-600 shadow-md' : 'bg-white text-purple-600 border-purple-200 hover:bg-purple-50'}`}
                >
                  Mark In Progress
                </button>
                <button 
                  onClick={() => updateOrderStatus(selectedOrder.id, 'completed')}
                  className={`py-3 rounded-xl text-sm font-bold border transition-colors col-span-2 ${selectedOrder.status === 'completed' ? 'bg-green-600 text-white border-green-600 shadow-md' : 'bg-white text-green-600 border-green-200 hover:bg-green-50'}`}
                >
                  Mark Completed
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
