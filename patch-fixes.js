const fs = require('fs');

// 1. Logo size fix
let logoCode = fs.readFileSync('src/components/Logo.tsx', 'utf8');
logoCode = logoCode.replace(/className="h-10 md:h-12 w-auto object-contain"/, 'className="h-14 md:h-16 w-auto object-contain"');
fs.writeFileSync('src/components/Logo.tsx', logoCode);
console.log("Updated Logo size");

// 2. Remove double logo from Signup and Login, and set background to white
let signupCode = fs.readFileSync('src/app/signup/page.tsx', 'utf8');
signupCode = signupCode.replace(/<header className="p-6 flex justify-center items-center w-full">[\s\S]*?<\/header>/, '');
signupCode = signupCode.replace(/bg-zyp-bg/, 'bg-white');
fs.writeFileSync('src/app/signup/page.tsx', signupCode);

let loginCode = fs.readFileSync('src/app/login/page.tsx', 'utf8');
loginCode = loginCode.replace(/<header className="p-6 flex justify-between items-center max-w-2xl mx-auto w-full">[\s\S]*?<\/header>/, '');
loginCode = loginCode.replace(/bg-zyp-bg/, 'bg-white');
// Add Sign up link to the bottom of the card in login page
loginCode = loginCode.replace(/<\/form>/, '</form>\n            <div className="mt-6 text-center text-sm text-zyp-textMuted">\n              New to Zoopcart? <Link href="/signup" className="font-bold text-[#111111] hover:underline">Sign up</Link>\n            </div>');
fs.writeFileSync('src/app/login/page.tsx', loginCode);
console.log("Removed double logos and fixed auth backgrounds");

// 3. Fix HeaderMenu
let headerCode = fs.readFileSync('src/components/HeaderMenu.tsx', 'utf8');

// The new mobile menu will look like the popup card in the screenshot.
const newMobileNav = `
      {/* Mobile Nav Overlay */}
      <div className={\`fixed inset-0 bg-black/40 z-40 transition-all duration-300 md:hidden \${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}\`} onClick={() => setIsOpen(false)}></div>
      <div className={\`fixed top-4 left-4 right-4 bg-white rounded-3xl z-50 flex flex-col p-6 transition-all duration-300 transform md:hidden shadow-2xl \${isOpen ? 'translate-y-0 opacity-100 visible' : '-translate-y-10 opacity-0 invisible'}\`}>
        <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-4">
          <Link href="/" onClick={() => setIsOpen(false)} className="flex items-center">
            <Logo darkText={true} />
          </Link>
          <button className="text-slate-800 p-2" onClick={() => setIsOpen(false)}>
            <X className="w-6 h-6" />
          </button>
        </div>
        <nav className="flex flex-col items-start w-full gap-1">
          <Link href="/" onClick={() => setIsOpen(false)} className="hover:text-slate-500 font-medium text-slate-900 w-full py-4 border-b border-slate-100">Home</Link>
          <Link href="/#how-it-works" onClick={() => setIsOpen(false)} className="hover:text-slate-500 font-medium text-slate-900 w-full py-4 border-b border-slate-100">How it works</Link>
          <Link href="/#reviews" onClick={() => setIsOpen(false)} className="hover:text-slate-500 font-medium text-slate-900 w-full py-4 border-b border-slate-100">Reviews</Link>
          
          <div className="flex flex-col w-full gap-3 mt-6">
            <Link href="/login" onClick={() => setIsOpen(false)} className="w-full">
              <Button variant="secondary" className="w-full py-6 rounded-full font-bold border-slate-200 text-slate-800">Log in</Button>
            </Link>
            <Link href="/signup" onClick={() => setIsOpen(false)} className="w-full">
              <Button variant="primary" className="w-full py-6 rounded-full font-bold">Start free</Button>
            </Link>
          </div>
        </nav>
      </div>`;

headerCode = headerCode.replace(/\{\/\* Mobile Nav Overlay \([\s\S]*?\) \*\/\}[\s\S]*?<\/div>/, newMobileNav);
fs.writeFileSync('src/components/HeaderMenu.tsx', headerCode);
console.log("Patched HeaderMenu popup");
