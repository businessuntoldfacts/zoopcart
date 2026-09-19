const fs = require('fs');

let code = fs.readFileSync('src/components/PlatformReviewSystem.tsx', 'utf8');

code = code.replace(/variant="secondary" className="font-bold border-blue-200 text-blue-600 hover:bg-blue-50"/, 'variant="secondary" className="font-bold border-slate-200 text-slate-800 hover:bg-slate-50 rounded-full"');
code = code.replace(/bg-blue-600 hover:bg-blue-700 text-white font-bold/, 'bg-[#111111] hover:bg-black text-white font-bold rounded-full');

fs.writeFileSync('src/components/PlatformReviewSystem.tsx', code);
console.log("Updated Review System buttons");
