const fs = require('fs');
let code = fs.readFileSync('src/app/dashboard/layout.tsx', 'utf8');

// Replace the avatar rendering logic to ALWAYS use the gradient letter, ignoring the store image which is meant for the storefront banner.
code = code.replace(/\{businessData\.image \? \([\s\S]*?\) : \([\s\S]*?businessData\.name\.charAt\(0\)\.toUpperCase\(\)[\s\S]*?\)\}/, '{businessData.name ? businessData.name.charAt(0).toUpperCase() : "S"}');

fs.writeFileSync('src/app/dashboard/layout.tsx', code);
console.log("Forced profile avatar to use premium gradient letter instead of store banner image");
