const fs = require('fs');
let code = fs.readFileSync('src/app/admin/layout.tsx', 'utf8');

const regex = /import \{ usePathname \} from "next\/navigation";[\s\S]*?if \(!isAuthenticated\) return null;/m;

const replacement = `import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, ShoppingBag, Settings, LogOut, Bell, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
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
  };`;

code = code.replace(regex, replacement);

fs.writeFileSync('src/app/admin/layout.tsx', code);
