const fs = require('fs');
let code = fs.readFileSync('src/app/dashboard/products/page.tsx', 'utf8');

code = code.replace(/if \(loading\) return <div className="p-4 text-slate-500 font-medium">Loading products\.\.\.<\/div>;\s*/g, '');
code = code.replace(/if \(!business\) return <div className="p-4 text-slate-500 font-medium">Please set up your store first\.<\/div>;\s*/g, '');

fs.writeFileSync('src/app/dashboard/products/page.tsx', code);
