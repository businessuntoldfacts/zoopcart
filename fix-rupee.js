const fs = require('fs');
let code = fs.readFileSync('src/app/[username]/[productSlug]/request/page.tsx', 'utf8');

code = code.replace(/\?\{productTotal\}/g, '₹{productTotal}');
code = code.replace(/\?\{deliveryCharge\}/g, '₹{deliveryCharge}');
code = code.replace(/\?\{finalPrice\}/g, '₹{finalPrice}');
// Also fix notes where it says Total: ?
code = code.replace(/Total: \?\\/g, 'Total: ₹\\');
code = code.replace(/Delivery: \?\\/g, 'Delivery: ₹\\');
code = code.replace(/Product: \?\\/g, 'Product: ₹\\');

fs.writeFileSync('src/app/[username]/[productSlug]/request/page.tsx', code);
