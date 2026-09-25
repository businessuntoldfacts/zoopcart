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
    document.documentElement.classList.toggle('dark', t === 'dark');

    const handleTheme = () => {
      const newTheme = localStorage.getItem('zoopcart-theme') || 'light';
      setTheme(newTheme);
      document.documentElement.classList.toggle('dark', newTheme === 'dark');
    };
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

  const { business, products, orders, loading } = useDashboardData();
  const [businessData, setBusinessData] = useState<{name: string, username: string, image: string | null}>({
    name: "Store Owner",
    username: "",
    image: null
  });
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [announcementsOpen, setAnnouncementsOpen] = useState(false);
  const [platformSettings, setPlatformSettings] = useState<any>(null);
  const announcementsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadGlobalSettings() {
      const { data } = await supabase.from('platform_settings').select('*').single();
      if (data) setPlatformSettings(data);
    }
    loadGlobalSettings();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (announcementsRef.current && !announcementsRef.current.contains(event.target as Node)) {
        setAnnouncementsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!loading && !business) {
      // If user is logged in but has no business profile, send to signup to complete setup
      router.replace('/signup');
    }

    if (!loading && business && localStorage.getItem("setup_pending") === "true" && pathname !== "/dashboard/settings/store") {
      router.replace('/dashboard/settings/store');
    }

    if (business) {
      setBusinessData({
        name: business.business_name || "Store Owner",
        username: business.username || "",
        image: business.profile_image || null
      });

      // 1. Initial Fetch
      const fetchAnnouncements = async () => {
        const { data } = await supabase
          .from('announcements')
          .select('*')
          .eq('is_active', true)
          .or(`business_id.is.null,business_id.eq.${business.id}`)
          .order('created_at', { ascending: false })
          .limit(5);
        if (data) setAnnouncements(data);
      };

      fetchAnnouncements();

      // 2. Realtime Subscription (Live Changes)
      const channel = supabase
        .channel('schema-db-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'announcements'
          },
          () => {
            fetchAnnouncements(); // Refresh list when any change happens
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'platform_settings'
          },
          (payload) => {
            setPlatformSettings(payload.new); // Update banner live
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [business, loading, router]);

  if (loading || !business) {
    return (
      <div className="flex fixed inset-0 items-center justify-center bg-white z-[9999]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-black"></div>
          <p className="text-sm font-bold text-slate-500">Loading your store...</p>
        </div>
      </div>
    );
  }

  const newOrdersCount = orders?.filter((o: any) => o.status === 'new' || o.status === 'pending').length;

  const navigation = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Orders", href: "/dashboard/orders", icon: ShoppingBag, badge: newOrdersCount > 0 ? newOrdersCount : undefined },
    { name: "Products", href: "/dashboard/products", icon: Store },
    { name: "Analytics", href: "/dashboard/analytics", icon: LineChart },
    { name: "More", href: "/dashboard/settings", icon: Settings },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.replace("/");
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
                    ? "bg-[#111111] text-white shadow-md shadow-black/20"
                    : "hover:bg-white/10 hover:text-slate-900"
                )}
              >
                <Icon className={cn("w-5 h-5", isActive ? "text-white" : "text-slate-500 group-hover:text-slate-900")} />
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
      <main className="flex-1 min-w-0 flex flex-col mb-16 md:mb-0 bg-slate-50 dark:bg-slate-900">
        <header className="h-[72px] border-b border-zyp-border dark:border-slate-800 flex items-center justify-between px-6 md:px-8 bg-white dark:bg-slate-800 shrink-0 relative z-50">
          <div className="flex items-center md:hidden">
            <Link href="/dashboard" className="flex items-center">
              <Logo darkText={true} />
            </Link>
          </div>
          
          <div className="hidden md:flex items-center gap-4 flex-1">
             <h1 className="text-xl font-bold text-slate-900 dark:text-white capitalize">
               {navigation.find((item) => pathname.startsWith(item.href) && (item.href !== "/dashboard" || pathname === "/dashboard"))?.name || "Dashboard"}
             </h1>
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            <div className="relative" ref={announcementsRef}>
              <button
                onClick={() => setAnnouncementsOpen(!announcementsOpen)}
                className="relative text-slate-500 dark:text-slate-400 hover:text-[#111111] dark:hover:text-white transition-colors p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <Bell className="w-5 h-5" />
                {announcements.length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-slate-800"></span>
                )}
              </button>

              {announcementsOpen && (
                <div className="absolute top-10 right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 py-3 z-[100] flex flex-col">
                  <div className="px-4 pb-2 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                    <span className="font-extrabold text-sm text-slate-900 dark:text-white">Platform Notifications</span>
                    <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-bold">{announcements.length} New</span>
                  </div>
                  <div className="max-h-64 overflow-y-auto divide-y divide-slate-50 dark:divide-slate-700">
                    {announcements.length === 0 ? (
                      <div className="p-6 text-center text-xs text-slate-400 font-medium">
                        No new announcements at this time.
                      </div>
                    ) : (
                      announcements.map((ann) => (
                        <div key={ann.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors flex flex-col gap-1">
                          <div className="flex items-center justify-between">
                            <span className={cn(
                              "text-[9px] font-extrabold px-1.5 py-0.5 rounded-full uppercase tracking-wider",
                              ann.type === 'warning' ? "bg-orange-50 text-orange-600" :
                              ann.type === 'success' ? "bg-green-50 text-green-600" :
                              ann.type === 'promotion' ? "bg-purple-50 text-purple-600" :
                              "bg-blue-50 text-blue-600"
                            )}>
                              {ann.type || 'info'}
                            </span>
                            <span className="text-[9px] font-medium text-slate-400">
                              {new Date(ann.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <h4 className="font-bold text-xs text-slate-900 dark:text-white leading-snug">{ann.title}</h4>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5">{ann.content}</p>
                          {ann.link && (
                            <a
                              href={ann.link}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[11px] font-bold text-blue-600 hover:underline mt-1 flex items-center gap-0.5"
                            >
                              Learn More <ArrowUpRight className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 border-l border-zyp-border dark:border-slate-700 pl-4 sm:pl-6 relative" ref={profileRef}>
              <div className="hidden sm:block text-right">
                <div className="text-sm font-bold text-slate-900 dark:text-white leading-tight">{businessData.name}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Seller</div>
              </div>
              <button 
                onClick={() => setProfileOpen(!profileOpen)}
                className="relative w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-sm font-extrabold text-white shadow-md hover:shadow-lg transition-all ring-2 ring-white dark:ring-slate-800 hover:ring-blue-100 group cursor-pointer overflow-hidden"
              >
                {businessData.image ? (
                  <img src={businessData.image} alt={businessData.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-tr from-[#111111] to-black flex items-center justify-center">
                    {businessData.name ? businessData.name.charAt(0).toUpperCase() : "S"}
                  </div>
                )}
              </button>

              {profileOpen && (
                <div className="absolute top-12 right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700 py-1 flex flex-col z-50">
                   <Link href={businessData.username ? `/${businessData.username}` : '#'} onClick={() => setProfileOpen(false)} className="px-4 py-2 text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2">
                     <ExternalLink className="w-4 h-4" /> View Store
                   </Link>
                   <Link href="/dashboard/settings" onClick={() => setProfileOpen(false)} className="px-4 py-2 text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2">
                     <Settings className="w-4 h-4" /> Settings
                   </Link>
                   <div className="h-px bg-slate-100 dark:bg-slate-700 my-1"></div>
                   <button onClick={handleLogout} className="px-4 py-2 text-sm font-bold text-red-600 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2 text-left w-full">
                     <LogOut className="w-4 h-4" /> Logout
                   </button>
                </div>
              )}
            </div>
          </div>
        </header>
        
        <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50 dark:bg-slate-900">
          <div className="max-w-[1200px] mx-auto">
            {platformSettings?.enable_banner && platformSettings?.global_banner && (
              <div className="mb-6 p-4 bg-amber-500 border border-amber-600 rounded-2xl text-white font-extrabold text-sm flex items-center gap-3 shadow-md shadow-amber-500/10 animate-pulse">
                <Bell className="w-5 h-5 shrink-0" />
                <span>{platformSettings.global_banner}</span>
              </div>
            )}
            {children}
          </div>
        </div>
      </main>

      {/* Mobile Bottom Navigation (Light theme) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 z-[90] pb-safe">
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
                  isActive ? "text-[#111111]" : "text-slate-500"
                )}
              >
                {isActive && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-[#111111] rounded-b-full"></div>
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
