const fs = require('fs');

let code = fs.readFileSync('src/app/dashboard/page.tsx', 'utf8');

code = code.replace('icon: Activity,', 'icon: Percent,');

fs.writeFileSync('src/app/dashboard/page.tsx', code);
console.log("Updated Activity to Percent");
