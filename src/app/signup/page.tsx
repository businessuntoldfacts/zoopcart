"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    businessName: "",
    email: "",
    password: "",
    username: "",
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // 1. Sign up user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
          }
        }
      });

      if (authError) throw authError;

      if (authData.user) {
        // 2. Create business profile
        const { error: dbError } = await supabase.from('businesses').insert([
          {
            user_id: authData.user.id,
            business_name: formData.businessName,
            username: formData.username.toLowerCase()
          }
        ]);

        if (dbError) {
          // Username might be taken
          if (dbError.code === '23505') {
            throw new Error("Username already taken. Please choose another.");
          }
          throw dbError;
        }

        setSuccess("Account created successfully! Redirecting to login...");
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during signup");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zyp-bg flex flex-col font-sans selection:bg-zyp-primary/20 text-[#0F172A]">
      <header className="p-6 flex justify-center items-center w-full">
        <Link href="/" className="flex items-center">
          <img src="/logo.png" alt="Zypcart" className="h-12 object-contain bg-white px-2 py-1 rounded-xl" />
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl shadow-blue-900/5 w-full max-w-lg border border-zyp-border mb-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold mb-2 tracking-tight">Create your Zypcart</h1>
            <p className="text-zyp-textMuted font-medium">Join thousands of social sellers</p>
          </div>

          {error && <div className="p-3 mb-6 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100">{error}</div>}
          {success && <div className="p-3 mb-6 bg-green-50 text-green-600 rounded-xl text-sm font-medium border border-green-100">{success}</div>}

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <Input 
                required 
                placeholder="Full Name" 
                value={formData.fullName}
                onChange={e => setFormData({...formData, fullName: e.target.value})}
                className="bg-gray-50 border-gray-200"
              />
            </div>
            <div>
              <Input 
                required 
                placeholder="Business Name" 
                value={formData.businessName}
                onChange={e => setFormData({...formData, businessName: e.target.value})}
                className="bg-gray-50 border-gray-200"
              />
            </div>
            <div>
              <Input 
                required 
                type="email"
                placeholder="Email" 
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
            
            <div className="pt-2">
              <div className="flex rounded-lg overflow-hidden border border-gray-200 focus-within:ring-2 focus-within:ring-zyp-primary/20 focus-within:border-zyp-primary transition-colors">
                <span className="flex items-center justify-center bg-gray-50 px-4 text-gray-500 font-medium text-sm border-r border-gray-200">
                  zypcart.com/
                </span>
                <input 
                  required
                  placeholder="username"
                  value={formData.username}
                  onChange={e => setFormData({...formData, username: e.target.value.replace(/[^a-zA-Z0-9-]/g, '')})}
                  className="flex-1 h-12 px-3 text-sm focus:outline-none"
                />
                {formData.username.length > 2 && (
                  <span className="flex items-center pr-3">
                    <CheckCircle2 className="w-5 h-5 text-zyp-success" />
                  </span>
                )}
              </div>
              {formData.username && (
                <p className="text-xs text-zyp-success mt-2 font-medium">Your store URL will be: zypcart.com/{formData.username}</p>
              )}
            </div>

            <div className="flex items-center gap-2 pt-2 pb-4">
              <input type="checkbox" required id="terms" className="rounded text-zyp-primary focus:ring-zyp-primary border-gray-300 w-4 h-4 cursor-pointer" />
              <label htmlFor="terms" className="text-xs font-medium text-zyp-textMuted cursor-pointer">
                I agree to the <a href="#" className="font-bold text-zyp-primary hover:underline">Terms & Privacy Policy</a>
              </label>
            </div>

            <Button type="submit" variant="primary" className="w-full text-base py-6 rounded-xl font-bold shadow-md hover:shadow-lg transition-all">
              {loading ? "Creating..." : "Create My Zypcart →"}
            </Button>
            
            <div className="text-center mt-6 pt-6 border-t border-slate-100">
              <span className="text-slate-500 font-medium text-sm">Already have an account? </span>
              <Link href="/login" className="font-bold text-zyp-primary hover:underline text-sm">Login here</Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}



