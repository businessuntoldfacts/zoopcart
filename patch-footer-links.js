const fs = require('fs');

let code = fs.readFileSync('src/app/page.tsx', 'utf8');

// Update specific links
code = code.replace(/<li><a href="\/" className="text-slate-600 hover:text-blue-600 transition-colors text-sm">About Us<\/a><\/li>/, '<li><Link href="/about" className="text-slate-600 hover:text-blue-600 transition-colors text-sm">About Us</Link></li>');
code = code.replace(/<li><a href="\/" className="text-slate-600 hover:text-blue-600 transition-colors text-sm">Privacy Policy<\/a><\/li>/, '<li><Link href="/privacy" className="text-slate-600 hover:text-blue-600 transition-colors text-sm">Privacy Policy</Link></li>');
code = code.replace(/<li><a href="\/" className="text-slate-600 hover:text-blue-600 transition-colors text-sm">Terms of Service<\/a><\/li>/, '<li><Link href="/terms" className="text-slate-600 hover:text-blue-600 transition-colors text-sm">Terms of Service</Link></li>');
code = code.replace(/<li><a href="\/" className="text-slate-600 hover:text-blue-600 transition-colors text-sm">Help Center<\/a><\/li>/, '<li><Link href="/help" className="text-slate-600 hover:text-blue-600 transition-colors text-sm">Help Center</Link></li>');

fs.writeFileSync('src/app/page.tsx', code);
console.log("Updated Footer Links");
