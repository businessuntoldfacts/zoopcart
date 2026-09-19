const fs = require('fs');
let code = fs.readFileSync('src/app/dashboard/analytics/page.tsx', 'utf8');

// Fix conversion rate text
code = code.replace(/\{stats\.total === 0 \? '0%' : \`\$\{\(\(stats\.total \/ \(stats\.total \* 24 \+ 112\)\) \* 100\)\.toFixed\(1\)\}%`\}/, '{stats.conversionRate}%');

// Fix the empty state check at the bottom
code = code.replace(/\{stats\.total === 0 && \(/, '{stats.storeViews === 0 && stats.totalOrders === 0 && (');

fs.writeFileSync('src/app/dashboard/analytics/page.tsx', code);
console.log("Fixed missed replacements");
