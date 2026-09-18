const fs = require('fs');
let code = fs.readFileSync('src/components/HeaderMenu.tsx', 'utf8');

code = code.replace('z-40 border-b', 'z-50 border-b');
code = code.replace('bg-white z-[45]', 'bg-white z-40');

fs.writeFileSync('src/components/HeaderMenu.tsx', code);
