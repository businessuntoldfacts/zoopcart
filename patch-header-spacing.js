const fs = require('fs');
let code = fs.readFileSync('src/app/dashboard/layout.tsx', 'utf8');

code = code.replace(/<div className="flex items-center gap-6">/, '<div className="flex items-center gap-4 sm:gap-6">');
code = code.replace(/<div className="flex items-center gap-3 border-l border-zyp-border pl-6 relative"/, '<div className="flex items-center gap-3 border-l border-zyp-border pl-4 sm:pl-6 relative"');

fs.writeFileSync('src/app/dashboard/layout.tsx', code);
console.log("Patched mobile spacing in header");
