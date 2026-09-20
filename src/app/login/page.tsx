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

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message || "Could not authenticate with Google");
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (authError) {
        if (authError.message.includes("Invalid login credentials")) {
          throw new Error("Incorrect email or password. Please check and try again.");
        }
        if (authError.message.includes("Email not confirmed")) {
          throw new Error("Please confirm your email address before logging in.");
        }
        throw authError;
      }

      // Check if business exists for this user
      const { data: business } = await supabase
        .from('businesses')
        .select('id')
        .eq('user_id', data.user.id)
        .single();

      if (!business) {
        // If user exists in Auth but not in businesses table (e.g. signup failed midway)
        await supabase.auth.signOut();
        throw new Error("Account found but store profile is missing. Please sign up again.");
      }
      
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
            <div className="relative flex items-center py-4 mt-2">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="flex-shrink-0 mx-4 text-slate-400 text-sm font-medium">Or continue with</span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>
            
            <Button 
              type="button" 
              onClick={handleGoogleLogin} 
              className="w-full text-base py-6 rounded-xl font-bold bg-white border-2 border-slate-200 text-slate-800 hover:bg-slate-50 flex items-center justify-center gap-3 transition-all shadow-none"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              Sign in with Google
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


