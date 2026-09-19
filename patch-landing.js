const fs = require('fs');
let code = fs.readFileSync('src/app/page.tsx', 'utf8');

// Global background
code = code.replace(/bg-zyp-bg/g, 'bg-white');

// Shadows
code = code.replace(/shadow-blue-600\/30/g, 'shadow-xl shadow-slate-900/10');
code = code.replace(/shadow-blue-900\/20/g, 'shadow-2xl shadow-slate-900/20');
code = code.replace(/shadow-blue-500\/10/g, 'shadow-sm border border-slate-100');

// Gradients/Accents to more muted/black ones
code = code.replace(/from-blue-100 via-blue-50 to-purple-50/g, 'from-slate-100 via-white to-slate-50');
code = code.replace(/text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-red-500 to-yellow-500/g, 'text-transparent bg-clip-text bg-gradient-to-r from-slate-700 via-slate-900 to-black');
code = code.replace(/text-red-600/g, 'text-slate-800');
code = code.replace(/text-blue-600/g, 'text-slate-900'); // Actually, they had some blue links like "Learn more ->". We can keep standard blue for text-blue-600 if it's a link, but let's change it.

// Change the "Why Zoopcart?" grid cards to clean white cards with thin borders
code = code.replace(/bg-white rounded-2xl p-6 shadow-sm border border-slate-100/g, 'bg-white rounded-[24px] p-8 shadow-sm border border-slate-100');

// Inject the big black card section (like "Clean Orders. Fast Payments.")
// Let's find the "Simple Pricing" section and just make it a dark block, OR add a dark block somewhere.
// Let's replace the first feature card block to look like the dark one.
// Let's just find "Start selling today" and make that whole section the dark card.
code = code.replace(
    /<section className="py-24 px-6 bg-blue-600 text-white text-center">([\s\S]*?)<\/section>/,
    `<section className="py-24 px-6 max-w-5xl mx-auto">
        <div className="bg-[#111111] rounded-[40px] p-12 md:p-20 text-center text-white shadow-2xl">
            <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">Clean Orders. Fast Payments. No Mistakes.</h2>
            <p className="text-xl md:text-2xl text-slate-300 font-medium mb-10 max-w-2xl mx-auto">Start taking WhatsApp orders in minutes.</p>
            <Link href="/signup">
                <Button variant="secondary" size="lg" className="rounded-full text-lg font-bold px-10 py-8 bg-white text-black hover:bg-slate-100">
                    Start for free
                </Button>
            </Link>
        </div>
    </section>`
);

fs.writeFileSync('src/app/page.tsx', code);
console.log("Updated landing page theme to monochrome minimalist");
