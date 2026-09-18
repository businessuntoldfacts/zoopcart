const fs = require('fs');
let code = fs.readFileSync('src/app/dashboard/analytics/page.tsx', 'utf8');
const lines = code.split('\n').filter(l => l.includes('</div>') && l.match(/[0-9]+/));
console.log(lines.join('\n'));
