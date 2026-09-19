"use client";
import Link from "next/link";
import Logo from "@/components/Logo";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, ShoppingBag, Settings, LogOut, Bell, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { logoutAdmin } from "./login/actions";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  if (pathname === '/admin/login') return <>{children}</>;

  const handleLogout = async () => {
    await logoutAdmin();
    window.location.href = "/admin/login";
  };


  const navigation = [
    { name: "Overview", href: "/admin", icon: LayoutDashboard },
    { name: "Sellers", href: "/admin/sellers", icon: Users },
    { name: "All Orders", href: "/admin/orders", icon: ShoppingBag },
    
    { name: "Platform Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden font-sans">
      {/* Admin Sidebar */}
      <aside className="w-[260px] flex-col bg-[#0F172A] text-slate-300 hidden md:flex shrink-0">
        <div className="p-6">
          <Link href="/admin" className="flex items-center gap-2">
            <Logo />
            <div>
              <div className="font-bold text-lg text-white tracking-tight leading-none">Zoopcart</div>
              <div className="text-[10px] text-blue-400 font-bold uppercase tracking-widest mt-1">Super Admin</div>
            </div>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-6">
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
                    ? "bg-blue-600 text-white shadow-md shadow-blue-900/20"
                    : "hover:bg-white/5 hover:text-white"
                )}
              >
                <Icon className={cn("w-5 h-5", isActive ? "text-white" : "text-slate-400 group-hover:text-white")} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 mt-auto">
          <button onClick={handleLogout} className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:bg-white/10 hover:text-red-400 transition-colors">
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-[72px] border-b border-slate-200 flex items-center justify-between px-8 bg-white shrink-0">
          <h1 className="text-xl font-extrabold text-[#0F172A]">
            {navigation.find((item) => item.href === pathname)?.name || "Dashboard"}
          </h1>
          <div className="flex items-center gap-6">
            <button className="relative text-slate-400 hover:text-slate-600">
              <Bell className="w-5 h-5" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
            <div className="flex items-center gap-3 border-l border-slate-200 pl-6">
              <div className="text-right">
                <div className="text-sm font-bold text-[#0F172A] leading-tight">Super Admin</div>
                <div className="text-[10px] text-green-600 font-bold uppercase tracking-widest flex items-center gap-1 justify-end">
                  <Shield className="w-3 h-3" /> System Live
                </div>
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-sm font-bold text-white border-2 border-slate-200">
                A
              </div>
            </div>
          </div>
        </header>
        
        <div className="flex-1 overflow-y-auto p-8 bg-slate-50">
          <div className="max-w-[1200px] mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
