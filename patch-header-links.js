const fs = require('fs');

let code = fs.readFileSync('src/components/HeaderMenu.tsx', 'utf8');

// Desktop links
const newDesktopNav = `<nav className="hidden md:flex gap-8 text-sm font-medium text-slate-800">
            <Link href="/" className="hover:text-slate-500 transition-colors">Home</Link>
            <Link href="/features" className="hover:text-slate-500 transition-colors">Features</Link>
            <Link href="/#reviews" className="hover:text-slate-500 transition-colors">Reviews</Link>
            <Link href="/blog" className="hover:text-slate-500 transition-colors">Blog</Link>
          </nav>`;
code = code.replace(/<nav className="hidden md:flex gap-8 text-sm font-medium text-slate-800">[\s\S]*?<\/nav>/, newDesktopNav);

// Mobile links
const newMobileNavLinks = `<nav className="flex flex-col items-start w-full gap-0 overflow-y-auto max-h-[60vh]">
          <Link href="/" onClick={() => setIsOpen(false)} className="font-semibold text-slate-800 w-full py-4 border-b border-slate-100">Home</Link>
          <Link href="/features" onClick={() => setIsOpen(false)} className="font-semibold text-slate-800 w-full py-4 border-b border-slate-100">Features</Link>
          <Link href="/#reviews" onClick={() => setIsOpen(false)} className="font-semibold text-slate-800 w-full py-4 border-b border-slate-100">Reviews</Link>
          <Link href="/blog" onClick={() => setIsOpen(false)} className="font-semibold text-slate-800 w-full py-4 border-b border-slate-100">Blog</Link>
          <Link href="/help" onClick={() => setIsOpen(false)} className="font-semibold text-slate-800 w-full py-4 border-b border-slate-100">Help Center</Link>
          <Link href="/about" onClick={() => setIsOpen(false)} className="font-semibold text-slate-800 w-full py-4">About Us</Link>
        </nav>`;
code = code.replace(/<nav className="flex flex-col items-start w-full gap-0 overflow-y-auto max-h-\[60vh\]">[\s\S]*?<\/nav>/, newMobileNavLinks);

fs.writeFileSync('src/components/HeaderMenu.tsx', code);
console.log("Updated header links");
