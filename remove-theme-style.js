const fs = require('fs');
let code = fs.readFileSync('src/components/StorefrontClient.tsx', 'utf8');

const regex = /\{theme === 'dark' && \(\s*<style dangerouslySetInnerHTML=\{\{__html: `[\s\S]*?`\}\} \/>\s*\)\}/;
code = code.replace(regex, '');

fs.writeFileSync('src/components/StorefrontClient.tsx', code);
