const fs = require('fs');
let code = fs.readFileSync('src/app/dashboard/page.tsx', 'utf8');

code = code.replace(/if \(loading\) return <div className="text-slate-400 p-4 font-medium">Loading dashboard\.\.\.<\/div>;\s*/g, '');
code = code.replace(/if \(!business\) return <div className="text-slate-400 p-4 font-medium">Please set up your store first\.<\/div>;\s*/g, '');

code = code.replace('const businessSlug = business.username;', 'const businessSlug = business?.username || "";');

fs.writeFileSync('src/app/dashboard/page.tsx', code);
