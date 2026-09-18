const fs = require('fs');
let code = fs.readFileSync('src/app/admin/page.tsx', 'utf8');
code = code.replace(/\?\{stats\.volume/g, '₹{stats.volume');
fs.writeFileSync('src/app/admin/page.tsx', code);
