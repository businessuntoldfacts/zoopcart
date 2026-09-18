const fs = require('fs');
let code = fs.readFileSync('src/app/admin/login/page.tsx', 'utf8');

const regex = /<div className="w-10 h-10 bg-zyp-primary rounded-xl flex items-center justify-center font-bold text-white text-2xl tracking-tighter italic">e<\/div>\s*<span className="font-bold text-3xl tracking-tight">Zoopcart Admin<\/span>/g;
code = code.replace(regex, '<img src="/logo.png" alt="Zoopcart" className="h-10 object-contain bg-white px-2 py-1 rounded-xl" />\n          <span className="font-bold text-3xl tracking-tight ml-2">Admin</span>');

fs.writeFileSync('src/app/admin/login/page.tsx', code);
