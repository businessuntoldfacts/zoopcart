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
          .border-slate-100, .border-slate-200 { border-color: #334155 !important; }
        `}} />
      )}
      {children}
    </>
  );
}
