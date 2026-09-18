const fs = require('fs');

function replaceNav(filePath) {
  if (!fs.existsSync(filePath)) return;
  let code = fs.readFileSync(filePath, 'utf8');
  
  // add import
  if (!code.includes("StoreBottomNav")) {
    code = code.replace(/import Link from "next\/link";/, 'import Link from "next/link";\nimport StoreBottomNav from "@/components/StoreBottomNav";');
  }
  
  // replace nav block
  code = code.replace(/\{\/\* Bottom Navigation \*\/\}\s*<nav className="fixed bottom-0[\s\S]*?<\/nav>/, '<StoreBottomNav username={business.username} />');
  fs.writeFileSync(filePath, code);
}

replaceNav('src/app/[username]/page.tsx');
replaceNav('src/app/[username]/saved/page.tsx');
replaceNav('src/app/[username]/track/page.tsx');
replaceNav('src/app/[username]/cart/page.tsx');
