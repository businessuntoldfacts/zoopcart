const fs = require('fs');
let code = fs.readFileSync('src/components/ClientTracker.tsx', 'utf8');

code = code.replace(/notes: "View",\r?\n\s*quantity: 1/g, 'notes: "View",\n        quantity: 1,\n        tracking_token: Math.random().toString(36).substring(2, 10).toUpperCase()');

fs.writeFileSync('src/components/ClientTracker.tsx', code);
