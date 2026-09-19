"use client";
import { useDashboardData } from "@/lib/useDashboardData";

import Link from "next/link";
import Logo from "@/components/Logo";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ShoppingBag, Store, LineChart, Settings, LogOut, HelpCircle, Bell, ArrowUpRight, User, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [theme, setTheme] = useState('light');
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = localStorage.getItem('zoopcart-theme') || 'light';
    setTheme(t);
    const handleTheme = () => setTheme(localStorage.getItem('zoopcart-theme') || 'light');
    window.addEventListener('theme-changed', handleTheme);

    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener('theme-changed', handleTheme);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const { business } = useDashboardData();
  const [businessData, setBusinessData] = useState<{name: string, username: string, image: string | null}>({
    name: "Store Owner",
    username: "",
    image: null
  });

  useEffect(() => {
    if (business) {
      setBusinessData({
        name: business.business_name || "Store Owner",
        username: business.username || "",
        image: business.profile_image || null
      });
    }
  }, [business]);

  const navigation = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Orders", href: "/dashboard/orders", icon: ShoppingBag, badge: 0 },
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
            <Logo />
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
                    ? "bg-pink-500 text-slate-900 shadow-md shadow-pink-500/20"
                    : "hover:bg-white/10 hover:text-slate-900"
                )}
              >
                <Icon className={cn("w-5 h-5", isActive ? "text-slate-900" : "text-slate-500 group-hover:text-slate-900")} />
                {item.name}
                {item.badge && (
                  <span className="ml-auto bg-red-500 text-slate-900 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 mt-auto">
          <button className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-500 hover:bg-white/10 hover:text-slate-900 transition-colors mb-2">
            <HelpCircle className="w-5 h-5" />
            Help
          </button>
          <button onClick={handleLogout} className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-500 hover:bg-white/10 hover:text-red-400 transition-colors">
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 min-w-0 flex flex-col mb-16 md:mb-0 ${theme === "dark" ? "zyp-dark-mode" : ""}`}>
        <style dangerouslySetInnerHTML={{__html: `\n          .zyp-dark-mode {\n            filter: invert(1) hue-rotate(180deg);\n            background-color: #000;\n            transition: filter 0.5s ease;\n          }\n          .zyp-dark-mode img, .zyp-dark-mode svg, .zyp-dark-mode [data-theme-ignore] {\n            filter: invert(1) hue-rotate(180deg);\n          }\n        `}} />
        <header className="h-[72px] border-b border-zyp-border flex items-center justify-between px-6 md:px-8 bg-white shrink-0 relative z-50">
          <div className="flex items-center md:hidden">
            <Link href="/dashboard" className="flex items-center">
              <Logo darkText={true} />
            </Link>
          </div>
          
          <div className="hidden md:flex items-center gap-4 flex-1">
             <h1 className="text-xl font-bold text-slate-900 capitalize">
               {navigation.find((item) => pathname.startsWith(item.href) && (item.href !== "/dashboard" || pathname === "/dashboard"))?.name || "Dashboard"}
             </h1>
          </div>

          <div className="flex items-center gap-6">
            <button className="relative text-slate-500 hover:text-slate-600 transition-colors hidden sm:block">
              <Bell className="w-5 h-5" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
            <div className="flex items-center gap-3 border-l border-zyp-border pl-6 relative" ref={profileRef}>
              <div className="hidden sm:block text-right">
                <div className="text-sm font-bold text-slate-900 leading-tight">{businessData.name}</div>
                <div className="text-xs text-slate-500 font-medium">Seller</div>
              </div>
              <button 
                onClick={() => setProfileOpen(!profileOpen)}
                className="relative w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-sm font-bold text-slate-700 border border-slate-200 hover:ring-2 hover:ring-pink-500 transition-all shadow-sm group cursor-pointer"
              >
                <div className="w-full h-full rounded-full overflow-hidden">
                  {businessData.image ? (
                    <img src={businessData.image} alt={businessData.name} className="w-full h-full object-cover" />
                  ) : (
                    businessData.name.charAt(0).toUpperCase()
                  )}
                </div>
              </button>

              {profileOpen && (
                <div className="absolute top-12 right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100 py-1 flex flex-col z-50">
                   <Link href={businessData.username ? `/${businessData.username}` : '#'} onClick={() => setProfileOpen(false)} className="px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                     <ExternalLink className="w-4 h-4" /> View Store
                   </Link>
                   <Link href="/dashboard/settings" onClick={() => setProfileOpen(false)} className="px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                     <Settings className="w-4 h-4" /> Settings
                   </Link>
                   <div className="h-px bg-slate-100 my-1"></div>
                   <button onClick={handleLogout} className="px-4 py-2 text-sm font-bold text-red-600 hover:bg-slate-50 flex items-center gap-2 text-left w-full">
                     <LogOut className="w-4 h-4" /> Logout
                   </button>
                </div>
              )}
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
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-[90] pb-safe">
        <div className="flex justify-around items-center h-16">
          {navigation.map((item) => {
            const isActive = pathname.startsWith(item.href) && (item.href !== "/dashboard" || pathname === "/dashboard");
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center w-full h-full space-y-1 relative",
                  isActive ? "text-pink-600" : "text-slate-500"
                )}
              >
                {isActive && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-pink-500 rounded-b-full"></div>
                )}
                <div className="relative">
                  <Icon className={cn("w-5 h-5", isActive && "fill-current/10")} />
                  {item.badge && (
                    <span className="absolute -top-1 -right-2 bg-red-500 text-slate-900 text-[9px] font-bold px-1 rounded-full border border-white">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-semibold">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
