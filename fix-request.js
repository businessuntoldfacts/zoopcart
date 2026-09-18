const fs = require('fs');
let code = fs.readFileSync('src/app/[username]/[productSlug]/request/page.tsx', 'utf8');

code = code.replace(/delivery_location: formData.delivery_location,/g, 'delivery_location: formData.delivery_location,\n        tracking_token: token,');

fs.writeFileSync('src/app/[username]/[productSlug]/request/page.tsx', code);
