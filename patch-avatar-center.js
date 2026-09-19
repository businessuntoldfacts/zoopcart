const fs = require('fs');
let code = fs.readFileSync('src/app/dashboard/layout.tsx', 'utf8');

code = code.replace(/<div className="w-full h-full rounded-full overflow-hidden">/, '<div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center">');

fs.writeFileSync('src/app/dashboard/layout.tsx', code);
console.log("Fixed centering for default avatar text");
