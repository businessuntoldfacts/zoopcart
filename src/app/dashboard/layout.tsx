"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ShoppingBag, Store, LineChart, Settings, LogOut, HelpCircle, Bell, ArrowUpRight } from "lucide-react";
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
  const [theme, setTheme] = useState('light');
  useEffect(() => {
    const t = localStorage.getItem('zypcart-theme') || 'light';
    setTheme(t);
    const handleTheme = () => setTheme(localStorage.getItem('zypcart-theme') || 'light');
    window.addEventListener('theme-changed', handleTheme);
    return () => window.removeEventListener('theme-changed', handleTheme);
  }, []);

  const [businessData, setBusinessData] = useState<{name: string, username: string, image: string | null}>({
    name: "Store Owner",
    username: "",
    image: null
  });

  useEffect(() => {
    async function loadUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: business } = await supabase.from('businesses').select('business_name, username, profile_image').eq('user_id', user.id).single();
        if (business) {
          setBusinessData({
            name: business.business_name || "Store Owner",
            username: business.username || "",
            image: business.profile_image || null
          });
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
    { name: "More", href: "/dashboard/settings", icon: Settings },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <div className="flex h-screen bg-zyp-bg text-zyp-textPrimary overflow-hidden font-sans">
      <aside className="hidden md:flex w-[260px] flex-col bg-[#0F172A] text-slate-300 shrink-0">
        <div className="p-6">
          <Link href="/dashboard" className="flex items-center">
            <img src="/logo.png" alt="Zypcart" className="h-10 object-contain bg-white px-2 py-1 rounded-xl" />
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = pathname.startsWith(item.href) && (item.href !== "/dashboard" || pathname === "/dashboard");
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group",
                  isActive
                    ? "bg-pink-500 text-white shadow-md shadow-pink-500/20"
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
      <main className={`flex-1 min-w-0 flex flex-col mb-16 md:mb-0 ${theme === "dark" ? "zyp-dark-mode" : ""}`}>
        <style dangerouslySetInnerHTML={{__html: `\n          .zyp-dark-mode {\n            filter: invert(1) hue-rotate(180deg);\n            background-color: #000;\n            transition: filter 0.5s ease;\n          }\n          .zyp-dark-mode img, .zyp-dark-mode svg, .zyp-dark-mode [data-theme-ignore] {\n            filter: invert(1) hue-rotate(180deg);\n          }\n        `}} />
        <header className="h-[72px] border-b border-zyp-border flex items-center justify-between px-6 md:px-8 bg-white shrink-0">
          <div className="flex items-center md:hidden">
            <Link href="/dashboard" className="flex items-center">
              <img src="/logo.png" alt="Zypcart" className="h-10 object-contain bg-white px-2 py-1 rounded-xl" />
            </Link>
          </div>
          
          <div className="hidden md:flex items-center gap-4 flex-1">
             <h1 className="text-xl font-bold text-slate-900 capitalize">
               {navigation.find((item) => pathname.startsWith(item.href) && (item.href !== "/dashboard" || pathname === "/dashboard"))?.name || "Dashboard"}
             </h1>
          </div>

          <div className="flex items-center gap-6">
            <button className="relative text-slate-400 hover:text-slate-600 transition-colors hidden sm:block">
              <Bell className="w-5 h-5" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
            <div className="flex items-center gap-3 border-l border-zyp-border pl-6">
              <div className="hidden sm:block text-right">
                <div className="text-sm font-bold text-slate-900 leading-tight">{businessData.name}</div>
                <div className="text-xs text-slate-500 font-medium">Seller</div>
              </div>
              <Link 
                href={businessData.username ? `/${businessData.username}` : '#'} 
                target="_blank"
                className="relative w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-sm font-bold text-slate-700 border border-slate-200 hover:ring-2 hover:ring-pink-500 transition-all shadow-sm group"
              >
                <div className="w-full h-full rounded-full overflow-hidden">
                  {businessData.image ? (
                    <img src={businessData.image} alt={businessData.name} className="w-full h-full object-cover" />
                  ) : (
                    businessData.name.charAt(0).toUpperCase()
                  )}
                </div>
                <div className="absolute -top-1 -right-1 bg-pink-500 text-white p-0.5 rounded-full border-2 border-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                  <ArrowUpRight className="w-3 h-3" />
                </div>
              </Link>
            </div>
          </div>
        </header>
        
        <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50">
          <div className="max-w-[1200px] mx-auto">
            {children}
          </div>
        </div>
      </main>

      {/* Mobile Bottom Navigation (Light theme) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex items-center justify-around p-2 z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] pb-safe">
        {navigation.slice(0, 5).map((item) => {
          const isActive = pathname.startsWith(item.href) && (item.href !== "/dashboard" || pathname === "/dashboard");
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-2xl text-[10px] font-bold transition-all ${
                isActive 
                  ? "bg-pink-500 text-white shadow-md shadow-pink-500/30 -translate-y-1" 
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              <Icon className={cn("w-5 h-5", isActive ? "" : "")} />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}




