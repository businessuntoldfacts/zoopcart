const fs = require('fs');

const componentCode = `
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AuthCatcher() {
  const router = useRouter();
  
  useEffect(() => {
    // If there's an access token in the hash (Supabase implicit flow fallback)
    if (window.location.hash.includes('access_token')) {
      router.push('/dashboard');
      return;
    }
    
    // Or if they are already logged in and landed on homepage
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data?.session) {
        // Uncomment below to strictly redirect all logged-in users from homepage to dashboard
        // router.push('/dashboard');
      }
    };
    checkSession();
    
    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        router.push('/dashboard');
      }
    });
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [router]);
  
  return null;
}
`;

fs.writeFileSync('src/components/AuthCatcher.tsx', componentCode);

let pageCode = fs.readFileSync('src/app/page.tsx', 'utf8');

// Insert import
pageCode = pageCode.replace(
  /import \{ supabase \} from "@\/lib\/supabase";/,
  `import { supabase } from "@/lib/supabase";\nimport AuthCatcher from "@/components/AuthCatcher";`
);

// Insert component at the top of the main div
pageCode = pageCode.replace(
  /<div className="min-h-screen bg-white font-sans text-slate-800">/,
  `<div className="min-h-screen bg-white font-sans text-slate-800">\n      <AuthCatcher />`
);

fs.writeFileSync('src/app/page.tsx', pageCode);
console.log("Added AuthCatcher to homepage");
