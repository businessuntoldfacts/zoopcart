"use client";
import React from "react";

export default function StoreThemeWrapper({ theme, children }: { theme: string, children: React.ReactNode }) {
  return (
    <>
      {theme === 'dark' && (
        <style dangerouslySetInnerHTML={{__html: `
          body { background-color: #0f172a !important; }
          .bg-slate-50 { background-color: #0f172a !important; }
          .bg-white { background-color: #1e293b !important; border-color: #334155 !important; }
          .text-slate-900 { color: #f8fafc !important; }
          .text-slate-600, .text-slate-500 { color: #cbd5e1 !important; }
          .text-slate-400 { color: #94a3b8 !important; }
          .border-slate-100, .border-slate-200 { border-color: #334155 !important; }
          .shadow-sm, .shadow-md, .shadow-xl { shadow: none !important; }
          input, select, textarea { background-color: #0f172a !important; border-color: #334155 !important; color: white !important; }
        `}} />
      )}
      {theme === 'playful' && (
        <style dangerouslySetInnerHTML={{__html: `
          body { background-color: #fffbeb !important; }
          .bg-slate-50 { background-color: #fffbeb !important; }
          .bg-white { background-color: #ffffff !important; border-color: #fef3c7 !important; }
          .text-slate-900 { color: #92400e !important; }
          .border-slate-100, .border-slate-200 { border-color: #fde68a !important; }
          .rounded-3xl { border-radius: 2rem !important; }
          .rounded-2xl { border-radius: 1.5rem !important; }
        `}} />
      )}
      {children}
    </>
  );
}
