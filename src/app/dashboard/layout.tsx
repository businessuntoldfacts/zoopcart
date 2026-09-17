"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ShoppingBag, Store, LineChart, Settings, LogOut, HelpCircle, Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [businessName, setBusinessName] = useState("Store Owner");

  useEffect(() => {
    async function loadUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: business } = await supabase.from('businesses').select('business_name').eq('user_id', user.id).single();
        if (business?.business_name) {
          setBusinessName(business.business_name);
        }
      }
    }
    loadUser();
  }, []);

  const navigation = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Orders", href: "/dashboard/orders", icon: ShoppingBag, badge: 3 },
    { name: "Products", href: "/dashboard/products", icon: Store },
    { name: "Analytics", href: "/dashboard/analytics", icon: LineChart },
    { name: "Store", href: "/dashboard/store", icon: Settings },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <div className="flex h-screen bg-zyp-bg text-zyp-textPrimary overflow-hidden font-sans">
      {/* Sidebar (Desktop) - Dark Navy theme like Figma */}
      <aside className="hidden md:flex w-[260px] flex-col bg-[#0F172A] text-slate-300 shrink-0">
        <div className="p-6">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded flex items-center justify-center font-bold text-zyp-primary text-xl tracking-tighter italic">e</div>
            <span className="font-bold text-xl text-white tracking-tight">Zypcart</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group",
                  isActive
                    ? "bg-zyp-primary text-white shadow-md shadow-zyp-primary/20"
                    : "hover:bg-white/10 hover:text-white"
                )}
              >
                <Icon className={cn("w-5 h-5", isActive ? "text-white" : "text-slate-400 group-hover:text-white")} />
                {item.name}
                {item.badge && (
                  <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 mt-auto">
          <button className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:bg-white/10 hover:text-white transition-colors mb-2">
            <HelpCircle className="w-5 h-5" />
            Help
          </button>
          <button onClick={handleLogout} className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:bg-white/10 hover:text-red-400 transition-colors">
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 flex flex-col mb-16 md:mb-0">
        {/* Header matching Figma */}
        <header className="h-[72px] border-b border-zyp-border flex items-center justify-between px-6 md:px-8 bg-white shrink-0">
          <div className="flex items-center md:hidden">
             <div className="w-6 h-6 bg-zyp-primary rounded flex items-center justify-center font-bold text-white text-sm tracking-tighter italic mr-2">e</div>
             <span className="font-bold text-lg text-zyp-textPrimary tracking-tight">Zypcart</span>
          </div>
          
          <div className="hidden md:flex items-center gap-4 flex-1">
             <h1 className="text-xl font-bold text-zyp-textPrimary capitalize">
               {navigation.find((item) => item.href === pathname)?.name || "Dashboard"}
             </h1>
          </div>

          <div className="flex items-center gap-6">
            <button className="relative text-slate-400 hover:text-slate-600 transition-colors hidden sm:block">
              <Bell className="w-5 h-5" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
            <div className="flex items-center gap-3 border-l border-zyp-border pl-6">
              <div className="hidden sm:block text-right">
                <div className="text-sm font-bold text-zyp-textPrimary leading-tight">{businessName}</div>
                <div className="text-xs text-zyp-textMuted font-medium">Seller</div>
              </div>
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-sm font-bold text-zyp-primary border border-blue-200">
                {businessName.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </header>
        
        <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-zyp-bg">
          <div className="max-w-[1200px] mx-auto">
            {children}
          </div>
        </div>
      </main>

      {/* Mobile Bottom Navigation (Light theme) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-zyp-border flex items-center justify-around p-2 z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] pb-safe">
        {navigation.slice(0, 5).map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg text-[10px] font-bold transition-colors ${
                isActive 
                  ? "text-zyp-primary" 
                  : "text-slate-400"
              }`}
            >
              <Icon className={cn("w-5 h-5", isActive ? "fill-blue-50/50" : "")} />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
