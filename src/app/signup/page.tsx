"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    businessName: "",
    username: "",
    email: "",
    password: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 1. Sign up auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error("No user returned");

      // 2. Create business profile
      const { error: profileError } = await supabase
        .from('businesses')
        .insert([
          {
            user_id: authData.user.id,
            business_name: formData.businessName,
            username: formData.username.toLowerCase().replace(/[^a-z0-9]/g, ''),
            category: 'Others', // default
          }
        ]);

      if (profileError) {
        // If username taken, etc.
        throw profileError;
      }

      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to sign up");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zyp-bg flex items-center justify-center p-4">
      <Card className="w-full max-w-lg my-8">
        <CardHeader className="text-center">
          <Link href="/" className="inline-block mb-6">
            <img src="/logo.jpg" alt="Zypcart" className="h-12 mx-auto" />
          </Link>
          <CardTitle>Create your store</CardTitle>
          <CardDescription>Turn your DMs into a streamlined ordering system</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="p-3 text-sm bg-zyp-danger/10 text-zyp-danger rounded-[12px]">{error}</div>}
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Full Name</label>
                <Input required value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} placeholder="Jane Doe" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Business Name</label>
                <Input required value={formData.businessName} onChange={(e) => setFormData({...formData, businessName: e.target.value})} placeholder="The Cake Studio" />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Username</label>
              <div className="flex">
                <span className="inline-flex items-center px-4 rounded-l-[16px] border border-r-0 border-white/10 bg-white/5 text-zyp-textMuted text-sm">
                  zypcart.com/
                </span>
                <Input required className="rounded-l-none border-l-0" value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value})} placeholder="thecakestudio" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Email</label>
              <Input required type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="jane@example.com" />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Password</label>
              <Input required type="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />
            </div>

            <Button type="submit" className="w-full mt-6" disabled={loading}>
              {loading ? "Creating Account..." : "Create Account"}
            </Button>
            
            <div className="text-center text-sm text-zyp-textMuted mt-6">
              Already have an account? <Link href="/login" className="text-zyp-accent hover:underline">Log in</Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
