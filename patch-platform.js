const fs = require('fs');
let code = fs.readFileSync('src/components/PlatformReviewSystem.tsx', 'utf8');

code = code.replace(/<h2 className="text-3xl font-extrabold text-\[#0F172A\]">Real Sellers, Real Stories<\/h2>/, '<h2 className="text-3xl font-extrabold text-[#0F172A]">Real Stories & Reviews</h2>');

fs.writeFileSync('src/components/PlatformReviewSystem.tsx', code);
