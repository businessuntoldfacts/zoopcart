const fs = require('fs');

let code = fs.readFileSync('src/app/page.tsx', 'utf8');

// Replace Product section
code = code.replace(/<h4 className="text-slate-900 font-bold mb-4">Product<\/h4>\s*<ul className="space-y-3">[\s\S]*?<\/ul>/, 
`<h4 className="text-slate-900 font-bold mb-4">Product</h4>
                <ul className="space-y-3">
                  <li><Link href="/features" className="text-slate-600 hover:text-slate-900 transition-colors text-sm">Features</Link></li>
                  <li><Link href="/integrations" className="text-slate-600 hover:text-slate-900 transition-colors text-sm">Integrations</Link></li>
                  <li><Link href="/#faq" className="text-slate-600 hover:text-slate-900 transition-colors text-sm">FAQ</Link></li>
                </ul>`);

// Replace Resources section
code = code.replace(/<h4 className="text-slate-900 font-bold mb-4">Resources<\/h4>\s*<ul className="space-y-3">[\s\S]*?<\/ul>/, 
`<h4 className="text-slate-900 font-bold mb-4">Resources</h4>
                <ul className="space-y-3">
                  <li><Link href="/help" className="text-slate-600 hover:text-slate-900 transition-colors text-sm">Help Center</Link></li>
                  <li><Link href="/blog" className="text-slate-600 hover:text-slate-900 transition-colors text-sm">Blog</Link></li>
                  <li><Link href="/community" className="text-slate-600 hover:text-slate-900 transition-colors text-sm">Seller Community</Link></li>
                  <li><Link href="/success-stories" className="text-slate-600 hover:text-slate-900 transition-colors text-sm">Success Stories</Link></li>
                </ul>`);

// Replace Company section
code = code.replace(/<h4 className="text-slate-900 font-bold mb-4">Company<\/h4>\s*<ul className="space-y-3">[\s\S]*?<\/ul>/, 
`<h4 className="text-slate-900 font-bold mb-4">Company</h4>
                <ul className="space-y-3">
                  <li><Link href="/about" className="text-slate-600 hover:text-slate-900 transition-colors text-sm">About Us</Link></li>
                  <li><Link href="/careers" className="text-slate-600 hover:text-slate-900 transition-colors text-sm">Careers</Link></li>
                  <li><Link href="/privacy" className="text-slate-600 hover:text-slate-900 transition-colors text-sm">Privacy Policy</Link></li>
                  <li><Link href="/terms" className="text-slate-600 hover:text-slate-900 transition-colors text-sm">Terms of Service</Link></li>
                </ul>`);

fs.writeFileSync('src/app/page.tsx', code);
console.log("Updated footer links in page.tsx");
