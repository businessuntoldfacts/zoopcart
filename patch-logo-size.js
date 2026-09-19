const fs = require('fs');
let code = fs.readFileSync('src/components/Logo.tsx', 'utf8');

code = code.replace(/h-10 md:h-12 w-auto/g, 'h-12 md:h-16 w-auto scale-110 origin-left');
fs.writeFileSync('src/components/Logo.tsx', code);
console.log("Increased Logo size");
