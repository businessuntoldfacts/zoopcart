const fs = require('fs');
let code = fs.readFileSync('src/app/dashboard/analytics/page.tsx', 'utf8');

code = code.replace(/conversionRate: 0/g, 'conversionRate: "0.0"');

fs.writeFileSync('src/app/dashboard/analytics/page.tsx', code);
console.log("Fixed conversionRate type");
