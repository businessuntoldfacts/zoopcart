const fs = require('fs');
let code = fs.readFileSync('src/app/[username]/page.tsx', 'utf8');

code = code.replace('<div className="px-4 space-y-6 mt-6 pb-10">', '<div className="px-4 mt-6 pb-24">');

code = code.replace('products.map((product: any) => (', '<div className="grid grid-cols-2 gap-3">\n{products.map((product: any) => (');

code = code.replace(/<\/Link>\s*\)\)\s*\)\}\s*<\/div>/g, '</Link>\n))}\n</div>\n)}\n</div>');

fs.writeFileSync('src/app/[username]/page.tsx', code);
