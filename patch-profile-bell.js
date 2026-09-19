const fs = require('fs');
let code = fs.readFileSync('src/app/dashboard/layout.tsx', 'utf8');

// 1. Remove hidden sm:block from Bell icon to show on mobile
code = code.replace(/<button className="relative text-slate-500 hover:text-slate-600 transition-colors hidden sm:block">/, '<button className="relative text-slate-500 hover:text-blue-600 transition-colors">');

// 2. Make the profile section padding dynamic (no left border on mobile if it looks bad, but actually it's fine)
// We'll keep the border.

// 3. Make the default avatar a premium gradient instead of gray
// Replace the button classes:
code = code.replace(/className="relative w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-sm font-bold text-slate-700 border border-slate-200 hover:ring-2 hover:ring-blue-500 transition-all shadow-sm group cursor-pointer"/, 'className="relative w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-sm font-extrabold text-white shadow-md hover:shadow-lg transition-all ring-2 ring-white hover:ring-blue-100 group cursor-pointer"');

// Fix the img tag in case the user does have an image, we need it to still work and cover the gradient
// The img tag is already: className="w-full h-full object-cover"

fs.writeFileSync('src/app/dashboard/layout.tsx', code);
console.log("Patched layout for premium profile and bell icon");
