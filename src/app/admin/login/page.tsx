"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, ShieldCheck } from "lucide-react";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Dummy login logic for admin
    setTimeout(() => {
      window.location.href = "/admin";
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col font-sans selection:bg-zyp-primary/20 text-white">
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="mb-8 flex items-center gap-2">
          <div className="w-10 h-10 bg-zyp-primary rounded-xl flex items-center justify-center font-bold text-white text-2xl tracking-tighter italic">e</div>
          <span className="font-bold text-3xl tracking-tight">Zypcart Admin</span>
        </div>

        <div className="bg-[#1E293B] p-8 md:p-10 rounded-3xl shadow-2xl shadow-black/50 w-full max-w-md border border-slate-700 relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
          
          <div className="text-center mb-8">
            <h1 className="text-2xl font-extrabold mb-2 text-white">Admin Access Only</h1>
            <p className="text-slate-400 text-sm">Please log in with your master credentials.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="text-xs font-bold text-slate-300 mb-1.5 block">Admin Email</label>
              <Input 
                required 
                type="email"
                defaultValue="admin@zypcart.com"
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 h-12"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-300 mb-1.5 block">Master Password</label>
              <div className="relative">
                <Input 
                  required 
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 pr-10 h-12"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            
            <Button type="submit" variant="primary" className="w-full text-base py-6 rounded-xl font-bold bg-blue-600 hover:bg-blue-700 mt-4 shadow-lg shadow-blue-900/50">
              {loading ? "Authenticating..." : "Login to Dashboard →"}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-700/50 flex justify-center">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
              <ShieldCheck className="w-4 h-4 text-green-500" />
              Secure connection
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
