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
            if (currentPath !== '/dashboard') {
              window.location.replace('/dashboard');
            }
          } else {
            if (!currentPath.startsWith('/signup')) {
              window.location.replace('/signup?reason=no_store');
            }
          }
        } else {
          if (currentPath !== '/dashboard') {
            window.location.replace('/dashboard');
          }
        }
      }, 500);
      return;
    }
    
    // Only check session on public pages to avoid infinite loops
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
    
    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        // Fix for mobile redirect scaling: force a 500ms delay then hard replace window to reset viewport scale matrix
        setTimeout(async () => {
          const { data: business } = await supabase
            .from('businesses')
            .select('id')
            .eq('user_id', session.user.id)
            .single();

          const latestPath = window.location.pathname;
          if (business) {
            if (latestPath !== '/dashboard') {
              window.location.replace('/dashboard');
            }
          } else {
            if (!latestPath.startsWith('/signup')) {
              window.location.replace('/signup?reason=no_store');
            }
          }
        }, 500);
      }
    });
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);
  
  return null;
}
