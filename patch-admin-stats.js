const fs = require('fs');
let code = fs.readFileSync('src/app/admin/page.tsx', 'utf8');

const regex = /if \(o\.status !== 'platform_review'\) \{/g;
const replace = `if (!['store_view', 'product_view', 'review', 'platform_review'].includes(o.status)) {`;

code = code.replace(regex, replace);
fs.writeFileSync('src/app/admin/page.tsx', code);
