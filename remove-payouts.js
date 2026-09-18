const fs = require('fs');
let code = fs.readFileSync('src/app/admin/layout.tsx', 'utf8');
code = code.replace(/\{\s*name:\s*"Payouts",\s*href:\s*"\/admin\/payouts",\s*icon:\s*CreditCard\s*\},/g, '');
// And remove CreditCard import if unused
fs.writeFileSync('src/app/admin/layout.tsx', code);
