"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Search, MoreVertical, Edit2, Ban, ExternalLink, Eye, MapPin, Phone, Calendar, Package, ShoppingBag } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function AdminSellersPage() {
  const [allSellers, setAllSellers] = useState<any[]>([]);
  const [sellers, setSellers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filtering state
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Detail Modal state
  const [selectedSeller, setSelectedSeller] = useState<any>(null);
  const [sellerStats, setSellerStats] = useState({ products: 0, orders: 0 });

  useEffect(() => {
    async function loadSellers() {
      const { data } = await supabase.from('businesses').select('*').order('created_at', { ascending: false });
      if (data) {
        setAllSellers(data);
        setSellers(data);
      }
      setLoading(false);
    }
    loadSellers();
  }, []);

  // Handle Search & Filter
  useEffect(() => {
    let filtered = allSellers;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(s => 
        (s.business_name && s.business_name.toLowerCase().includes(q)) ||
        (s.username && s.username.toLowerCase().includes(q)) ||
        (s.whatsapp_number && s.whatsapp_number.includes(q))
      );
    }
    if (statusFilter !== "All") {
      const sFilter = statusFilter === "Active" ? null : "suspended";
      filtered = filtered.filter(s => (s.status || null) === (sFilter === "suspended" ? "suspended" : null));
    }
    setSellers(filtered);
  }, [searchQuery, statusFilter, allSellers]);

  const openDetails = async (seller: any) => {
    setSelectedSeller(seller);
    // Load quick stats for this seller
    const { count: prodCount } = await supabase.from('products').select('*', { count: 'exact', head: true }).eq('business_id', seller.id);
    const { count: ordCount } = await supabase.from('orders').select('*', { count: 'exact', head: true }).eq('business_id', seller.id);
    setSellerStats({ products: prodCount || 0, orders: ordCount || 0 });
  };

  const handleSuspend = async (sellerId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'suspended' ? null : 'suspended';
    await supabase.from('businesses').update({ status: newStatus }).eq('id', sellerId);
    setAllSellers(allSellers.map(s => s.id === sellerId ? { ...s, status: newStatus } : s));
  };

  return (
    <div className="space-y-6 pb-12 relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-[#0F172A]">Manage Sellers</h2>
          <p className="text-sm text-slate-500 mt-1">View comprehensive details of all store owners.</p>
        </div>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            placeholder="Search by name, username, phone..." 
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
          <option value="Active">Active</option>
          <option value="Suspended">Suspended</option>
        </select>
      </div>

      <Card className="bg-white border-slate-200 shadow-sm rounded-2xl border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
              <tr>
                <th className="p-4 pl-6">Business Profile</th>
                <th className="p-4">Contact</th>
                <th className="p-4">Category</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right pr-6">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan={5} className="p-8 text-center text-slate-500">Loading sellers...</td></tr>
              ) : sellers.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-slate-500">No sellers found.</td></tr>
              ) : (
                sellers.map((seller) => (
                  <tr key={seller.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center font-bold text-slate-400">
                          {seller.profile_image ? (
                            <img src={seller.profile_image} className="w-full h-full object-cover" />
                          ) : (seller.business_name || 'S').charAt(0)}
                        </div>
                        <div>
                          <div className="font-extrabold text-[#0F172A] text-base">{seller.business_name || "Unnamed Store"}</div>
                          <a href={`/${seller.username}`} target="_blank" className="text-xs font-bold text-blue-600 hover:underline">zypcart.com/{seller.username}</a>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-[#0F172A]">+{seller.whatsapp_country_code || '91'} {seller.whatsapp_number || 'N/A'}</div>
                      <div className="text-xs text-slate-500 font-medium">WhatsApp Number</div>
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md text-xs font-bold">
                        {seller.category || 'Other'}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                        seller.status === 'suspended' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                      }`}>
                        {seller.status || 'Active'}
                      </span>
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openDetails(seller)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View Full Profile">
                          <Eye className="w-5 h-5" />
                        </button>
                        <button onClick={() => handleSuspend(seller.id, seller.status)} className={`p-2 rounded-lg transition-colors ${seller.status === 'suspended' ? 'text-green-600 hover:bg-green-50' : 'text-slate-400 hover:text-red-600 hover:bg-red-50'}`} title={seller.status === 'suspended' ? 'Activate' : 'Suspend'}>
                          <Ban className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Seller Details Modal */}
      {selectedSeller && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto overflow-x-hidden border border-slate-200">
            <div className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-slate-100 p-6 flex justify-between items-center z-10">
              <h3 className="font-extrabold text-xl text-[#0F172A]">Seller Profile</h3>
              <button onClick={() => setSelectedSeller(null)} className="w-8 h-8 flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full font-bold">✕</button>
            </div>
            
            <div className="p-8">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="w-32 h-32 rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center text-5xl font-extrabold text-slate-300">
                  {selectedSeller.profile_image ? (
                    <img src={selectedSeller.profile_image} className="w-full h-full object-cover" />
                  ) : (selectedSeller.business_name || 'S').charAt(0)}
                </div>
                
                <div className="flex-1 space-y-4 w-full">
                  <div>
                    <h2 className="text-3xl font-extrabold text-[#0F172A] leading-tight">{selectedSeller.business_name || "Unnamed Store"}</h2>
                    <a href={`/${selectedSeller.username}`} target="_blank" className="text-blue-600 font-bold hover:underline flex items-center gap-1 mt-1">
                      zypcart.com/{selectedSeller.username} <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                    <div>
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Status</div>
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                        selectedSeller.status === 'suspended' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                      }`}>
                        {selectedSeller.status || 'Active'}
                      </span>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Joined Date</div>
                      <div className="font-bold text-slate-700 flex items-center gap-1">
                        <Calendar className="w-4 h-4 text-slate-400" /> {new Date(selectedSeller.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-3 mb-4">
                    <Phone className="w-5 h-5 text-green-500" />
                    <h4 className="font-extrabold text-slate-900">Contact Details</h4>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-medium">WhatsApp:</span>
                      <span className="font-bold text-slate-900">+{selectedSeller.whatsapp_country_code || '91'} {selectedSeller.whatsapp_number || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-medium">Category:</span>
                      <span className="font-bold text-slate-900">{selectedSeller.category || 'Other'}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-3 mb-4">
                    <ShoppingBag className="w-5 h-5 text-blue-500" />
                    <h4 className="font-extrabold text-slate-900">Store Activity</h4>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 font-medium">Total Products:</span>
                      <span className="bg-white border border-slate-200 px-3 py-1 rounded-lg font-bold text-slate-900">{sellerStats.products}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 font-medium">Total Orders:</span>
                      <span className="bg-white border border-slate-200 px-3 py-1 rounded-lg font-bold text-slate-900">{sellerStats.orders}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end gap-3">
                 <button onClick={() => handleSuspend(selectedSeller.id, selectedSeller.status)} className={`px-6 py-3 rounded-xl font-bold text-sm transition-all ${selectedSeller.status === 'suspended' ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-red-50 text-red-600 hover:bg-red-100'}`}>
                   {selectedSeller.status === 'suspended' ? 'Re-activate Account' : 'Suspend Account'}
                 </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
