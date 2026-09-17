"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Search } from "lucide-react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrders() {
      const { data } = await supabase.from('orders').select('*, businesses(business_name, username), products(name)').order('created_at', { ascending: false });
      if (data) setOrders(data);
      setLoading(false);
    }
    loadOrders();
  }, []);

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-[#0F172A]">All Platform Orders</h2>
          <p className="text-sm text-slate-500 mt-1">View every order flowing through Zypcart.</p>
        </div>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input placeholder="Search orders..." className="w-full pl-9 h-12 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500" />
        </div>
        <select className="bg-white border border-slate-200 text-sm font-semibold text-[#0F172A] rounded-xl px-4 h-12 outline-none">
          <option>All Status</option>
        </select>
      </div>

      <Card className="bg-white border-slate-200 shadow-sm rounded-2xl border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
              <tr>
                <th className="p-4 pl-6">Order ID</th>
                <th className="p-4">Store</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Product</th>
                <th className="p-4">Date</th>
                <th className="p-4 text-right pr-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan={6} className="p-8 text-center text-slate-500">Loading orders...</td></tr>
              ) : orders.length === 0 ? (
                <tr><td colSpan={6} className="p-8 text-center text-slate-500">No orders found.</td></tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 pl-6">
                      <div className="font-mono text-xs font-bold text-[#0F172A]">ORD-{order.tracking_token.substring(0,6)}</div>
                    </td>
                    <td className="p-4">
                      <Link href={`/${order.businesses?.username}`} target="_blank" className="font-bold text-blue-600 hover:underline">
                        {order.businesses?.business_name}
                      </Link>
                    </td>
                    <td className="p-4 text-[#0F172A] font-medium">
                      {order.customer_name}
                    </td>
                    <td className="p-4 text-slate-500 font-medium truncate max-w-[200px]">
                      {order.products?.name}
                    </td>
                    <td className="p-4 text-slate-500 font-medium">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider inline-block ${
                        order.status === 'new' ? 'bg-yellow-100 text-yellow-700' : 
                        order.status === 'completed' ? 'bg-green-100 text-green-700' : 
                        order.status === 'accepted' ? 'bg-blue-100 text-blue-700' :
                        'bg-purple-100 text-purple-700'
                      }`}>
                        {order.status.replace('_', ' ')}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
