const fs = require('fs');
let code = fs.readFileSync('src/app/dashboard/orders/page.tsx', 'utf8');

code = code.replace(/if \(loading\) return <div className="text-zyp-textMuted font-medium p-4">Loading orders\.\.\.<\/div>;\s*/g, '');

fs.writeFileSync('src/app/dashboard/orders/page.tsx', code);
