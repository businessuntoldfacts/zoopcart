const fs = require('fs');
let code = fs.readFileSync('src/app/admin/layout.tsx', 'utf8');

const authCheck = `
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (pathname === '/admin/login') {
      setLoading(false);
      return;
    }
    const token = localStorage.getItem('zypcart_admin');
    if (!token) {
      window.location.href = '/admin/login';
    } else {
      setIsAuthenticated(true);
      setLoading(false);
    }
  }, [pathname]);

  if (loading) return <div className="h-screen bg-slate-900 flex items-center justify-center text-white">Loading Admin...</div>;
  if (pathname === '/admin/login') return <>{children}</>;
  if (!isAuthenticated) return null;
`;

code = code.replace(/const pathname = usePathname\(\);\n\n  if \(pathname === '\/admin\/login'\) return <\>\{children\}<\/>;/, authCheck);
code = code.replace(/import \{ usePathname \} from "next\/navigation";/, 'import { usePathname } from "next/navigation";\nimport { useEffect, useState } from "react";');

// Update the logout button
code = code.replace(/<Link href="\/admin\/login" className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:bg-white\/10 hover:text-red-400 transition-colors">/, '<button onClick={() => { localStorage.removeItem("zypcart_admin"); window.location.href = "/admin/login"; }} className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:bg-white/10 hover:text-red-400 transition-colors">');
code = code.replace(/<LogOut className="w-5 h-5" \/>\s*Logout\s*<\/Link>/, '<LogOut className="w-5 h-5" />\n            Logout\n          </button>');

fs.writeFileSync('src/app/admin/layout.tsx', code);
