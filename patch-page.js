const fs = require('fs');
let code = fs.readFileSync('src/app/page.tsx', 'utf8');

code = code.replace(/import PlatformReviewSystem from "@\/components\/PlatformReviewSystem";/, 'import PlatformReviewSystem from "@/components/PlatformReviewSystem";\nimport FAQSection from "@/components/FAQSection";');
code = code.replace(/<PlatformReviewSystem \/>/, '<PlatformReviewSystem />\n\n      <FAQSection />');

fs.writeFileSync('src/app/page.tsx', code);
console.log("Added FAQ to page.tsx");
