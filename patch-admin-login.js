const fs = require('fs');
let code = fs.readFileSync('src/app/admin/login/page.tsx', 'utf8');

code = code.replace(/bg-black/g, 'bg-slate-50');

fs.writeFileSync('src/app/admin/login/page.tsx', code);
console.log("Updated Admin Login");
