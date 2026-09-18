const fs = require('fs');
let code = fs.readFileSync('src/app/admin/layout.tsx', 'utf8');

const regex = /<div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center font-bold text-white text-xl tracking-tighter italic">e<\/div>\s*<div>\s*<div className="font-bold text-lg text-white tracking-tight leading-none">Zoopcart<\/div>/g;
code = code.replace(regex, '<img src="/logo.png" alt="Zoopcart" className="h-8 object-contain bg-white px-1.5 py-0.5 rounded-lg" />\n            <div>\n              <div className="font-bold text-lg text-white tracking-tight leading-none">Zoopcart</div>');

fs.writeFileSync('src/app/admin/layout.tsx', code);
