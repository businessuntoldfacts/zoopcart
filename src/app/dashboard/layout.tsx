"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ShoppingBag, Store, LineChart, Settings, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const navigation = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Orders", href: "/dashboard/orders", icon: ShoppingBag },
    { name: "Products", href: "/dashboard/products", icon: Store },
    { name: "Store", href: "/dashboard/store", icon: Store },
    { name: "Analytics", href: "/dashboard/analytics", icon: LineChart },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <div className="flex h-screen bg-zyp-bg text-zyp-textPrimary overflow-hidden">
      {/* Sidebar (Desktop) */}
      <aside className="hidden md:flex w-64 border-r border-white/5 flex-col bg-zyp-surface shrink-0">
        <div className="p-6">
          <Link href="/dashboard" className="flex items-center">
            <img src="/logo.jpg" alt="Zypcart" className="h-8 object-contain rounded-md" />
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-[12px] text-sm font-medium transition-colors",
                  isActive
                    ? "bg-zyp-accent/10 text-zyp-accent"
                    : "text-zyp-textMuted hover:bg-white/5 hover:text-white"
                )}
              >
                <Icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/5">
          <button onClick={handleLogout} className="flex w-full items-center gap-3 px-3 py-2.5 rounded-[12px] text-sm font-medium text-zyp-textMuted hover:bg-white/5 hover:text-zyp-danger transition-colors">
            <LogOut className="w-5 h-5" />
            Log out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 flex flex-col mb-16 md:mb-0">
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-4 md:px-8 bg-zyp-surface/50 backdrop-blur-md sticky top-0 z-10 shrink-0">
          <div className="flex items-center md:hidden">
            <img src="/logo.jpg" alt="Zypcart" className="h-6 object-contain rounded-md" />
          </div>
          <h1 className="text-lg font-semibold text-white hidden md:block">
            {navigation.find((item) => item.href === pathname)?.name || "Dashboard"}
          </h1>
          <div className="flex items-center gap-4">
            <Button variant="secondary" size="sm" className="hidden sm:inline-flex">View Public Store</Button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-zyp-accent to-zyp-accentSecondary flex items-center justify-center text-sm font-medium shadow-md shadow-zyp-accent/20">
              <span className="text-white">Z</span>
            </div>
          </div>
        </header>
        
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-zyp-surface border-t border-white/5 flex items-center justify-around p-2 z-50">
        {navigation.slice(0, 5).map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg text-[10px] font-medium transition-colors ${
                isActive 
                  ? "text-zyp-accent" 
                  : "text-zyp-textMuted"
              }`}
            >
              <Icon className="w-5 h-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
