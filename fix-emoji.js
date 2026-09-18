const fs = require('fs');
let code = fs.readFileSync('src/app/dashboard/products/page.tsx', 'utf8');

code = code.replace(/\? Key Features:/g, '✨ Key Features:');
code = code.replace(/\? Generating.../g, '✨ Generating...');
code = code.replace(/\? Optimize with AI/g, '✨ Optimize with AI');

fs.writeFileSync('src/app/dashboard/products/page.tsx', code);
