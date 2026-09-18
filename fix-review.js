const fs = require('fs');
let code = fs.readFileSync('src/components/ReviewSystem.tsx', 'utf8');

code = code.replace(/notes: comment, \/\/ using notes to store review text\r?\n\s*quantity: rating \/\/ using quantity to store rating/g, 'notes: comment,\n        quantity: rating,\n        tracking_token: Math.random().toString(36).substring(2, 10).toUpperCase()');

fs.writeFileSync('src/components/ReviewSystem.tsx', code);
