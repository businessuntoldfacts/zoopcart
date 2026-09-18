const fs = require('fs');
let code = fs.readFileSync('src/components/StorefrontClient.tsx', 'utf8');

code = code.replace(/onClick=\{\(\) => \{ if\(window\.history\.length > 2\) router\.back\(\); else router\.push\('\/'\); \}\}/, 'onClick={() => { if (window.history.length > 1) router.back(); }}');

fs.writeFileSync('src/components/StorefrontClient.tsx', code);
