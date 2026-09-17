"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Search, MoreVertical, Edit2, Ban, ExternalLink } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function AdminSellersPage() {
  const [sellers, setSellers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSellers() {
      const { data } = await supabase.from('businesses').select('*').order('created_at', { ascending: false });
      if (data) setSellers(data);
      setLoading(false);
    }
    loadSellers();
  }, []);

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-[#0F172A]">Manage Sellers</h2>
          <p className="text-sm text-slate-500 mt-1">View and manage all store owners on Zypcart.</p>
        </div>
        <button className="bg-blue-600 text-white text-sm font-bold px-4 py-2 rounded-xl shadow-md hover:bg-blue-700">
          + Invite Seller
        </button>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input placeholder="Search by name, username, phone..." className="w-full pl-9 h-12 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500" />
        </div>
        <select className="bg-white border border-slate-200 text-sm font-semibold text-[#0F172A] rounded-xl px-4 h-12 outline-none">
          <option>All Status</option>
          <option>Active</option>
          <option>Suspended</option>
        </select>
      </div>

      <Card className="bg-white border-slate-200 shadow-sm rounded-2xl border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
              <tr>
                <th className="p-4 pl-6">Business Name</th>
                <th className="p-4">Contact</th>
                <th className="p-4">Category</th>
                <th className="p-4">Joined</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right pr-6">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan={6} className="p-8 text-center text-slate-500">Loading sellers...</td></tr>
              ) : sellers.length === 0 ? (
                <tr><td colSpan={6} className="p-8 text-center text-slate-500">No sellers found.</td></tr>
              ) : (
                sellers.map((seller) => (
                  <tr key={seller.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center font-bold text-slate-400">
                          {seller.profile_image ? (
                            <img src={seller.profile_image} className="w-full h-full object-cover" />
                          ) : seller.business_name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-extrabold text-[#0F172A]">{seller.business_name}</div>
                          <div className="text-xs font-medium text-slate-500">zypcart.com/{seller.username}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-[#0F172A]">+{seller.whatsapp_country_code || '91'} {seller.whatsapp_number || 'N/A'}</div>
                    </td>
                    <td className="p-4 text-slate-500 font-medium">
                      {seller.category || 'N/A'}
                    </td>
                    <td className="p-4 text-slate-500 font-medium">
                      {new Date(seller.created_at).toLocaleDateString()}
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
                        <a href={`/${seller.username}`} target="_blank" className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                        <button className="p-2 text-slate-400 hover:text-[#0F172A] hover:bg-slate-100 rounded-lg transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <Ban className="w-4 h-4" />
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
    </div>
  );
}
