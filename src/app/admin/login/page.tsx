"use client";
import Logo from "@/components/Logo";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, ShieldCheck } from "lucide-react";
import { loginAdmin } from "./actions";

export default function AdminLogin() {
  const [email, setEmail] = useState("admin@zoopcart.com");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    
    const res = await loginAdmin(email, password);
    if (res.success) {
      window.location.href = "/admin";
    } else {
      setErrorMsg(res.error || "Login failed");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col font-sans selection:bg-[#111111]/20 text-white">
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="mb-8 flex items-center gap-2">
          <Logo />
          <span className="font-bold text-3xl tracking-tight ml-2">Admin</span>
        </div>

        <div className="bg-slate-50 p-8 md:p-10 rounded-3xl shadow-2xl shadow-black/50 w-full max-w-md border border-slate-700 relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
          
          <div className="text-center mb-8">
            <h1 className="text-2xl font-extrabold mb-2 text-slate-900">Admin Access Only</h1>
            <p className="text-slate-500 text-sm">Please log in with your master credentials.</p>
          </div>

          {errorMsg && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-bold text-center">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="text-xs font-bold text-slate-700 mb-1.5 block">Admin Email</label>
              <Input 
                required 
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 h-12 rounded-xl focus:ring-slate-900"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 mb-1.5 block">Master Password</label>
              <div className="relative">
                <Input 
                  required 
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 pr-10 h-12 rounded-xl focus:ring-slate-900"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            
            <Button type="submit" variant="default" disabled={loading} className="w-full text-base py-6 rounded-xl font-bold bg-[#111111] hover:bg-black text-white mt-4 shadow-lg shadow-black/20">
              {loading ? "Authenticating..." : "Login to Dashboard"}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 flex justify-center">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
              <ShieldCheck className="w-4 h-4 text-green-500" />
              Secure encrypted connection
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
