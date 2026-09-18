const fs = require('fs');
let code = fs.readFileSync('src/app/dashboard/settings/payment/page.tsx', 'utf8');

code = code.replace('useState("upi");`n  const [upiData', 'useState("upi");\n  const [upiData');

fs.writeFileSync('src/app/dashboard/settings/payment/page.tsx', code);
