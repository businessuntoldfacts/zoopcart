"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Search, Eye, MapPin, Calendar, CreditCard, ShoppingBag, Truck } from "lucide-react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function AdminOrdersPage() {
  const [allOrders, setAllOrders] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filtering
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Detail Modal
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  useEffect(() => {
    async function loadOrders() {
      const { data } = await supabase.from('orders').select('*, businesses(business_name, username), products(name, price)').order('created_at', { ascending: false });
      if (data) {
        setAllOrders(data);
        setOrders(data);
      }
      setLoading(false);
    }
    loadOrders();
  }, []);

  useEffect(() => {
    let filtered = allOrders;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(o => 
        (o.customer_name && o.customer_name.toLowerCase().includes(q)) ||
        (o.customer_phone && o.customer_phone.includes(q)) ||
        (o.tracking_token && o.tracking_token.toLowerCase().includes(q)) ||
        (o.businesses?.business_name && o.businesses.business_name.toLowerCase().includes(q))
      );
    }
    if (statusFilter !== "All") {
      filtered = filtered.filter(o => o.status === statusFilter.toLowerCase());
    }
    setOrders(filtered);
  }, [searchQuery, statusFilter, allOrders]);

  const parseNotes = (notes: string) => {
    if (!notes) return { text: "No additional notes", breakdown: "" };
    // Zypcart format usually is "Total: ₹XXX (Product: ₹XXX + Delivery: ₹XXX) | user notes"
    // Let's just return the raw string nicely formatted
    return notes;
  };

  return (
    <div className="space-y-6 pb-12 relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-[#0F172A]">All Platform Orders</h2>
          <p className="text-sm text-slate-500 mt-1">View every order flowing through Zypcart with full details.</p>
        </div>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            placeholder="Search by ID, Customer Name, Phone, Store..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 h-12 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500" 
          />
        </div>
        <select 
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-white border border-slate-200 text-sm font-semibold text-[#0F172A] rounded-xl px-4 h-12 outline-none"
        >
          <option value="All">All Status</option>
          <option value="New">New</option>
          <option value="Accepted">Accepted</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      <Card className="bg-white border-slate-200 shadow-sm rounded-2xl border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
              <tr>
                <th className="p-4 pl-6">Order ID & Date</th>
                <th className="p-4">Store</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Product</th>
                <th className="p-4 text-right">Status</th>
                <th className="p-4 text-right pr-6">Action</th>
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
                      <div className="font-mono text-xs font-bold text-[#0F172A]">ORD-{order.tracking_token?.substring(0,6).toUpperCase()}</div>
                      <div className="text-[10px] text-slate-400 font-medium mt-1">{new Date(order.created_at).toLocaleString()}</div>
                    </td>
                    <td className="p-4">
                      <Link href={`/${order.businesses?.username}`} target="_blank" className="font-bold text-blue-600 hover:underline">
                        {order.businesses?.business_name || "Unknown"}
                      </Link>
                    </td>
                    <td className="p-4">
                      <div className="text-[#0F172A] font-extrabold">{order.customer_name}</div>
                      <div className="text-xs text-slate-500 font-medium">{order.customer_phone}</div>
                    </td>
                    <td className="p-4 text-slate-600 font-medium truncate max-w-[200px]">
                      {order.quantity}x {order.products?.name}
                    </td>
                    <td className="p-4 text-right">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider inline-block ${
                        order.status === 'new' ? 'bg-yellow-100 text-yellow-700' : 
                        order.status === 'completed' ? 'bg-green-100 text-green-700' : 
                        order.status === 'accepted' ? 'bg-blue-100 text-blue-700' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {order.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <button onClick={() => setSelectedOrder(order)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Eye className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto overflow-x-hidden border border-slate-200">
            <div className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-slate-100 p-6 flex justify-between items-center z-10">
              <h3 className="font-extrabold text-xl text-[#0F172A] flex items-center gap-2">
                Order <span className="text-blue-600 font-mono">#{selectedOrder.tracking_token?.substring(0,6).toUpperCase()}</span>
              </h3>
              <button onClick={() => setSelectedOrder(null)} className="w-8 h-8 flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full font-bold">✕</button>
            </div>
            
            <div className="p-8 space-y-6">
              
              {/* Store & Customer Info */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Store Details</h4>
                  <div className="font-extrabold text-[#0F172A] text-lg">{selectedOrder.businesses?.business_name}</div>
                  <a href={`/${selectedOrder.businesses?.username}`} target="_blank" className="text-sm font-bold text-blue-600 hover:underline">zypcart.com/{selectedOrder.businesses?.username}</a>
                </div>
                
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Customer Info</h4>
                  <div className="font-extrabold text-[#0F172A] text-lg">{selectedOrder.customer_name}</div>
                  <div className="text-sm font-bold text-slate-600 mt-1">{selectedOrder.customer_phone}</div>
                </div>
              </div>

              {/* Order Content */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden">
                <div className="bg-slate-50 border-b border-slate-200 p-4 flex items-center gap-2 text-[#0F172A] font-bold">
                  <ShoppingBag className="w-5 h-5 text-blue-500" /> Items Ordered
                </div>
                <div className="p-5 flex justify-between items-center">
                  <div>
                    <div className="font-extrabold text-[#0F172A] text-lg">{selectedOrder.products?.name || "Unknown Product"}</div>
                    <div className="text-sm font-medium text-slate-500 mt-1">Quantity: {selectedOrder.quantity}x</div>
                  </div>
                </div>
              </div>

              {/* Address & Delivery */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="border border-slate-200 rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-3 text-[#0F172A] font-bold">
                    <MapPin className="w-5 h-5 text-red-500" /> Delivery Address
                  </div>
                  <p className="text-sm text-slate-600 font-medium whitespace-pre-wrap leading-relaxed">
                    {selectedOrder.delivery_location || "No address provided."}
                  </p>
                </div>
                
                <div className="border border-slate-200 rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-3 text-[#0F172A] font-bold">
                    <Calendar className="w-5 h-5 text-purple-500" /> Additional Details
                  </div>
                  <div className="space-y-3">
                    <div>
                      <div className="text-xs text-slate-500 font-bold uppercase">Status</div>
                      <div className="font-extrabold text-[#0F172A] capitalize mt-0.5">{selectedOrder.status.replace('_', ' ')}</div>
                    </div>
                    {selectedOrder.required_date && (
                      <div>
                        <div className="text-xs text-slate-500 font-bold uppercase">Required By</div>
                        <div className="font-extrabold text-[#0F172A] mt-0.5">{new Date(selectedOrder.required_date).toLocaleDateString()}</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Financials / Notes */}
              <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-3 text-blue-900 font-bold">
                  <CreditCard className="w-5 h-5 text-blue-500" /> Order Financials & Notes
                </div>
                <p className="text-sm font-bold text-blue-800 whitespace-pre-wrap leading-relaxed">
                  {selectedOrder.notes || "No additional financial details."}
                </p>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
