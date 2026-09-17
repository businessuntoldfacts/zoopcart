"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to log in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zyp-bg flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Link href="/" className="inline-block mb-6">
            <img src="/logo.jpg" alt="Zypcart" className="h-12 mx-auto" />
          </Link>
          <CardTitle>Welcome back</CardTitle>
          <CardDescription>Log in to manage your orders</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {error && <div className="p-3 text-sm bg-zyp-danger/10 text-zyp-danger rounded-[12px]">{error}</div>}
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Email</label>
              <Input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seller@example.com" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-white">Password</label>
                <Link href="#" className="text-xs text-zyp-accent hover:underline">Forgot password?</Link>
              </div>
              <Input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            
            <Button type="submit" className="w-full mt-6" disabled={loading}>
              {loading ? "Logging In..." : "Log In"}
            </Button>
            
            <div className="text-center text-sm text-zyp-textMuted mt-6">
              Don't have an account? <Link href="/signup" className="text-zyp-accent hover:underline">Sign up</Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
