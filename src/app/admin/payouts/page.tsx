"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Search, IndianRupee, CheckCircle, Clock } from "lucide-react";

export default function AdminPayoutsPage() {
  const [payouts] = useState([
    { id: "PO-1002", store: "Sneha's Bakery", amount: 4500, status: "pending", date: "Today, 10:30 AM", method: "UPI" },
    { id: "PO-1001", store: "Urban Threads", amount: 12500, status: "completed", date: "Yesterday", method: "Bank Transfer" },
    { id: "PO-1000", store: "Gift Hub", amount: 2100, status: "completed", date: "Sep 15, 2026", method: "UPI" },
  ]);

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-[#0F172A]">Seller Payouts</h2>
          <p className="text-sm text-slate-500 mt-1">Manage and track settlements for all store owners.</p>
        </div>
        <button className="bg-blue-600 text-white text-sm font-bold px-4 py-2 rounded-xl shadow-md hover:bg-blue-700">
          Process Payouts
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 rounded-3xl border-slate-100 shadow-sm bg-white">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-500">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-500">Pending</p>
              <h3 className="text-2xl font-extrabold text-[#0F172A]">₹4,500</h3>
            </div>
          </div>
        </Card>
        <Card className="p-6 rounded-3xl border-slate-100 shadow-sm bg-white">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center text-green-500">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-500">Completed</p>
              <h3 className="text-2xl font-extrabold text-[#0F172A]">₹14,600</h3>
            </div>
          </div>
        </Card>
        <Card className="p-6 rounded-3xl border-slate-100 shadow-sm bg-white">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500">
              <IndianRupee className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-500">Total Processed</p>
              <h3 className="text-2xl font-extrabold text-[#0F172A]">₹19,100</h3>
            </div>
          </div>
        </Card>
      </div>

      <Card className="rounded-3xl border-slate-100 shadow-sm bg-white overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="text" placeholder="Search payouts..." className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500" />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50/50 text-slate-500 font-bold">
              <tr>
                <th className="px-6 py-4 rounded-tl-2xl">ID</th>
                <th className="px-6 py-4">Store</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Method</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 rounded-tr-2xl text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {payouts.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-700">{p.id}</td>
                  <td className="px-6 py-4 font-bold text-[#0F172A]">{p.store}</td>
                  <td className="px-6 py-4 font-extrabold text-slate-900">₹{p.amount.toLocaleString()}</td>
                  <td className="px-6 py-4 font-medium text-slate-600">{p.method}</td>
                  <td className="px-6 py-4 font-medium text-slate-500">{p.date}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${p.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {p.status === 'pending' ? (
                      <button className="text-blue-600 font-bold hover:text-blue-800 text-sm">Pay Now</button>
                    ) : (
                      <button className="text-slate-400 font-bold hover:text-slate-600 text-sm">Receipt</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
