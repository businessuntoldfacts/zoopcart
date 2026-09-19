const fs = require('fs');
let code = fs.readFileSync('src/app/admin/layout.tsx', 'utf8');

// Sidebar background
code = code.replace(/bg-black text-slate-300/g, 'bg-slate-50 text-slate-600 border-r border-slate-200');
// Active links
code = code.replace(/bg-indigo-500\/10 text-indigo-400/g, 'bg-blue-50 text-blue-600 font-bold');
// Inactive links hover
code = code.replace(/hover:bg-slate-800 hover:text-white/g, 'hover:bg-slate-100 hover:text-slate-900');
// User profile section
code = code.replace(/border-t border-zinc-900/g, 'border-t border-slate-200');
code = code.replace(/<p className="text-sm font-bold text-white">/g, '<p className="text-sm font-bold text-slate-900">');
code = code.replace(/<p className="text-xs text-slate-400">/g, '<p className="text-xs text-slate-500">');

fs.writeFileSync('src/app/admin/layout.tsx', code);
console.log("Updated Admin Sidebar");
