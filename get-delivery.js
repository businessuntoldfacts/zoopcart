const fs = require('fs');
const content = fs.readFileSync('src/app/[username]/[productSlug]/page.tsx', 'utf8');
const lines = content.split('\n');
lines.forEach((l, i) => {
  if (l.includes('DELIVERY')) {
    console.log(`Line ${i}: ${l}`);
  }
});
