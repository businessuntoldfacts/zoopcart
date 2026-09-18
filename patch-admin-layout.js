const fs = require('fs');
let code = fs.readFileSync('src/app/admin/layout.tsx', 'utf8');

const replacement = `
import { usePathname } from "next/navigation";
import { logoutAdmin } from "./login/actions";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  if (pathname === '/admin/login') return <>{children}</>;

  const handleLogout = async () => {
    await logoutAdmin();
    window.location.href = "/admin/login";
  };
`;
// Replace the old auth check completely
code = code.replace(/import \{ usePathname \} from "next\/navigation";\nimport \{ useEffect, useState \} from "react";\n\nexport default function AdminLayout\(\{[\s\S]*?\}\) \{[\s\S]*?if \(!isAuthenticated\) return null;/m, replacement);

// Fix the Logout button
code = code.replace(/<button onClick=\{[\s\S]*?\} className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:bg-white\/10 hover:text-red-400 transition-colors">/m, '<button onClick={handleLogout} className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:bg-white/10 hover:text-red-400 transition-colors">');

fs.writeFileSync('src/app/admin/layout.tsx', code);
