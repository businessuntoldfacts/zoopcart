const fs = require('fs');
let code = fs.readFileSync('src/app/admin/page.tsx', 'utf8');
const lines = code.split('\n').filter(l => l.includes('value:') && l.includes('title:'));
console.log(lines.join('\n'));
