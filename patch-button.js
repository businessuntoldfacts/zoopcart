const fs = require('fs');
let code = fs.readFileSync('src/components/ui/button.tsx', 'utf8');

code = code.replace(/bg-blue-600 text-white hover:bg-blue-700 shadow-sm shadow-blue-600\/20/, 'bg-[#111111] text-white hover:bg-black shadow-sm');
code = code.replace(/focus-visible:ring-blue-600/, 'focus-visible:ring-slate-900');
code = code.replace(/rounded-lg/g, 'rounded-full');
code = code.replace(/rounded-xl/g, 'rounded-full');
code = code.replace(/rounded-md/g, 'rounded-full');

fs.writeFileSync('src/components/ui/button.tsx', code);
console.log("Updated Button component for monochrome pill theme");
