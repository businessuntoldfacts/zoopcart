const fs = require('fs');

let code = fs.readFileSync('src/app/globals.css', 'utf8');

code = code.replace(/bg-gradient-to-br from-zyp-accent to-zyp-accentSecondary/g, "bg-[#111111] hover:bg-black");
code = code.replace(/shadow-zyp-accent\/20/g, "shadow-black/20");

fs.writeFileSync('src/app/globals.css', code);
console.log("Updated globals.css");
