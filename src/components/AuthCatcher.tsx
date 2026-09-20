
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AuthCatcher() {
  const router = useRouter();
  
  useEffect(() => {
    // If there's an access token in the hash (Supabase implicit flow fallback)
    if (window.location.hash.includes('access_token')) {
      router.replace('/dashboard');
      return;
    }
    
    // Or if they are already logged in and landed on homepage
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data?.session) {
        const { data: business } = await supabase
          .from('businesses')
          .select('id')
          .eq('user_id', data.session.user.id)
          .single();

        if (business) {
          router.replace('/dashboard');
        } else {
          router.replace('/signup?reason=no_store');
        }
      }
    };
    checkSession();
    
    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        // Fix for mobile redirect scaling: force a small delay then reload
        setTimeout(async () => {
          const { data: business } = await supabase
            .from('businesses')
            .select('id')
            .eq('user_id', session.user.id)
            .single();

          if (business) {
            window.location.replace('/dashboard');
          } else {
            window.location.replace('/signup?reason=no_store');
          }
        }, 100);
      }
    });
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [router]);
  
  return null;
}
