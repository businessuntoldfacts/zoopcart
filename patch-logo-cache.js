const fs = require('fs');
let code = fs.readFileSync('src/components/Logo.tsx', 'utf8');

code = code.replace(/v=3/g, 'v=4');

fs.writeFileSync('src/components/Logo.tsx', code);
console.log("Updated logo cache buster to v=4");
