const fs = require('fs');

let code = fs.readFileSync('src/components/StorefrontClient.tsx', 'utf8');

// The default gradient for the light theme should be completely monochrome or very subtle. Let's make it a clean black/dark slate gradient, or maybe just solid #111111, since they love the Take App look which uses black.
code = code.replace(/return 'bg-gradient-to-br from-indigo-700 via-purple-600 to-blue-500';/, "return 'bg-[#111111]';");

fs.writeFileSync('src/components/StorefrontClient.tsx', code);
console.log("Updated storefront hero gradient");
