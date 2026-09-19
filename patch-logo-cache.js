const fs = require('fs');
let code = fs.readFileSync('src/components/Logo.tsx', 'utf8');
code = code.replace(/v=2/g, 'v=3');
fs.writeFileSync('src/components/Logo.tsx', code);
console.log("Updated logo cache buster to v=3");
