const fs = require('fs');
let code = fs.readFileSync('src/app/dashboard/page.tsx', 'utf8');
code = code.replace('value: (storeViews || 12).toString()', 'value: storeViews.toString()');
code = code.replace('value: (productViews || 34).toString()', 'value: productViews.toString()');
// Keep the trend visuals but remove the fake numbers to prevent confusion, or just set trend to ""
code = code.replace('trend: "+12%"', 'trend: ""');
code = code.replace('trend: "+18%"', 'trend: ""');
code = code.replace('trend: "+6%"', 'trend: ""');
fs.writeFileSync('src/app/dashboard/page.tsx', code);
