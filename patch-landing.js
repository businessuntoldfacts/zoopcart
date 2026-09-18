const fs = require('fs');
let code = fs.readFileSync('src/app/page.tsx', 'utf8');

// Replace the static reviews section with an updated "Real Sellers" grid
const newRealSellers = `
      {/* Real Sellers Section */}
      <section id="real-sellers" className="py-24 bg-slate-50 border-y border-slate-200">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#0F172A] mb-4">Meet Our Real Sellers</h2>
            <p className="text-slate-500 text-lg">Thousands of businesses use Zypcart to power their online sales.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {realBusinesses && realBusinesses.map((b, i) => (
              <Link key={i} href={\`/\${b.username}\`} className="bg-white rounded-3xl p-6 flex flex-col items-center text-center border border-slate-100 shadow-sm hover:shadow-md hover:border-pink-200 transition-all group">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-extrabold text-2xl mb-4 group-hover:scale-110 transition-transform">
                  {b.business_name ? b.business_name.charAt(0).toUpperCase() : 'S'}
                </div>
                <h4 className="font-extrabold text-[#0F172A] line-clamp-1">{b.business_name || \`Store \${b.username}\`}</h4>
                <p className="text-xs font-medium text-pink-500 mt-1">zypcart.com/{b.username}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
`;

code = code.replace(/\{\/\* Reviews Section \*\/\}[\s\S]*?<\/section>/, newRealSellers);

fs.writeFileSync('src/app/page.tsx', code);
