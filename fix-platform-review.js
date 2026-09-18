const fs = require('fs');
let code = fs.readFileSync('src/components/PlatformReviewSystem.tsx', 'utf8');

code = code.replace(/notes: comment, \r?\n\s*quantity: rating/g, 'notes: comment,\n        quantity: rating,\n        tracking_token: Math.random().toString(36).substring(2, 10).toUpperCase()');

fs.writeFileSync('src/components/PlatformReviewSystem.tsx', code);
