"use client";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Search, Edit2, Ban, ExternalLink, Eye, Phone, Calendar, ShoppingBag } from "lucide-react";
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
  const [isEditing, setIsEditing] = useState(false);
  const [isSuspending, setIsSuspending] = useState(false);
  const [suspensionReason, setSuspensionReason] = useState("");
  const [editForm, setEditForm] = useState({
    business_name: "",
    category: "",
    whatsapp_number: "",
    username: "",
    whatsapp_country_code: "",
    email: ""
  });
  const [sellerStats, setSellerStats] = useState({ products: 0, orders: 0 });

  const loadSellers = async () => {
    const { data } = await supabase.from('businesses').select('*').order('created_at', { ascending: false });
    if (data) {
      setAllSellers(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadSellers();

    // REALTIME: Listen for seller updates or new signups
    const channel = supabase.channel('admin-sellers')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'businesses' }, () => loadSellers())
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    let filtered = allSellers;

    // Filter by search query (Name, Username, WhatsApp)
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(s =>
        (s.business_name?.toLowerCase().includes(q)) ||
        (s.username?.toLowerCase().includes(q)) ||
        (s.whatsapp_number?.includes(q)) ||
        (s.email?.toLowerCase().includes(q))
      );
    }

    // Filter by status
    if (statusFilter !== "All") {
      filtered = filtered.filter(s =>
        statusFilter === "Suspended" ? s.status === "suspended" : s.status !== "suspended"
      );
    }

    setSellers(filtered);
  }, [searchQuery, statusFilter, allSellers]);

  const openDetails = async (seller: any) => {
    setSelectedSeller(seller);
    setEditForm({
      business_name: seller.business_name || "",
      category: seller.category || "",
      whatsapp_number: seller.whatsapp_number || "",
      username: seller.username || "",
      whatsapp_country_code: seller.whatsapp_country_code || "91",
      email: seller.email || ""
    });
    setIsEditing(false);
    setIsSuspending(false);
    setSuspensionReason("");
    // Load quick stats for this seller
    const { count: prodCount } = await supabase.from('products').select('*', { count: 'exact', head: true }).eq('business_id', seller.id);
    const { count: ordCount } = await supabase.from('orders').select('*', { count: 'exact', head: true }).eq('business_id', seller.id);
    setSellerStats({ products: prodCount || 0, orders: ordCount || 0 });
  };

  const handleUpdateSeller = async () => {
    setLoading(true);
    const { error } = await supabase
      .from('businesses')
      .update(editForm)
      .eq('id', selectedSeller.id);

    if (!error) {
      setAllSellers(allSellers.map(s => s.id === selectedSeller.id ? { ...s, ...editForm } : s));
      setSelectedSeller({ ...selectedSeller, ...editForm });
      setIsEditing(false);
    }
    setLoading(false);
  };

  const handleSuspend = async (seller: any) => {
    if (seller.status !== 'suspended' && !isSuspending) {
      setIsSuspending(true);
      return;
    }

    const isReactivating = seller.status === 'suspended';
    const newStatus = isReactivating ? null : 'suspended';

    setLoading(true);
    const { error } = await supabase.from('businesses').update({
      status: newStatus,
      suspension_reason: isReactivating ? null : suspensionReason
    }).eq('id', seller.id);

    if (!error) {
      // Update UI State immediately
      setAllSellers(prev => prev.map(s => s.id === seller.id ? { ...s, status: newStatus, suspension_reason: isReactivating ? null : suspensionReason } : s));
      setSelectedSeller(prev => ({ ...prev, status: newStatus, suspension_reason: isReactivating ? null : suspensionReason }));

      // Send Email Notification
      try {
        await fetch('/api/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: isReactivating ? 'account_activated' : 'account_suspended',
            email: seller.email,
            businessName: seller.business_name,
            reason: suspensionReason
          })
        });
      } catch (e) {
        console.error("Failed to send suspension email", e);
      }

      setIsSuspending(false);
      setSuspensionReason("");
    }
    setLoading(false);
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
            className="w-full pl-9 h-12 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-[#111111]" 
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
              {loading && allSellers.length === 0 ? (
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
                          <a href={`/${seller.username}`} target="_blank" className="text-xs font-bold text-[#111111] hover:underline">zoopcart.com/{seller.username}</a>
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
                        <button onClick={() => openDetails(seller)} className="p-2 text-slate-400 hover:text-[#111111] hover:bg-slate-100 rounded-lg transition-colors" title="View Full Profile">
                          <Eye className="w-5 h-5" />
                        </button>
                        <button onClick={() => { setSelectedSeller(seller); setIsEditing(true); }} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit Seller">
                          <Edit2 className="w-5 h-4" />
                        </button>
                        <button onClick={() => {
                          if(seller.status === 'suspended') {
                            handleSuspend(seller);
                          } else {
                            setSelectedSeller(seller);
                            setIsSuspending(true);
                          }
                        }} className={`p-2 rounded-lg transition-colors ${seller.status === 'suspended' ? 'text-green-600 hover:bg-green-50' : 'text-slate-400 hover:text-red-600 hover:bg-red-50'}`} title={seller.status === 'suspended' ? 'Activate' : 'Suspend'}>
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
              <button onClick={() => { setSelectedSeller(null); setIsEditing(false); setIsSuspending(false); }} className="w-8 h-8 flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full font-bold">✕</button>
            </div>
            
            <div className="p-8">
              {isEditing ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase">Business Name</label>
                      <input
                        type="text"
                        value={editForm.business_name}
                        onChange={e => setEditForm({...editForm, business_name: e.target.value})}
                        className="w-full mt-1 h-12 px-4 border rounded-xl font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase">Username / Slug</label>
                      <input
                        type="text"
                        value={editForm.username}
                        onChange={e => setEditForm({...editForm, username: e.target.value})}
                        className="w-full mt-1 h-12 px-4 border rounded-xl font-bold"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase">Email Address</label>
                      <input
                        type="email"
                        value={editForm.email}
                        onChange={e => setEditForm({...editForm, email: e.target.value})}
                        className="w-full mt-1 h-12 px-4 border rounded-xl font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase">Category</label>
                      <input
                        type="text"
                        value={editForm.category}
                        onChange={e => setEditForm({...editForm, category: e.target.value})}
                        className="w-full mt-1 h-12 px-4 border rounded-xl font-bold"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">Country Code</label>
                      <input
                        type="text"
                        value={editForm.whatsapp_country_code}
                        onChange={e => setEditForm({...editForm, whatsapp_country_code: e.target.value})}
                        className="w-full mt-1 h-12 px-4 border rounded-xl font-bold"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="text-xs font-bold text-slate-500 uppercase">WhatsApp Number</label>
                      <input
                        type="text"
                        value={editForm.whatsapp_number}
                        onChange={e => setEditForm({...editForm, whatsapp_number: e.target.value})}
                        className="w-full mt-1 h-12 px-4 border rounded-xl font-bold"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 justify-end pt-4">
                    <button onClick={() => setIsEditing(false)} className="px-4 py-2 border rounded-xl font-bold text-sm">Cancel</button>
                    <button onClick={handleUpdateSeller} className="px-4 py-2 bg-slate-900 text-white rounded-xl font-bold text-sm">Save Changes</button>
                  </div>
                </div>
              ) : isSuspending ? (
                <div className="space-y-6">
                   <div className="bg-red-50 p-6 rounded-2xl border border-red-100">
                      <h4 className="text-red-800 font-extrabold text-lg mb-2">Suspend Account</h4>
                      <p className="text-red-600 text-sm font-medium mb-4">Provide a reason for suspending this seller. This will be sent to them via email.</p>
                      <textarea
                        value={suspensionReason}
                        onChange={(e) => setSuspensionReason(e.target.value)}
                        placeholder="e.g. Violation of platform policies, selling prohibited items..."
                        className="w-full h-32 p-4 border border-red-200 rounded-xl outline-none focus:ring-2 ring-red-500/20 font-medium"
                      />
                   </div>
                   <div className="flex justify-end gap-3">
                     <button onClick={() => setIsSuspending(false)} className="px-6 py-3 rounded-xl font-bold text-sm bg-slate-100">Cancel</button>
                     <button
                        onClick={() => handleSuspend(selectedSeller)}
                        disabled={!suspensionReason.trim() || loading}
                        className="px-6 py-3 rounded-xl font-bold text-sm bg-red-600 text-white disabled:opacity-50"
                      >
                        {loading ? 'Processing...' : 'Confirm Suspension'}
                     </button>
                   </div>
                </div>
              ) : (
                <>
                  <div className="flex flex-col md:flex-row gap-8 items-start">
                    <div className="w-32 h-32 rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center text-5xl font-extrabold text-slate-300">
                      {selectedSeller.profile_image ? (
                        <img src={selectedSeller.profile_image} className="w-full h-full object-cover" />
                      ) : (selectedSeller.business_name || 'S').charAt(0)}
                    </div>

                    <div className="flex-1 space-y-4 w-full">
                      <div>
                        <h2 className="text-3xl font-extrabold text-[#0F172A] leading-tight">{selectedSeller.business_name || "Unnamed Store"}</h2>
                        <a href={`/${selectedSeller.username}`} target="_blank" className="text-[#111111] font-bold hover:underline flex items-center gap-1 mt-1">
                          zoopcart.com/{selectedSeller.username} <ExternalLink className="w-3 h-3" />
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
                          <span className="text-slate-500 font-medium">Email:</span>
                          <span className="font-bold text-slate-900 lowercase">{selectedSeller.email || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500 font-medium">Category:</span>
                          <span className="font-bold text-slate-900">{selectedSeller.category || 'Other'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                      <div className="flex items-center gap-3 mb-4">
                        <ShoppingBag className="w-5 h-5 text-[#111111]" />
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
                        <div className="flex justify-between items-center">
                          <span className="text-slate-500 font-medium">Seller ID:</span>
                          <span className="text-[10px] font-mono text-slate-400">{selectedSeller.id}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap justify-end gap-3 border-t border-slate-100 pt-6">
                     <button onClick={() => {
                        const message = encodeURIComponent(`Hello ${selectedSeller.business_name}, this is Zoopcart Admin.`);
                        window.open(`https://wa.me/${selectedSeller.whatsapp_country_code}${selectedSeller.whatsapp_number}?text=${message}`, '_blank');
                     }} className="px-6 py-3 rounded-xl font-bold text-sm bg-green-50 text-green-700 hover:bg-green-100 flex items-center gap-2">
                       <Phone className="w-4 h-4" /> WhatsApp Seller
                     </button>
                     <button onClick={() => setIsEditing(true)} className="px-6 py-3 rounded-xl font-bold text-sm bg-slate-100 hover:bg-slate-200 text-slate-800 flex items-center gap-2">
                       <Edit2 className="w-4 h-4" /> Edit Details
                     </button>
                     <button onClick={() => {
                        if (selectedSeller.status === 'suspended') {
                          handleSuspend(selectedSeller);
                        } else {
                          setIsSuspending(true);
                        }
                     }} className={`px-6 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${selectedSeller.status === 'suspended' ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-red-50 text-red-600 hover:bg-red-100'}`}>
                       <Ban className="w-4 h-4" /> {selectedSeller.status === 'suspended' ? 'Re-activate Account' : 'Suspend Account'}
                     </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
