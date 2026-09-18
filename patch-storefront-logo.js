const fs = require('fs');
let code = fs.readFileSync('src/components/StorefrontClient.tsx', 'utf8');

const regex = /<span className="font-extrabold text-white text-lg tracking-tight shadow-sm">Zoopcart<\/span>/g;
code = code.replace(regex, '<img src="/logo.png" alt="Zoopcart" className="h-6 object-contain bg-white px-1.5 py-0.5 rounded-md" />');
fs.writeFileSync('src/components/StorefrontClient.tsx', code);
