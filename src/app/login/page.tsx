"use client";
import { useState } from "react";
import Link from "next/link";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (authError) throw authError;
      
      window.location.href = "/dashboard";
    } catch (err: any) {
      setError(err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans selection:bg-[#111111]/20 text-[#0F172A]">
      

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl shadow-black/20 w-full max-w-md border border-zyp-border">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <Logo darkText={true} />
            </div>
            <h1 className="text-3xl font-extrabold mb-2 tracking-tight">Welcome back</h1>
            <p className="text-zyp-textMuted">Log in to manage your store</p>
          </div>

          {error && <div className="p-3 mb-6 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100">{error}</div>}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Input 
                required 
                type="email"
                placeholder="Email Address" 
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                className="bg-gray-50 border-gray-200"
              />
            </div>
            <div className="relative">
              <Input 
                required 
                type={showPassword ? "text" : "password"}
                placeholder="Password" 
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
                className="bg-gray-50 border-gray-200 pr-10"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            
            <div className="flex justify-end pt-1 pb-4">
              <a href="#" className="text-sm font-bold text-[#111111] hover:underline">Forgot password?</a>
            </div>

            <Button type="submit" variant="primary" className="w-full text-base py-6 rounded-xl font-bold">
              {loading ? "Logging in..." : "Log in"}
            </Button>
          </form>
            <div className="mt-6 text-center text-sm text-zyp-textMuted">
              New to Zoopcart? <Link href="/signup" className="font-bold text-[#111111] hover:underline">Sign up</Link>
            </div>
        </div>
      </main>
    </div>
  );
}


