"use client";

import { useState } from "react";
import { Search, Truck, Package, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

export default function OrderTracker({ businessId }: { businessId: string }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<any>(null);
  const [error, setError] = useState("");

  const handleTrack = async () => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    setError("");
    setOrder(null);

    // Assuming search by exact order ID or customer phone number
    const { data, error } = await supabase
      .from('orders')
      .select('*, products(name)')
      .eq('business_id', businessId)
      .or(`id.eq.${searchQuery},customer_phone.eq.${searchQuery}`)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error || !data) {
      setError("No order found with that ID or Phone number.");
    } else {
      setOrder(data);
    }
    setLoading(false);
  };

  const getStatusDisplay = (status: string) => {
    switch(status) {
      case 'pending': return { icon: <Clock className="w-6 h-6 text-orange-500" />, text: "Processing", color: "bg-orange-50 text-orange-700", border: "border-orange-200" };
      case 'completed': return { icon: <CheckCircle2 className="w-6 h-6 text-green-500" />, text: "Completed", color: "bg-green-50 text-green-700", border: "border-green-200" };
      default: return { icon: <Package className="w-6 h-6 text-blue-500" />, text: status, color: "bg-blue-50 text-blue-700", border: "border-blue-200" };
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full bg-slate-50 rounded-[32px] border border-slate-100 p-8 flex flex-col items-center text-center">
         <div className="w-24 h-24 bg-white rounded-3xl shadow-sm flex items-center justify-center mb-6">
            <Truck className="w-10 h-10 text-slate-300" />
         </div>
         
         <div className="w-full relative mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Order ID or Phone" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-14 pl-12 pr-4 rounded-xl border border-slate-200 outline-none focus:border-pink-500 font-bold bg-white" 
            />
         </div>

         <Button 
            onClick={handleTrack}
            disabled={loading}
            className="w-full h-12 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-extrabold shadow-md shadow-pink-600/20 border-none"
         >
           {loading ? "Tracking..." : "Track Package"}
         </Button>
      </div>

      {error && (
        <div className="w-full mt-6 bg-red-50 text-red-600 p-4 rounded-2xl flex items-center gap-3 font-bold text-sm border border-red-100">
          <AlertCircle className="w-5 h-5 shrink-0" /> {error}
        </div>
      )}

      {order && (
        <div className="w-full mt-6 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm relative overflow-hidden">
           {/* Decorative top border */}
           <div className={`absolute top-0 left-0 right-0 h-1 ${getStatusDisplay(order.status).color}`}></div>
           
           <h3 className="font-extrabold text-lg text-slate-900 mb-4 flex justify-between items-center">
             Order Details
             <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-md">#{order.id.toString().slice(0,8)}</span>
           </h3>
           
           <div className={`flex items-center gap-4 p-4 rounded-2xl border mb-6 ${getStatusDisplay(order.status).border} ${getStatusDisplay(order.status).color}`}>
             <div className="bg-white p-2 rounded-xl shadow-sm">
                {getStatusDisplay(order.status).icon}
             </div>
             <div className="text-left">
               <div className="text-xs font-extrabold uppercase tracking-wider opacity-70 mb-0.5">Current Status</div>
               <div className="font-extrabold text-lg capitalize">{getStatusDisplay(order.status).text}</div>
             </div>
           </div>

           <div className="space-y-3">
             <div className="flex justify-between items-center py-2 border-b border-slate-50">
               <span className="text-sm font-bold text-slate-400">Product</span>
               <span className="text-sm font-extrabold text-slate-900 truncate max-w-[150px]">{order.products?.name || "Product"}</span>
             </div>
             <div className="flex justify-between items-center py-2 border-b border-slate-50">
               <span className="text-sm font-bold text-slate-400">Amount</span>
               <span className="text-sm font-extrabold text-slate-900">₹{order.total_amount}</span>
             </div>
             <div className="flex justify-between items-center py-2 border-b border-slate-50">
               <span className="text-sm font-bold text-slate-400">Date</span>
               <span className="text-sm font-extrabold text-slate-900">
                 {new Date(order.created_at).toLocaleDateString()}
               </span>
             </div>
           </div>
        </div>
      )}
    </div>
  );
}
