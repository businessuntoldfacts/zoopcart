"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, CheckCircle2, XCircle, Loader2 } from "lucide-react";
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
  
  const [usernameStatus, setUsernameStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('reason') === 'no_store') {
      setError("Please complete your store setup to access the dashboard.");
    }
  }, []);

  // Debounced Username Checker
  useEffect(() => {
    const checkUsername = async () => {
      if (formData.username.length < 3) {
        setUsernameStatus('idle');
        return;
      }
      
      setUsernameStatus('checking');
      const { data, error } = await supabase
        .from('businesses')
        .select('id')
        .eq('username', formData.username.toLowerCase())
        .single();
        
      if (data) {
        setUsernameStatus('taken');
      } else {
        setUsernameStatus('available');
      }
    };

    const timeoutId = setTimeout(() => {
      checkUsername();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [formData.username]);

  const handleGoogleSignup = async () => {
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

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    
    if (usernameStatus === 'taken') {
      setError("This store username is already registered. Please choose another.");
      setLoading(false);
      return;
    }
    
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      setLoading(false);
      return;
    }

    try {
      // Check if user is already logged in (e.g. via Google)
      const { data: { session } } = await supabase.auth.getSession();
      let userId = session?.user?.id;
      let userEmail = formData.email;

      if (!userId) {
        // 1. Sign up user only if not already logged in
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
        userId = authData.user?.id;
        userEmail = authData.user?.email || formData.email;
      }

      if (userId) {
        // 2. Create business profile
        const { error: dbError } = await supabase.from('businesses').insert([
          {
            user_id: userId,
            business_name: formData.businessName,
            username: formData.username.toLowerCase()
          }
        ]);

        if (dbError) {
          // Username might be taken
          if (dbError.code === '23505') {
            throw new Error("Store username already taken. Please choose another.");
          }
          throw dbError;
        }

        setSuccess("Account created successfully! Redirecting to dashboard...");
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 1500);
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during signup");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-[#0F172A]">
      <main className="flex-1 flex items-center justify-center p-4 py-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="bg-white p-8 md:p-10 rounded-[32px] shadow-xl shadow-black/5 w-full max-w-lg border border-slate-100">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <Logo darkText={true} />
            </div>
            <h1 className="text-3xl font-extrabold mb-2 tracking-tight">Create your Store</h1>
            <p className="text-slate-500 font-medium">Join thousands of social sellers</p>
          </div>

          {error && <div className="p-4 mb-6 bg-red-50 text-red-600 rounded-2xl text-sm font-bold border border-red-100 flex items-start gap-2 animate-in shake"><XCircle className="w-5 h-5 shrink-0" /> {error}</div>}
          {success && <div className="p-4 mb-6 bg-green-50 text-green-600 rounded-2xl text-sm font-bold border border-green-100 flex items-start gap-2"><CheckCircle2 className="w-5 h-5 shrink-0" /> {success}</div>}

          <form onSubmit={handleSignup} className="space-y-4">

            <div className="grid grid-cols-2 gap-4">
              <Input 
                required 
                placeholder="Full Name" 
                value={formData.fullName}
                onChange={e => setFormData({...formData, fullName: e.target.value})}
                className="bg-slate-50 border-slate-200 h-12 rounded-xl focus:border-[#111111] focus:ring-[#111111]"
              />
              <Input 
                required 
                placeholder="Store Name" 
                value={formData.businessName}
                onChange={e => setFormData({...formData, businessName: e.target.value})}
                className="bg-slate-50 border-slate-200 h-12 rounded-xl focus:border-[#111111] focus:ring-[#111111]"
              />
            </div>
            
            <div className="pt-2">
              <label className="text-xs font-bold text-slate-500 mb-1.5 block ml-1">Choose your Store Link</label>
              <div className={`flex rounded-xl overflow-hidden border-2 transition-colors ${usernameStatus === 'taken' ? 'border-red-400 focus-within:border-red-500 focus-within:ring-red-500/20' : usernameStatus === 'available' ? 'border-green-400 focus-within:border-green-500 focus-within:ring-green-500/20' : 'border-slate-200 focus-within:border-[#111111] focus-within:ring-[#111111]/20'}`}>
                <span className="flex items-center justify-center bg-slate-50 px-4 text-slate-500 font-medium text-sm border-r border-slate-200">
                  zoopcart.com/
                </span>
                <input 
                  required
                  placeholder="your-store"
                  value={formData.username}
                  onChange={e => setFormData({...formData, username: e.target.value.replace(/[^a-zA-Z0-9-]/g, '')})}
                  className="flex-1 h-12 px-3 text-sm focus:outline-none font-bold text-[#111111]"
                />
                <span className="flex items-center pr-4 bg-white">
                  {usernameStatus === 'checking' && <Loader2 className="w-5 h-5 text-slate-400 animate-spin" />}
                  {usernameStatus === 'available' && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                  {usernameStatus === 'taken' && <XCircle className="w-5 h-5 text-red-500" />}
                </span>
              </div>
              <div className="h-5 mt-1 ml-1">
                {usernameStatus === 'available' && <p className="text-xs text-green-600 font-bold">Awesome! This link is available.</p>}
                {usernameStatus === 'taken' && <p className="text-xs text-red-600 font-bold">Already registered. Try adding a number or location.</p>}
              </div>
            </div>

            <Input 
              required 
              type="email"
              placeholder="Email Address" 
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
              className="bg-slate-50 border-slate-200 h-12 rounded-xl focus:border-[#111111] focus:ring-[#111111]"
            />
            
            <div className="relative">
              <Input 
                required 
                type={showPassword ? "text" : "password"}
                placeholder="Password (min 6 chars)" 
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
                className="bg-slate-50 border-slate-200 h-12 rounded-xl focus:border-[#111111] focus:ring-[#111111] pr-10"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <div className="flex items-center gap-2 pt-2 pb-4">
              <input type="checkbox" required id="terms" className="rounded text-[#111111] focus:ring-[#111111] border-slate-300 w-4 h-4 cursor-pointer" />
              <label htmlFor="terms" className="text-xs font-medium text-slate-500 cursor-pointer">
                I agree to the <Link href="/terms" className="font-bold text-[#111111] hover:underline">Terms</Link> & <Link href="/privacy" className="font-bold text-[#111111] hover:underline">Privacy Policy</Link>
              </label>
            </div>

            <Button type="submit" disabled={loading || usernameStatus === 'taken'} className="w-full text-base py-6 rounded-xl font-bold bg-[#111111] hover:bg-black text-white shadow-lg shadow-black/10 transition-all">
              {loading ? "Creating Store..." : "Create My Zoopcart"}
            </Button>
            <div className="relative flex items-center py-4 mt-2">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="flex-shrink-0 mx-4 text-slate-400 text-sm font-medium">Or continue with</span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>
            
            <Button 
              type="button" 
              onClick={handleGoogleSignup} 
              className="w-full text-base py-6 rounded-xl font-bold bg-white border-2 border-slate-200 text-slate-800 hover:bg-slate-50 flex items-center justify-center gap-3 transition-all shadow-none"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              Sign up with Google
            </Button>

            
            <div className="text-center mt-6 pt-6 border-t border-slate-100">
              <span className="text-slate-500 font-medium text-sm">Already have an account? </span>
              <Link href="/login" className="font-bold text-[#111111] hover:underline text-sm">Login here</Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
