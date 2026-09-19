const fs = require('fs');

// Fix login page
let loginCode = fs.readFileSync('src/app/login/page.tsx', 'utf8');
const googleBtnRegexLogin = /\s*<Button\s+type="button"\s+onClick=\{handleGoogleLogin\}[\s\S]*?<\/Button>\s*<div className="relative flex items-center py-2 mb-4">[\s\S]*?<\/div>\s*/;
const googleBtnMatchLogin = loginCode.match(googleBtnRegexLogin);
if (googleBtnMatchLogin) {
  // Remove it from the top
  loginCode = loginCode.replace(googleBtnRegexLogin, '');
  
  // Create a new divider and button string for the bottom
  const bottomGoogleBtnLogin = `
            <div className="relative flex items-center py-4 mt-2">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="flex-shrink-0 mx-4 text-slate-400 text-sm font-medium">Or continue with</span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>
            
            <Button 
              type="button" 
              onClick={handleGoogleLogin} 
              className="w-full text-base py-6 rounded-xl font-bold bg-white border-2 border-slate-200 text-slate-800 hover:bg-slate-50 flex items-center justify-center gap-3 transition-all shadow-none"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              Sign in with Google
            </Button>
`;
  // Insert it after the main submit button
  loginCode = loginCode.replace(/(<Button type="submit"[\s\S]*?<\/Button>)/, `$1${bottomGoogleBtnLogin}`);
  fs.writeFileSync('src/app/login/page.tsx', loginCode);
}

// Fix signup page
let signupCode = fs.readFileSync('src/app/signup/page.tsx', 'utf8');
const googleBtnRegexSignup = /\s*<Button\s+type="button"\s+onClick=\{handleGoogleSignup\}[\s\S]*?<\/Button>\s*<div className="relative flex items-center py-2 mb-4">[\s\S]*?<\/div>\s*/;
const googleBtnMatchSignup = signupCode.match(googleBtnRegexSignup);
if (googleBtnMatchSignup) {
  // Remove it from the top
  signupCode = signupCode.replace(googleBtnRegexSignup, '');
  
  // Create a new divider and button string for the bottom
  const bottomGoogleBtnSignup = `
            <div className="relative flex items-center py-4 mt-2">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="flex-shrink-0 mx-4 text-slate-400 text-sm font-medium">Or continue with</span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>
            
            <Button 
              type="button" 
              onClick={handleGoogleSignup} 
              className="w-full text-base py-6 rounded-xl font-bold bg-white border-2 border-slate-200 text-slate-800 hover:bg-slate-50 flex items-center justify-center gap-3 transition-all shadow-none"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              Sign up with Google
            </Button>
`;
  // Insert it after the main submit button
  signupCode = signupCode.replace(/(<Button type="submit"[\s\S]*?<\/Button>)/, `$1${bottomGoogleBtnSignup}`);
  fs.writeFileSync('src/app/signup/page.tsx', signupCode);
}

console.log("Moved Google buttons to the bottom");
