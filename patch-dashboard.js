const fs = require('fs');
let code = fs.readFileSync('src/app/dashboard/layout.tsx', 'utf8');

// Sidebar background
code = code.replace(/bg-black text-slate-300/g, 'bg-slate-50 text-slate-600 border-r border-slate-200');
// Active links
code = code.replace(/bg-pink-500\/10 text-pink-500/g, 'bg-blue-50 text-blue-600 font-bold');
// Inactive links hover
code = code.replace(/hover:bg-slate-800 hover:text-white/g, 'hover:bg-slate-100 hover:text-slate-900');
// User profile section
code = code.replace(/border-t border-zinc-900/g, 'border-t border-slate-200');
code = code.replace(/text-white/g, 'text-slate-900'); // Note: carefully replacing text-white inside the sidebar
code = code.replace(/text-slate-400/g, 'text-slate-500');

fs.writeFileSync('src/app/dashboard/layout.tsx', code);
console.log("Updated Dashboard Sidebar");
