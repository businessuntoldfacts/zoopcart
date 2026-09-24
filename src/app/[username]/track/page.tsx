"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, Search, CheckCircle2, MessageCircle, MapPin, FileText, Package } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import StoreBottomNav from "@/components/StoreBottomNav";

export default function TrackOrderPage({ params }: { params: { username: string } }) {
  const router = useRouter();
  const [business, setBusiness] = useState<any>(null);
  const [query, setQuery] = useState("");
  const [order, setOrder] = useState<any>(null);
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    async function fetchBusiness() {
      const { data } = await supabase.from('businesses').select('*').eq('username', params.username.toLowerCase()).single();
      setBusiness(data);

      // Auto-trigger search if token parameter exists in URL query
      if (typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search);
        const urlToken = urlParams.get('token');
        if (urlToken && data) {
          setQuery(urlToken);
          triggerAutoSearch(urlToken, data.id);
        }
      }
    }
    fetchBusiness();
  }, [params.username]);

  const triggerAutoSearch = async (tokenVal: string, businessId: string) => {
    setLoading(true);
    setSearched(true);

    const { data: orderData } = await supabase
      .from('orders')
      .select('*')
      .eq('business_id', businessId)
      .eq('tracking_token', tokenVal.toUpperCase())
      .maybeSingle();

    if (orderData) {
      setOrder(orderData);
      if (orderData.product_id) {
        const { data: prodData } = await supabase.from('products').select('*').eq('id', orderData.product_id).single();
        setProduct(prodData);
      }
    }
    setLoading(false);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || !business) return;
    setLoading(true);
    setSearched(true);
    setOrder(null);
    setProduct(null);

    let orderData = null;
    const cleanQuery = query.trim();

    // 1. Search by Tracking Token / Order ID
    const { data: byToken } = await supabase
      .from('orders')
      .select('*')
      .eq('business_id', business.id)
      .eq('tracking_token', cleanQuery.toUpperCase())
      .maybeSingle();

    if (byToken) {
      orderData = byToken;
    } else {
      // 2. Search by Customer Phone Number
      const { data: byPhone } = await supabase
        .from('orders')
        .select('*')
        .eq('business_id', business.id)
        .eq('customer_phone', cleanQuery)
        .order('created_at', { ascending: false });

      if (byPhone && byPhone.length > 0) {
        orderData = byPhone[0];
      } else {
        // 3. Search by Customer Name / Token
        const { data: byName } = await supabase
          .from('orders')
          .select('*')
          .eq('business_id', business.id)
          .ilike('customer_name', `%${cleanQuery}%`)
          .order('created_at', { ascending: false });

        if (byName && byName.length > 0) {
          orderData = byName[0];
        }
      }
    }

    if (orderData) {
      setOrder(orderData);
      if (orderData.product_id) {
        const { data: prodData } = await supabase.from('products').select('*').eq('id', orderData.product_id).single();
        setProduct(prodData);
      }
    }
    setLoading(false);
  };

  const getStatusStep = (status: string) => {
    if (status === 'new' || status === 'pending') return 1;
    if (status === 'accepted') return 2;
    if (status === 'shipped' || status === 'in_progress') return 3;
    if (status === 'completed' || status === 'delivered') return 4;
    return 0;
  };

  const currentStep = order ? getStatusStep(order.status) : 0;

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-24">
      {/* Top Header */}
      <header className="bg-white px-4 h-16 flex items-center justify-center sticky top-0 z-50 border-b border-slate-100 shadow-sm relative">
        <button onClick={() => router.back()} className="absolute left-4 w-10 h-10 flex items-center justify-center text-slate-900">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="font-extrabold text-base text-slate-900 tracking-tight">Track Order</h1>
      </header>

      <div className="max-w-md mx-auto px-4 pt-6">
        <form onSubmit={handleSearch} className="relative">
          <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter Order ID or Phone Number" 
            className="w-full h-14 pl-5 pr-14 rounded-2xl border border-slate-200 bg-white outline-none focus:border-[#111111] focus:ring-2 focus:ring-[#111111]/20 text-sm font-medium transition-all shadow-sm"
          />
          <button type="submit" disabled={loading} className="absolute right-2 top-2 w-10 h-10 bg-[#111111] hover:bg-[#111111] rounded-xl flex items-center justify-center text-white transition-colors">
            {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Search className="w-4 h-4" />}
          </button>
        </form>

        {searched && !order && !loading && (
          <div className="mt-8 text-center bg-white p-6 rounded-3xl border border-slate-100">
             <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                <Search className="w-8 h-8" />
             </div>
             <h3 className="font-extrabold text-slate-900 text-lg">Order not found</h3>
             <p className="text-sm font-medium text-slate-500 mt-1">Please check the ID and try again.</p>
          </div>
        )}

        {order && (
          <div className="mt-6 animate-in slide-in-from-bottom-4 duration-500">
            {/* Order Summary Header */}
            <div className="bg-white p-5 rounded-[24px] border border-slate-100 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                 <div>
                    <h2 className="font-extrabold text-lg text-slate-900 tracking-tight">{order.tracking_token}</h2>
                 </div>
                 <div className="bg-orange-100 text-orange-600 px-2.5 py-1 rounded-md text-[10px] font-extrabold flex items-center gap-1 uppercase tracking-wider">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div> Pending
                 </div>
              </div>

              {product && (
                <div className="flex gap-4 items-center mb-4 p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="w-14 h-14 rounded-lg overflow-hidden bg-white shrink-0">
                    {product.image ? <img src={product.image} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-slate-300 text-[10px] font-bold">N/A</div>}
                  </div>
                  <div>
                     <h3 className="font-extrabold text-sm text-slate-900 line-clamp-1">{product.name}</h3>
                     <div className="text-xs font-bold text-[#111111]">₹{product.price}</div>
                  </div>
                </div>
              )}

              <div className="text-xs text-slate-500 font-medium text-center border-t border-slate-50 pt-3">
                Ordered on {new Date(order.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>

            {/* Timeline */}
            <div className="mt-4 bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm relative">
              <div className="absolute left-9 top-8 bottom-12 w-0.5 bg-slate-100"></div>
              
              <div className="flex gap-4 mb-8 relative z-10">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${currentStep >= 1 ? 'bg-orange-500 shadow-sm shadow-orange-500/20' : 'bg-slate-100 border-2 border-white'}`}>
                   {currentStep >= 1 && <div className="w-2.5 h-2.5 rounded-full bg-white"></div>}
                </div>
                <div>
                   <h4 className={`text-sm font-extrabold ${currentStep >= 1 ? 'text-slate-900' : 'text-slate-400'}`}>Request Submitted</h4>
                   {currentStep >= 1 && <p className="text-xs font-medium text-slate-500 mt-1 leading-relaxed">Your request has been submitted successfully.</p>}
                </div>
              </div>

              <div className="flex gap-4 mb-8 relative z-10">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${currentStep >= 2 ? 'bg-blue-600 shadow-sm shadow-blue-600/20' : 'bg-slate-100 border-2 border-white'}`}>
                   {currentStep >= 2 && <div className="w-2.5 h-2.5 rounded-full bg-white"></div>}
                </div>
                <div>
                   <h4 className={`text-sm font-extrabold ${currentStep >= 2 ? 'text-slate-900' : 'text-slate-400'}`}>Accepted</h4>
                   {currentStep === 1 && <p className="text-xs font-medium text-slate-400 mt-1">Waiting for seller response...</p>}
                </div>
              </div>

              <div className="flex gap-4 mb-8 relative z-10">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${currentStep >= 3 ? 'bg-indigo-600 shadow-sm shadow-indigo-600/20' : 'bg-slate-100 border-2 border-white'}`}>
                   {currentStep >= 3 && <div className="w-2.5 h-2.5 rounded-full bg-white"></div>}
                </div>
                <div>
                   <h4 className={`text-sm font-extrabold ${currentStep >= 3 ? 'text-slate-900' : 'text-slate-400'}`}>In Progress</h4>
                   {currentStep === 2 && <p className="text-xs font-medium text-slate-400 mt-1">Order is being processed...</p>}
                </div>
              </div>

              <div className="flex gap-4 relative z-10">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${currentStep >= 4 ? 'bg-emerald-600 shadow-sm shadow-emerald-600/20' : 'bg-slate-100 border-2 border-white'}`}>
                   {currentStep >= 4 && <div className="w-2.5 h-2.5 rounded-full bg-white"></div>}
                </div>
                <div>
                   <h4 className={`text-sm font-extrabold ${currentStep >= 4 ? 'text-slate-900' : 'text-slate-400'}`}>Completed</h4>
                   {currentStep === 3 && <p className="text-xs font-medium text-slate-400 mt-1">Order has been completed.</p>}
                </div>
              </div>
            </div>

            {/* Need Help CTA */}
            <div className="mt-4 bg-purple-50 p-5 rounded-[24px] border border-purple-100 flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center shrink-0 text-purple-600">
                 <MessageCircle className="w-6 h-6" />
              </div>
              <div className="flex-1">
                 <h4 className="font-extrabold text-slate-900 text-sm">Need Help?</h4>
                 <p className="text-[11px] font-medium text-slate-500 leading-tight mt-0.5">Contact the seller on WhatsApp for faster support.</p>
              </div>
              <button
                onClick={() => {
                  const message = encodeURIComponent(`Hi, I need help with my order for ${product?.name || 'Product'}. Order ID: ${order?.tracking_token}`);
                  window.open(`https://wa.me/${business?.whatsapp_country_code || '91'}${business?.whatsapp_number}?text=${message}`, '_blank');
                }}
                className="px-4 py-2.5 bg-[#111111] text-white font-extrabold text-xs rounded-xl shadow-sm whitespace-nowrap hover:bg-[#111111] transition-colors"
              >
                Chat
              </button>
            </div>
          </div>
        )}
      </div>

      {business && <StoreBottomNav username={business.username} />}
    </div>
  );
}
