const fs = require('fs');
let code = fs.readFileSync('src/components/Logo.tsx', 'utf8');
code = code.replace(/className="h-12 md:h-16 w-auto scale-110 origin-left object-contain"/g, 'className="h-8 md:h-10 w-auto object-contain"');
fs.writeFileSync('src/components/Logo.tsx', code);
console.log("Restored standard logo size");
