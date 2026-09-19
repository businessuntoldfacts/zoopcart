const fs = require('fs');
let code = fs.readFileSync('src/components/Logo.tsx', 'utf8');

code = code.replace(/className="h-8 md:h-10 w-auto object-contain"/, 'className="h-10 md:h-12 w-auto object-contain"');

fs.writeFileSync('src/components/Logo.tsx', code);
console.log("Increased logo size to h-10 md:h-12");
