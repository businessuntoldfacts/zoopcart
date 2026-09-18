const fs = require('fs');
let code = fs.readFileSync('src/app/dashboard/analytics/page.tsx', 'utf8');

code = code.replace(/if \(loading\) return <div className="p-4 text-slate-500 font-medium">Loading analytics\.\.\.<\/div>;\s*/g, '');

fs.writeFileSync('src/app/dashboard/analytics/page.tsx', code);
