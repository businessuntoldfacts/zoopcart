const fs = require('fs');

function fixAuthPage(file) {
    let content = fs.readFileSync(file, 'utf8');
    
    // The logo is rendered outside the card. Let's move it inside!
    // Original structure:
    // <div className="mb-8 flex justify-center"> <Link href="/"> <Logo darkText={true} /> </Link> </div>
    // <div className="bg-white p-8 md:p-10 rounded-[2rem] shadow-xl shadow-slate-200/50 w-full max-w-md ...">
    //   <div className="text-center mb-8">
    //     <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Welcome back</h1>

    // Remove the outside logo wrapper
    content = content.replace(/<div className="mb-8 flex justify-center">[\s\S]*?<\/div>/, '');
    
    // Add it inside the card, above the h1
    content = content.replace(/<div className="text-center mb-8">/, '<div className="text-center mb-8">\n            <div className="flex justify-center mb-6">\n              <Logo darkText={true} />\n            </div>');

    // Reduce padding at the very top of the page
    content = content.replace(/pt-32 pb-12 px-6/g, 'pt-24 pb-12 px-6');
    content = content.replace(/min-h-screen bg-slate-50 flex flex-col items-center pt-32/g, 'min-h-screen bg-slate-50 flex flex-col items-center pt-16');

    fs.writeFileSync(file, content);
    console.log("Patched " + file);
}

fixAuthPage('src/app/login/page.tsx');
fixAuthPage('src/app/signup/page.tsx');

