"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    businessName: "",
    email: "",
    username: "",
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");

  const [usernameStatus, setUsernameStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');
  const [isGoogleUser, setIsGoogleUser] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: business } = await supabase
          .from('businesses')
          .select('id')
          .eq('user_id', session.user.id)
          .single();

        if (business) {
          window.location.href = '/dashboard';
          return;
        }

        setIsGoogleUser(true);
        setFormData(prev => ({
          ...prev,
          fullName: session.user.user_metadata.full_name || "",
          email: session.user.email || ""
        }));
      }
    };
    checkUser();

    const urlParams = new URLSearchParams(window.location.search);
    const reason = urlParams.get('reason');
    if (reason === 'no_store' || reason === 'google_auth') {
      setError("We found your Google account! Please choose a store name and username to complete your setup.");
    }
  }, []);

  useEffect(() => {
    const checkUsername = async () => {
      if (formData.username.length < 3) {
        setUsernameStatus('idle');
        return;
      }
      
      setUsernameStatus('checking');
      const { data } = await supabase
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
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [formData.username]);

  const handleGoogleSignup = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `https://www.zoopcart.com/dashboard`
        }
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message || "Could not authenticate with Google");
      setLoading(false);
    }
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (usernameStatus === 'taken') {
      setError("This store username is already registered.");
      setLoading(false);
      return;
    }

    try {
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email: formData.email,
        options: {
          shouldCreateUser: true,
          data: {
            full_name: formData.fullName,
          }
        }
      });

      if (otpError) throw otpError;
      setOtpSent(true);
    } catch (err: any) {
      setError(err.message || "Could not send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAndSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data, error: verifyError } = await supabase.auth.verifyOtp({
        email: formData.email,
        token: otpCode,
        type: 'magiclink'
      });

      if (verifyError) throw new Error("Invalid OTP. Please check and try again.");

      if (data.user) {
        await createBusiness(data.user.id);
      }
    } catch (err: any) {
      setError(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleComplete = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await createBusiness(session.user.id);
      }
    } catch (err: any) {
      setError(err.message || "Setup failed");
      setLoading(false);
    }
  };

  const createBusiness = async (userId: string) => {
    // Insert business and retrieve its ID
    const { data: newBusiness, error: dbError } = await supabase
      .from('businesses')
      .insert([
        {
          user_id: userId,
          business_name: formData.businessName,
          username: formData.username.toLowerCase(),
          email: formData.email.toLowerCase()
        }
      ])
      .select('id')
      .single();

    if (dbError) {
      if (dbError.code === '23505') throw new Error("Username already taken.");
      throw dbError;
    }

    // 5. Implement a "Welcome" announcement as the initial default notification for all new stores.
    try {
      await supabase.from('announcements').insert([
        {
          business_id: newBusiness.id,
          title: `Welcome to Zoopcart, ${formData.businessName}! 🚀`,
          content: `We're thrilled to have you here. Your storefront is officially live at zoopcart.com/${formData.username.toLowerCase()}. Let's customize your store, add some premium products, and share your link with the world!`,
          type: 'success',
          link: `/dashboard/settings`,
          is_active: true
        }
      ]);
    } catch (annError) {
      console.error("Failed to insert welcome announcement:", annError);
    }

    setSuccess("Account created successfully! Redirecting...");
    localStorage.setItem("setup_pending", "true");

    try {
      await fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "welcome",
          email: formData.email,
          fullName: formData.fullName,
          businessName: formData.businessName,
          storeUrl: `https://zoopcart.com/${formData.username.toLowerCase()}`
        })
      });
    } catch (e) {}

    setTimeout(() => {
      window.location.href = "/dashboard/settings/store";
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-[#0F172A] overflow-x-hidden">
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 py-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="bg-white p-6 md:p-10 rounded-[32px] shadow-2xl shadow-black/5 w-full max-w-[480px] border border-slate-100">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <Logo darkText={true} />
            </div>
            <h1 className="text-3xl font-extrabold mb-2 tracking-tight">
              {isGoogleUser ? "Complete your setup" : "Create your Store"}
            </h1>
            <p className="text-slate-500 font-medium text-sm">
              {otpSent ? "Enter the code sent to your email" : "Join thousands of social sellers"}
            </p>
          </div>

          {error && <div className="p-4 mb-6 bg-red-50 text-red-600 rounded-2xl text-sm font-bold border border-red-100 flex items-start gap-2 animate-in shake"><XCircle className="w-5 h-5 shrink-0" /> {error}</div>}
          {success && <div className="p-4 mb-6 bg-green-50 text-green-600 rounded-2xl text-sm font-bold border border-green-100 flex items-start gap-2"><CheckCircle2 className="w-5 h-5 shrink-0" /> {success}</div>}

          {otpSent ? (
            <form onSubmit={handleVerifyAndSignup} className="space-y-4">
              <div>
                <p className="text-sm text-slate-500 mb-4 text-center">
                  We sent a code to <strong className="text-[#0F172A]">{formData.email}</strong>.
                </p>
                <Input
                  required
                  type="text"
                  maxLength={6}
                  placeholder="6-Digit Code"
                  value={otpCode}
                  onChange={e => setOtpCode(e.target.value.replace(/\D/g, ''))}
                  className="bg-slate-50 border-slate-200 text-center tracking-widest font-bold text-xl py-6 h-14 rounded-xl"
                />
              </div>
              <Button type="submit" disabled={loading} className="w-full text-base py-6 rounded-xl font-bold bg-[#111111] hover:bg-black text-white shadow-lg shadow-black/10 transition-all">
                {loading ? "Verifying..." : "Verify & Create Store"}
              </Button>
              <div className="text-center pt-2">
                <button type="button" onClick={() => setOtpSent(false)} className="text-sm font-bold text-[#111111] hover:underline">
                  Change Email
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={isGoogleUser ? handleGoogleComplete : handleSendOTP} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  required
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={e => setFormData({...formData, fullName: e.target.value})}
                  className="bg-slate-50 border-slate-200 h-12 rounded-xl"
                />
                <Input
                  required
                  placeholder="Store Name"
                  value={formData.businessName}
                  onChange={e => setFormData({...formData, businessName: e.target.value})}
                  className="bg-slate-50 border-slate-200 h-12 rounded-xl"
                />
              </div>

              <div className="pt-2">
                <label className="text-xs font-bold text-slate-500 mb-1.5 block ml-1">Store Link</label>
                <div className={`flex rounded-xl overflow-hidden border-2 transition-colors ${usernameStatus === 'taken' ? 'border-red-400' : usernameStatus === 'available' ? 'border-green-400' : 'border-slate-200 focus-within:border-[#111111]'}`}>
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
                    {usernameStatus === 'available' && <span className="text-[10px] font-black text-green-600 uppercase tracking-tighter mr-1 animate-in fade-in zoom-in">Available</span>}
                    {usernameStatus === 'taken' && <span className="text-[10px] font-black text-red-600 uppercase tracking-tighter mr-1 animate-in fade-in zoom-in">Taken</span>}
                    {usernameStatus === 'available' && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                    {usernameStatus === 'taken' && <XCircle className="w-5 h-5 text-red-500" />}
                  </span>
                </div>
                <div className="h-5 mt-1 ml-1">
                  {usernameStatus === 'available' && <p className="text-xs text-green-600 font-bold">Awesome! This link is available.</p>}
                  {usernameStatus === 'taken' && <p className="text-xs text-red-600 font-bold">Not available. Try another one.</p>}
                </div>
              </div>

              {!isGoogleUser && (
                <Input
                  required
                  type="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="bg-slate-50 border-slate-200 h-12 rounded-xl"
                />
              )}

              <div className="flex items-center gap-2 pt-2 pb-2">
                <input type="checkbox" required id="terms" className="rounded text-[#111111] w-4 h-4 cursor-pointer" />
                <label htmlFor="terms" className="text-xs font-medium text-slate-500 cursor-pointer">
                  I agree to the <Link href="/terms" className="font-bold text-[#111111] hover:underline">Terms</Link>
                </label>
              </div>

              <Button type="submit" disabled={loading || usernameStatus === 'taken'} className="w-full text-base py-6 rounded-xl font-bold bg-[#111111] hover:bg-black text-white shadow-lg shadow-black/10 transition-all">
                {loading ? "Processing..." : isGoogleUser ? "Complete Setup" : "Create My Zoopcart"}
              </Button>

              {!isGoogleUser && (
                <>
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
                </>
              )}

              <div className="text-center mt-6 pt-6 border-t border-slate-100">
                <span className="text-slate-500 font-medium text-sm">Already have an account? </span>
                <Link href="/login" className="font-bold text-[#111111] hover:underline text-sm">Login here</Link>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
