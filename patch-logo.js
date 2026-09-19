const fs = require('fs');
let code = fs.readFileSync('src/components/Logo.tsx', 'utf8');

code = code.replace(/src="\/logo-final\.jpg\?v=\d+"/, 'src="/logo-black.jpg?v=1"');

fs.writeFileSync('src/components/Logo.tsx', code);
console.log("Updated Logo.tsx to use logo-black.jpg");
