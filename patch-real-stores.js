const fs = require('fs');
let code = fs.readFileSync('src/app/page.tsx', 'utf8');

const regex = /\{\(!realBusinesses \|\| realBusinesses.length === 0\) \? \([\s\S]*?\) \: realBusinesses\.map\(\(b: any\) => \(/;

const replacement = `{(!realBusinesses || realBusinesses.length === 0) ? (
              <div className="col-span-2 md:col-span-4 text-center py-12 text-slate-500 font-bold bg-slate-50 rounded-2xl border border-slate-100">
                No stores registered yet. Be the first to create yours!
              </div>
            ) : realBusinesses.map((b: any) => (`;

code = code.replace(regex, replacement);
fs.writeFileSync('src/app/page.tsx', code);
console.log("Fixed!");
