"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { ChevronRight, BarChart2, Store, Palette, Wallet, Sun, HelpCircle, Bell, LogOut } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function SettingsHubPage() {
  const router = useRouter();

  const handleLogout = async () => {
    if (confirm("Are you sure you want to log out?")) {
      await supabase.auth.signOut();
      router.push("/login");
    }
  };

  const [appearance, setAppearance] = useState("light");
  useEffect(() => { setAppearance(localStorage.getItem("zypcart-theme") || "light") }, []);
  const changeTheme = (t: string) => { setAppearance(t); localStorage.setItem("zypcart-theme", t); window.dispatchEvent(new Event("theme-changed")); };

  const menuSections: any[] = [
    {
      title: "MANAGE",
      items: [
        { icon: BarChart2, label: "Analytics", description: "Views, funnel and conversion", href: "/dashboard/analytics" },
        ]
    },
    {
      title: "STORE",
      items: [
        { icon: Store, label: "Store Settings", description: "Name, description and shipping", href: "/dashboard/settings/store" },
        { icon: Palette, label: "Website Theme", description: "Choose theme and brand colour", href: "/dashboard/settings/theme" },
        { icon: Wallet, label: "Payment Details", description: "UPI or Razorpay checkout", href: "/dashboard/settings/payment" },
        ]
    },
    {
      title: "ACCOUNT",
      items: [
        { icon: Sun, label: "Appearance", description: "Dashboard theme · press D to toggle", customAction: (
          <div className="flex gap-2 mt-4">
            <button onClick={() => changeTheme("light")} className={`flex flex-col items-center gap-1 border-2 rounded-xl p-2 w-16 transition-colors ${appearance === "light" ? "border-pink-500" : "border-slate-200"}`}>
              <div className="w-full h-8 bg-white border border-slate-200 rounded flex flex-col gap-1 p-1"><div className="w-1/2 h-1 bg-slate-200 rounded"></div><div className="w-full h-1 bg-slate-100 rounded"></div></div>
              <span className="text-[10px] font-bold text-slate-700">Light</span>
            </button>
            <button onClick={() => changeTheme("dark")} className={`flex flex-col items-center gap-1 border-2 rounded-xl p-2 w-16 transition-colors ${appearance === "dark" ? "border-pink-500" : "border-transparent opacity-50"}`}>
              <div className="w-full h-8 bg-slate-900 border border-slate-700 rounded flex flex-col gap-1 p-1"><div className="w-1/2 h-1 bg-slate-700 rounded"></div><div className="w-full h-1 bg-slate-800 rounded"></div></div>
              <span className="text-[10px] font-bold text-slate-700">Dark</span>
            </button>
            <button onClick={() => changeTheme("auto")} className={`flex flex-col items-center gap-1 border-2 rounded-xl p-2 w-16 transition-colors ${appearance === "auto" ? "border-pink-500" : "border-transparent opacity-50"}`}>
              <div className="w-full h-8 bg-gradient-to-br from-white to-slate-900 border border-slate-300 rounded flex flex-col gap-1 p-1"></div>
              <span className="text-[10px] font-bold text-slate-700">Auto</span>
            </button>
          </div>
        ) },
        { icon: HelpCircle, label: "Contact Us", description: "Questions, problems or suggestions", href: "mailto:support@zypcart.com" },
        { icon: Bell, label: "What's New", description: "Updates, and suggest a feature", action: () => alert("Welcome to Zypcart v1.0!\n- Redesigned Dashboard\n- New Website Themes\n- Advanced UPI Payment Integration\n- Improved Storefront UI") },
        { icon: LogOut, label: "Logout", description: "Sign out of your account", action: handleLogout, isDanger: true }
      ]
    }
  ];

  return (
    <div className="max-w-2xl mx-auto pb-12 pt-4">
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold text-slate-900 mb-1">Settings</h2>
        <p className="text-sm text-slate-500 font-medium">Manage your store, billing and account.</p>
      </div>

      <div className="space-y-8">
        {menuSections.map((section, idx) => (
          <div key={idx} className="space-y-3">
            <h3 className="text-xs font-bold text-slate-500 tracking-wider uppercase ml-1">{section.title}</h3>
            
            <div className="bg-white rounded-[24px] shadow-sm border border-slate-200 overflow-hidden flex flex-col">
              {section.items.map((item: any, itemIdx: number) => {
                const Icon = item.icon;
                const isLast = itemIdx === section.items.length - 1;
                
                const Content = (
                  <div className={`flex items-start gap-4 p-5 ${!isLast ? 'border-b border-slate-100' : ''} hover:bg-slate-50/50 transition-colors w-full text-left`}>
                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100">
                      <Icon className={`w-5 h-5 ${item.isDanger ? 'text-red-500' : 'text-slate-600'}`} />
                    </div>
                    <div className="flex-1 min-w-0 pt-0.5">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className={`font-bold text-sm ${item.isDanger ? 'text-red-500' : 'text-slate-900'}`}>{item.label}</span>
                        {item.badge && (
                          <span className="bg-pink-50 text-pink-500 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 font-medium truncate">{item.description}</p>
                      
                      {item.customAction && item.customAction}
                    </div>
                    {!item.customAction && (
                      <ChevronRight className="w-4 h-4 text-slate-400 ml-auto shrink-0 mt-2" />
                    )}
                  </div>
                );

                if (item.action) {
                  return (
                    <button key={itemIdx} onClick={item.action} className="w-full">
                      {Content}
                    </button>
                  );
                }

                if (item.href) {
                  return (
                    <Link key={itemIdx} href={item.href} className="w-full block">
                      {Content}
                    </Link>
                  );
                }

                return <div key={itemIdx} className="w-full">{Content}</div>;
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}





