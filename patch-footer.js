const fs = require('fs');

let code = fs.readFileSync('src/app/page.tsx', 'utf8');

// Change Footer Background
code = code.replace(/<footer className="bg-black text-slate-400 py-16">/, '<footer className="bg-slate-50 border-t border-slate-200 text-slate-600 py-16">');
// Change headings in footer
code = code.replace(/text-white mb-6/g, 'text-slate-900 mb-6');
// Change text colors in footer links
code = code.replace(/hover:text-white transition-colors/g, 'hover:text-blue-600 transition-colors');
// Change social icons
code = code.replace(/bg-slate-800 text-white/g, 'bg-slate-200 text-slate-700 hover:bg-blue-100 hover:text-blue-600');
// Change copyright text
code = code.replace(/border-slate-800 pt-8 text-center text-sm/g, 'border-slate-200 pt-8 text-center text-sm font-medium');

fs.writeFileSync('src/app/page.tsx', code);
console.log("Updated Footer");
