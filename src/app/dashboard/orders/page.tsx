"use client";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { Search, MapPin, Calendar, Clock, CheckCircle, Smartphone } from "lucide-react";

import { useDashboardData, invalidateDashboardCache } from "@/lib/useDashboardData";

export default function OrdersPage() {
  const { business, orders: cachedOrders, loading } = useDashboardData();
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [searchQuery, setSearchQuery] = useState("");

  // Tracking form states
  const [trackingNumber, setTrackingNumber] = useState("");
  const [carrierName, setCarrierName] = useState("");

  useEffect(() => {
    if (selectedOrder) {
      setTrackingNumber(selectedOrder.tracking_number || "");
      setCarrierName(selectedOrder.carrier_name || "");
    }
  }, [selectedOrder]);

  useEffect(() => {
    if (cachedOrders) {
      let filtered = cachedOrders.filter((o: any) => !['store_view', 'product_view', 'review'].includes(o.status));

      if (statusFilter !== "All Status") {
        filtered = filtered.filter((o: any) => o.status === statusFilter);
      }

      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        filtered = filtered.filter((o: any) =>
          o.customer_name?.toLowerCase().includes(q) ||
          o.customer_phone?.includes(q) ||
          o.tracking_token?.toLowerCase().includes(q)
        );
      }

      // Group orders by tracking_token to show cart orders as a single entry
      const grouped: any = {};
      filtered.forEach((o: any) => {
        const token = o.tracking_token;
        if (!grouped[token]) {
          grouped[token] = { ...o, items: [o], totalBudget: o.budget || 0 };
        } else {
          grouped[token].items.push(o);
          grouped[token].totalBudget += (o.budget || 0);
        }
      });
      setOrders(Object.values(grouped).sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
    }
  }, [cachedOrders, statusFilter, searchQuery]);

  const updateOrderStatus = async (token: string, newStatus: string, trackingNumber = "", carrierName = "") => {
    const updateData: any = { status: newStatus };
    if (trackingNumber) updateData.tracking_number = trackingNumber;
    if (carrierName) updateData.carrier_name = carrierName;

    // Update all items with the same tracking token
    const { error } = await supabase.from('orders').update(updateData).eq('tracking_token', token);
    if (error) {
      alert("Error updating status");
      return;
    }

    invalidateDashboardCache();

    // Send notification for the main order
    const currentOrder = orders.find((o: any) => o.tracking_token === token);
    if (currentOrder && currentOrder.customer_email) {
      // ... existing email logic ...
    }

    setOrders(orders.map((o: any) => o.tracking_token === token ? { ...o, status: newStatus, tracking_number: trackingNumber || o.tracking_number, carrier_name: carrierName || o.carrier_name } : o));
    if (selectedOrder?.tracking_token === token) {
      setSelectedOrder({ ...selectedOrder, status: newStatus, tracking_number: trackingNumber || selectedOrder.tracking_number, carrier_name: carrierName || selectedOrder.carrier_name });
    }
  };

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
              <input
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 h-10 rounded-lg border border-zyp-border bg-white text-sm outline-none focus:ring-2 focus:ring-[#111111]/20"
              />
            </div>
            <select
              className="h-10 rounded-lg border border-zyp-border bg-white text-sm font-semibold px-3 outline-none"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All Status">All Status</option>
              <option value="pending">Request Submitted</option>
              <option value="accepted">Accepted</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {orders.length === 0 ? (
              <div className="p-12 text-center text-zyp-textMuted text-sm font-medium">No orders found.</div>
            ) : (
              <div className="divide-y divide-zyp-border">
                {orders.map((order: any) => (
                  <div 
                    key={order.id} 
                    onClick={() => setSelectedOrder(order)}
                    className={`p-4 cursor-pointer transition-colors hover:bg-slate-100 ${selectedOrder?.tracking_token === order.tracking_token ? 'bg-blue-50/50' : ''}`}
                  >
                    <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center text-lg">
                        🛒
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1">
                          <span className="text-[10px] font-bold text-slate-400 font-mono uppercase">#{order.tracking_token}</span>
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                            order.status === 'pending' || order.status === 'new' ? 'bg-orange-100 text-orange-700' :
                            order.status === 'accepted' ? 'bg-blue-100 text-blue-700' :
                            order.status === 'in_progress' ? 'bg-indigo-100 text-indigo-700' :
                            order.status === 'completed' || order.status === 'delivered' ? 'bg-emerald-100 text-emerald-700' :
                            'bg-slate-100 text-slate-700'
                          }`}>
                            {order.status === 'pending' || order.status === 'new' ? 'NEW' : order.status.replace('_', ' ')}
                          </span>
                        </div>
                        <div className="text-sm font-extrabold text-[#0F172A] truncate">{order.customer_name}</div>
                        <div className="text-xs font-medium text-slate-500 truncate">
                          {order.items?.length > 1 ? `${order.items.length} Items in Cart` : order.products?.name}
                        </div>
                      </div>
                    </div>
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
              <div className="text-lg font-extrabold text-[#0F172A] uppercase">Order #{selectedOrder.tracking_token}</div>
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

            {/* Product Details (Multi-item support) */}
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Items in Order</h3>
              <div className="space-y-3">
                {selectedOrder.items?.map((item: any) => (
                  <div key={item.id} className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex gap-4 items-center">
                    <div className="w-16 h-16 rounded-lg bg-white border border-slate-200 overflow-hidden shrink-0">
                      {item.products?.image && <img src={item.products.image} className="w-full h-full object-cover" />}
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-[#0F172A]">{item.products?.name || 'Product'}</div>
                      <div className="flex justify-between items-center mt-1">
                        <div className="text-sm font-extrabold text-[#111111]">₹{item.budget}</div>
                        <div className="text-xs font-bold text-slate-400">Qty: {item.quantity}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Request Details */}
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Request Details</h3>
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-4">
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Total Amount</div>
                  <div className="text-lg font-black text-slate-900 mt-0.5">₹{selectedOrder.totalBudget}</div>
                </div>
                {selectedOrder.required_date && (
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase">Required Date</div>
                    <div className="text-sm font-bold text-[#0F172A] mt-0.5">{new Date(selectedOrder.required_date).toLocaleDateString()}</div>
                  </div>
                )}
                {selectedOrder.delivery_location && (
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase">Delivery Location</div>
                    <div className="text-sm font-medium text-[#0F172A] mt-0.5">{selectedOrder.delivery_location} {selectedOrder.city && `, ${selectedOrder.city}`} {selectedOrder.pincode && `- ${selectedOrder.pincode}`}</div>
                  </div>
                )}
                {selectedOrder.notes && (
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase">Notes</div>
                    <div className="text-sm font-medium text-[#0F172A] mt-0.5 bg-white p-3 rounded-lg border border-slate-200">{selectedOrder.notes}</div>
                  </div>
                )}
                {selectedOrder.reference_image && (
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Reference Image</div>
                    <a href={selectedOrder.reference_image} target="_blank" className="block w-full max-w-[200px] h-32 rounded-lg border border-slate-200 overflow-hidden bg-white hover:opacity-90 transition-opacity">
                      <img src={selectedOrder.reference_image} className="w-full h-full object-contain" />
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Shipping & Tracking Information */}
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Shipping Details</h3>
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Carrier Name</label>
                  <input
                    type="text"
                    placeholder="e.g., BlueDart, Delhivery, FedEx"
                    value={carrierName}
                    onChange={(e) => setCarrierName(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-zyp-border bg-white text-sm outline-none font-medium"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Tracking Number</label>
                  <input
                    type="text"
                    placeholder="Enter shipment tracking reference"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-zyp-border bg-white text-sm outline-none font-medium"
                  />
                </div>
                <button
                  onClick={() => updateOrderStatus(selectedOrder.tracking_token, selectedOrder.status, trackingNumber, carrierName)}
                  className="w-full h-9 bg-slate-900 text-white rounded-lg text-xs font-bold transition-all hover:bg-black mt-2"
                >
                  Save Shipment Info
                </button>
              </div>
            </div>

            {/* Status Update Actions */}
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Update Order Status</h3>
              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={() => updateOrderStatus(selectedOrder.tracking_token, 'pending', trackingNumber, carrierName)}
                  className={`py-3.5 rounded-2xl text-xs font-extrabold border transition-all ${selectedOrder.status === 'pending' || selectedOrder.status === 'new' ? 'bg-orange-500 text-white border-orange-500 shadow-lg shadow-orange-500/20' : 'bg-white text-orange-600 border-orange-100 hover:bg-orange-50'}`}
                >
                  Request Submitted
                </button>
                <button 
                  onClick={() => updateOrderStatus(selectedOrder.tracking_token, 'accepted', trackingNumber, carrierName)}
                  className={`py-3.5 rounded-2xl text-xs font-extrabold border transition-all ${selectedOrder.status === 'accepted' ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-600/20' : 'bg-white text-blue-600 border-blue-100 hover:bg-blue-50'}`}
                >
                  Accepted
                </button>
                <button 
                  onClick={() => updateOrderStatus(selectedOrder.tracking_token, 'in_progress', trackingNumber, carrierName)}
                  className={`py-3.5 rounded-2xl text-xs font-extrabold border transition-all ${selectedOrder.status === 'in_progress' ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-600/20' : 'bg-white text-indigo-600 border-indigo-100 hover:bg-indigo-50'}`}
                >
                  In Progress
                </button>
                <button
                  onClick={() => updateOrderStatus(selectedOrder.tracking_token, 'completed', trackingNumber, carrierName)}
                  className={`py-3.5 rounded-2xl text-xs font-extrabold border transition-all ${selectedOrder.status === 'completed' || selectedOrder.status === 'delivered' ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-600/20' : 'bg-white text-emerald-600 border-emerald-100 hover:bg-emerald-50'}`}
                >
                  Completed
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}




