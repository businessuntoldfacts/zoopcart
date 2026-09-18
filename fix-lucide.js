const fs = require('fs');
let code = fs.readFileSync('src/app/admin/sellers/page.tsx', 'utf8');
code = code.replace(/Instagram, /g, '');
fs.writeFileSync('src/app/admin/sellers/page.tsx', code);
