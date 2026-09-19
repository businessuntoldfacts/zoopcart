const fs = require('fs');

let code = fs.readFileSync('src/app/page.tsx', 'utf8');

// Insert useEffect check for access_token
const checkCode = `
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  
  useEffect(() => {
    // If Supabase accidentally redirects to home page with token, push to dashboard
    if (window.location.hash.includes('access_token')) {
      router.push('/dashboard');
    }
  }, [router]);
`;

code = code.replace(/export default function Home\(\) \{/, checkCode);

fs.writeFileSync('src/app/page.tsx', code);
console.log("Added access_token catch on homepage");
