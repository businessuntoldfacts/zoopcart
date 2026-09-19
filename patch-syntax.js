const fs = require('fs');

let code = fs.readFileSync('src/components/PlatformReviewSystem.tsx', 'utf8');

// Wrap the true branch in a fragment
code = code.replace(/<div className="grid md:grid-cols-3 gap-6">/, '<>\n          <div className="grid md:grid-cols-3 gap-6">');
code = code.replace(/<\/div>\s*<div className="flex justify-center mt-10">/, '</div>\n          <div className="flex justify-center mt-10">');
code = code.replace(/<\/Link>\s*<\/div>\s*\)\s*:\s*\(/, '</Link>\n          </div>\n          </>\n        ) : (');

fs.writeFileSync('src/components/PlatformReviewSystem.tsx', code);
console.log("Fixed JSX root element syntax error");
