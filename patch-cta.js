const fs = require('fs');
let code = fs.readFileSync('src/app/page.tsx', 'utf8');

const oldSectionRegex = /\{\/\* Bottom CTA \*\/\}\s*<section className="py-20 px-6 bg-slate-50">[\s\S]*?<\/section>/;

const newSection = `{/* Bottom CTA */}
      <section className="py-24 px-6 max-w-5xl mx-auto">
        <div className="bg-[#111111] rounded-[40px] p-12 md:p-20 text-center text-white shadow-2xl flex flex-col items-center">
            <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">Clean Orders. Fast Payments. No Mistakes.</h2>
            <p className="text-xl md:text-2xl text-slate-300 font-medium mb-10 max-w-2xl mx-auto">Start taking WhatsApp orders in minutes.</p>
            <Link href="/signup">
                <Button variant="secondary" size="lg" className="rounded-full text-lg font-bold px-10 py-8 bg-white text-black hover:bg-slate-100 border-0">
                    Start for free
                </Button>
            </Link>
        </div>
      </section>`;

code = code.replace(oldSectionRegex, newSection);

fs.writeFileSync('src/app/page.tsx', code);
console.log("Replaced Bottom CTA");
