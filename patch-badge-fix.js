const fs = require('fs');

let code = fs.readFileSync('src/app/dashboard/layout.tsx', 'utf8');

// Fix the React {0} rendering bug
code = code.replace(/badge: 0/g, 'badge: undefined');

fs.writeFileSync('src/app/dashboard/layout.tsx', code);
console.log("Fixed dashboard badge rendering 0");
