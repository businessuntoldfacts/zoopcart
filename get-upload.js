const fs = require('fs');
const content = fs.readFileSync('src/app/dashboard/products/page.tsx', 'utf8');
const match = content.match(/const handleImageUpload =[\s\S]*?setUploadingImage\(false\);\n\s*\};/);
if (match) console.log(match[0]);
