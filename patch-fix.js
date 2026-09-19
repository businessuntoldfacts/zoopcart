const fs = require('fs');

let loginCode = fs.readFileSync('src/app/login/page.tsx', 'utf8');
loginCode = loginCode.replace(/<form onSubmit=\{handleLogin\} className="space-y-4"><span className="flex-shrink-0 mx-4 text-slate-400 text-sm font-medium">Or continue with email<\/span>\s*<div className="flex-grow border-t border-slate-200"><\/div>\s*<\/div>/, '<form onSubmit={handleLogin} className="space-y-4">');
fs.writeFileSync('src/app/login/page.tsx', loginCode);

let signupCode = fs.readFileSync('src/app/signup/page.tsx', 'utf8');
signupCode = signupCode.replace(/<form onSubmit=\{handleSignup\} className="space-y-4"><span className="flex-shrink-0 mx-4 text-slate-400 text-sm font-medium">Or continue with email<\/span>\s*<div className="flex-grow border-t border-slate-200"><\/div>\s*<\/div>/, '<form onSubmit={handleSignup} className="space-y-4">');
fs.writeFileSync('src/app/signup/page.tsx', signupCode);
