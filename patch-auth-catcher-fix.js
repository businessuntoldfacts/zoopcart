const fs = require('fs');

let code = fs.readFileSync('src/components/AuthCatcher.tsx', 'utf8');

// Uncomment the session redirect
code = code.replace(/\/\/ router\.push\('\/dashboard'\);/, "router.push('/dashboard');");

fs.writeFileSync('src/components/AuthCatcher.tsx', code);
console.log("Uncommented session redirect in AuthCatcher");
