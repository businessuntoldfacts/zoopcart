"use client";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function AuthCatcher() {
  useEffect(() => {
    const currentPath = window.location.pathname;

    // If there's an access token in the hash (Supabase implicit flow fallback)
    if (window.location.hash.includes('access_token')) {
      setTimeout(async () => {
        const { data } = await supabase.auth.getSession();
        if (data?.session) {
          const user = data.session.user;
          const { data: business } = await supabase
            .from('businesses')
            .select('id')
            .eq('user_id', user.id)
            .maybeSingle();

          if (business) {
            if (currentPath === '/' || currentPath === '/login' || currentPath === '/signup') {
              window.location.replace('/dashboard');
            }
          } else if (user.email) {
            // Check by email to handle provider switching (Google vs OTP)
            const checkRes = await fetch('/api/auth/check-email', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email: user.email, currentUserId: user.id }),
            });
            const checkData = await checkRes.json();

            if (checkData.exists && checkData.userId === user.id && checkData.username) {
              window.location.replace('/dashboard');
            } else if (!currentPath.startsWith('/signup')) {
              window.location.replace('/signup?reason=no_store');
            }
          }
        }
      }, 500);
      return;
    }
    
    // Only check session on explicit login/landing pages to avoid disrupting storefront/tracking views
    const checkSession = async () => {
      if (currentPath === '/' || currentPath === '/login') {
        const { data } = await supabase.auth.getSession();
        if (data?.session) {
          const { data: business } = await supabase
            .from('businesses')
            .select('id')
            .eq('user_id', data.session.user.id)
            .single();

          if (business) {
            window.location.replace('/dashboard');
          } else {
            window.location.replace('/signup?reason=no_store');
          }
        }
      }
    };
    checkSession();
    
    // Listen for auth state changes elegantly without breaking tracking or store pages
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        const latestPath = window.location.pathname;

        if (latestPath === '/' || latestPath === '/login' || latestPath === '/signup') {
          setTimeout(async () => {
            const user = session.user;
            // First check by ID
            const { data: business } = await supabase
              .from('businesses')
              .select('id')
              .eq('user_id', user.id)
              .maybeSingle();

            if (business) {
              window.location.replace('/dashboard');
            } else if (user.email) {
              // Try recovery/healing via email
              const res = await fetch('/api/auth/check-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: user.email, currentUserId: user.id }),
              });
              const result = await res.json();

              if (result.exists && result.userId === user.id && result.username) {
                window.location.replace('/dashboard');
              } else {
                window.location.replace('/signup?reason=no_store');
              }
            }
          }, 300);
        }
      }
    });
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);
  
  return null;
}
