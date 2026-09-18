const fs = require('fs');
let code = fs.readFileSync('src/app/dashboard/page.tsx', 'utf8');
const lines = code.split('\n').filter(l => l.includes('value:') && l.includes('label:'));
console.log(lines.join('\n'));
