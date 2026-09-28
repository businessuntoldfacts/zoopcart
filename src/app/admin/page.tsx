"use client";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Users, ShoppingBag, Store, Activity, IndianRupee, Calendar, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function AdminDashboard() {
  const [range, setRange] = useState("7d");
  const [stats, setStats] = useState({
    stores: 0,
    orders: 0,
    volume: 0,
    activeStores: 0,
    chartData: [] as number[],
    chartLabels: [] as string[]
  });

  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  const loadStats = async (selectedRange: string) => {
    try {
      setLoading(true);
      setErrorMsg(null);
      const response = await fetch(`/api/admin/stats?range=${selectedRange}`);
      const data = await response.json();

      if (data.success) {
        setStats(data.stats);
        setRecentActivity(data.stats.activities || []);
      } else {
        setErrorMsg(data.error || "Failed to load dynamic analytics");
      }
    } catch (error: any) {
      console.error("Error loading stats:", error);
      setErrorMsg(error.message || "Network error loading stats");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats(range);
  }, [range]);

  useEffect(() => {
    // Realtime integration
    const channel = supabase.channel('admin-stats-live-v2')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => loadStats(range))
      .on('postgres_changes', { event: '*', schema: 'public', table: 'businesses' }, () => loadStats(range))
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [range]);

  // Simple SVG Path generator for chart
  const maxVal = Math.max(...stats.chartData, 5);
  const chartPoints = stats.chartData.map((val, i) => {
    const totalSteps = stats.chartData.length > 1 ? stats.chartData.length - 1 : 1;
    const x = (i / totalSteps) * 90;
    const y = 80 - (val / maxVal * 60);
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-2xl font-black text-[#0F172A] tracking-tight">Platform Analytics</h2>
          <p className="text-sm text-slate-500 mt-1">Real-time metrics & multi-range performance tracking.</p>
        </div>

        {/* Time Filters Selector */}
        <div className="flex flex-wrap items-center gap-2 bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/50">
          {[
            { id: "today", label: "Today" },
            { id: "yesterday", label: "Yesterday" },
            { id: "7d", label: "7 Days" },
            { id: "30d", label: "30 Days" },
            { id: "90d", label: "90 Days" },
            { id: "lifetime", label: "Lifetime" }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setRange(item.id)}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all duration-200 ${
                range === item.id
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-900 hover:bg-white/40"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-700 text-sm font-bold">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <div>{errorMsg}. Make sure SUPABASE_SERVICE_ROLE_KEY is set correctly in Vercel settings and Redeployed.</div>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center p-24 bg-white rounded-3xl border border-slate-100 shadow-sm space-y-4">
          <div className="animate-spin rounded-full h-9 w-9 border-b-2 border-slate-900"></div>
          <span className="font-bold text-sm text-slate-500 animate-pulse">Syncing Advanced Metrics...</span>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-white border-slate-200/60 shadow-sm rounded-3xl p-5 border group hover:border-slate-900 transition-all duration-300">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="text-2xl font-black text-[#0F172A] tracking-tight">{stats.stores}</div>
                  <div className="text-[10px] font-extrabold text-slate-400 uppercase mt-1 tracking-wider">Total Stores</div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-slate-50 text-[#111111] flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-colors duration-300">
                  <Store className="w-5 h-5" />
                </div>
              </div>
            </Card>

            <Card className="bg-white border-slate-200/60 shadow-sm rounded-3xl p-5 border group hover:border-slate-900 transition-all duration-300">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="text-2xl font-black text-[#0F172A] tracking-tight">{stats.orders}</div>
                  <div className="text-[10px] font-extrabold text-slate-400 uppercase mt-1 tracking-wider">Orders in Range</div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-slate-50 text-[#111111] flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-colors duration-300">
                  <ShoppingBag className="w-5 h-5" />
                </div>
              </div>
            </Card>

            <Card className="bg-white border-slate-200/60 shadow-sm rounded-3xl p-5 border group hover:border-green-600 transition-all duration-300">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="text-2xl font-black text-[#0F172A] tracking-tight">₹{stats.volume.toLocaleString()}</div>
                  <div className="text-[10px] font-extrabold text-slate-400 uppercase mt-1 tracking-wider">Estimated GMV</div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center group-hover:bg-green-600 group-hover:text-white transition-colors duration-300">
                  <IndianRupee className="w-5 h-5" />
                </div>
              </div>
            </Card>

            <Card className="bg-white border-slate-200/60 shadow-sm rounded-3xl p-5 border group hover:border-orange-600 transition-all duration-300">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="text-2xl font-black text-[#0F172A] tracking-tight">{stats.activeStores}</div>
                  <div className="text-[10px] font-extrabold text-slate-400 uppercase mt-1 tracking-wider">Active Sellers</div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center group-hover:bg-orange-600 group-hover:text-white transition-colors duration-300">
                  <Users className="w-5 h-5" />
                </div>
              </div>
            </Card>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card className="bg-white border-slate-200 shadow-sm rounded-3xl p-6 border flex flex-col min-h-[350px]">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="font-bold text-[#0F172A] text-lg">Order Growth Timeline</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Visualized charts for selected period</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-black text-slate-900">{stats.orders}</div>
                    <div className="text-[9px] font-bold text-slate-400 uppercase">Filtered Orders</div>
                  </div>
                </div>

                <div className="flex-1 w-full min-h-[180px] relative px-2 mb-4 flex items-end">
                  {stats.chartData.length > 0 ? (
                    <svg className="w-full h-[160px]" preserveAspectRatio="none" viewBox="0 0 90 80">
                      <polyline
                        fill="none"
                        stroke="#111111"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        points={chartPoints}
                      />
                      {stats.chartData.map((val, i) => {
                        const totalSteps = stats.chartData.length > 1 ? stats.chartData.length - 1 : 1;
                        const cx = (i / totalSteps) * 90;
                        const cy = 80 - (val / maxVal * 60);
                        return (
                          <circle
                            key={i}
                            cx={cx}
                            cy={cy}
                            r="2.5"
                            fill="#111111"
                          />
                        );
                      })}
                    </svg>
                  ) : (
                    <div className="w-full text-center text-xs font-semibold text-slate-400 pb-12">
                      No chart data available for this range
                    </div>
                  )}
                </div>

                <div className="flex justify-between px-1 border-t border-slate-100 pt-4 text-[9px] font-bold text-slate-400 uppercase">
                  <span>Start Range</span>
                  <span>End Range (Today)</span>
                </div>
              </Card>

              {/* Live System Activity Feed */}
              <Card className="bg-white border-slate-200 shadow-sm rounded-3xl p-6 border">
                <h3 className="font-bold text-[#0F172A] mb-6 flex items-center gap-2 text-lg">
                  <Activity className="w-5 h-5 text-green-500 animate-pulse" /> Real-time Activity Feed
                </h3>
                <div className="space-y-3">
                  {recentActivity.map((act, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-slate-50/50 hover:bg-slate-50 rounded-2xl border border-slate-100/50 text-sm transition-colors duration-200">
                      <div className="flex items-center gap-4">
                        <span className={`w-3 h-3 rounded-full shadow-sm ${act.type === 'order' ? 'bg-blue-500' : 'bg-emerald-500'}`} />
                        <div>
                          <span className="font-semibold text-slate-600">{act.type === 'order' ? 'New Order from ' : 'New Store registered: '}</span>
                          <strong className="text-slate-900 font-bold">{act.name}</strong>
                          {act.store && <span className="text-xs text-slate-400 italic"> ({act.store})</span>}
                        </div>
                      </div>
                      <span className="text-[11px] text-slate-400 font-bold bg-white px-2.5 py-1 rounded-xl border border-slate-100">
                        {new Date(act.time).toLocaleDateString([], { month: 'short', day: 'numeric' })} - {new Date(act.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))}
                  {recentActivity.length === 0 && (
                    <p className="text-sm text-slate-400 text-center py-8">No recent activity matching filters.</p>
                  )}
                </div>
              </Card>
            </div>

            <div className="lg:col-span-1">
              <Card className="bg-white border-slate-200 shadow-sm rounded-3xl border flex flex-col p-6 space-y-4">
                <h3 className="font-bold text-[#0F172A] text-lg">Quick Actions</h3>
                <div className="space-y-3">
                  <button onClick={() => window.location.href='/admin/sellers'} className="w-full bg-slate-50 hover:bg-slate-900 hover:text-white border border-slate-200/70 p-4 rounded-2xl flex items-center justify-between text-sm font-bold text-[#0F172A] transition-all duration-200 group">
                    <span>Manage Stores</span>
                    <span className="text-slate-400 group-hover:translate-x-1 transition-transform">→</span>
                  </button>
                  <button onClick={() => window.location.href='/admin/orders'} className="w-full bg-slate-50 hover:bg-slate-900 hover:text-white border border-slate-200/70 p-4 rounded-2xl flex items-center justify-between text-sm font-bold text-[#0F172A] transition-all duration-200 group">
                    <span>View Recent Orders</span>
                    <span className="text-slate-400 group-hover:translate-x-1 transition-transform">→</span>
                  </button>
                  <button onClick={() => window.location.href='/admin/announcements'} className="w-full bg-slate-50 hover:bg-slate-900 hover:text-white border border-slate-200/70 p-4 rounded-2xl flex items-center justify-between text-sm font-bold text-[#0F172A] transition-all duration-200 group">
                    <span>Broadcast System Updates</span>
                    <span className="text-slate-400 group-hover:translate-x-1 transition-transform">→</span>
                  </button>
                </div>
              </Card>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
