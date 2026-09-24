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
          const { data: business } = await supabase
            .from('businesses')
            .select('id')
            .eq('user_id', data.session.user.id)
            .single();

          if (business) {
            // Only redirect if on a public landing page or login page
            if (currentPath === '/' || currentPath === '/login' || currentPath === '/signup') {
              window.location.replace('/dashboard');
            }
          } else {
            if (!currentPath.startsWith('/signup')) {
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

        // Only redirect to dashboard if the user is explicitly on auth entry pages
        if (latestPath === '/' || latestPath === '/login' || latestPath === '/signup') {
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
