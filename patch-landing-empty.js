const fs = require('fs');
let code = fs.readFileSync('src/app/page.tsx', 'utf8');

const regex = /\{realBusinesses\?\.map\(\(b: any\) => \(/;
const replacement = `{(!realBusinesses || realBusinesses.length === 0) ? (
              // Fallback dummy stores when DB is empty
              [
                { username: "fashionhub", business_name: "Fashion Hub", category: "Clothing" },
                { username: "sweetbakes", business_name: "Sweet Bakes", category: "Home Baker" },
                { username: "techgadgets", business_name: "Tech Gadgets", category: "Electronics" },
                { username: "homedecor", business_name: "Home Decor", category: "Interior" }
              ].map((b, i) => (
                <Link href={"/" + b.username} key={i} className="block group">
                  <div className="aspect-square rounded-2xl bg-slate-100 mb-4 overflow-hidden flex items-center justify-center text-slate-300 font-extrabold text-4xl border border-slate-200 group-hover:border-pink-300 transition-colors">
                    {b.business_name.charAt(0)}
                  </div>
                  <h4 className="font-extrabold text-[#0F172A] line-clamp-1">{b.business_name}</h4>
                  <p className="text-xs font-medium text-pink-500 mt-1">zoopcart.com/{b.username}</p>
                </Link>
              ))
            ) : realBusinesses.map((b: any) => (`;

code = code.replace(regex, replacement);
fs.writeFileSync('src/app/page.tsx', code);
