const fs = require('fs');
let code = fs.readFileSync('src/app/[username]/[productSlug]/page.tsx', 'utf8');

const replacement = `
               <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                     <Zap className="w-5 h-5" />
                  </div>
                  <div>
                     {deliveryType === 'free' ? (
                        <>
                           <h4 className="text-xs font-extrabold text-slate-900 mb-0.5">Free Delivery</h4>
                           <p className="text-[10px] font-medium text-slate-500">Enjoy zero shipping charges</p>
                        </>
                     ) : (
                        <>
                           <h4 className="text-xs font-extrabold text-slate-900 mb-0.5">Delivery Charge: ₹{deliveryCharge}</h4>
                           <p className="text-[10px] font-medium text-slate-500">Standard shipping fees apply</p>
                        </>
                     )}
                  </div>
               </div>
`;

code = code.replace(/<div className="flex gap-3">\s*<div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">\s*<Zap className="w-5 h-5" \/>\s*<\/div>\s*<div>\s*<h4 className="text-xs font-extrabold text-slate-900 mb-0\.5">Fast delivery<\/h4>\s*<p className="text-\[10px\] font-medium text-slate-500">Ships nationwide<\/p>\s*<\/div>\s*<\/div>/, replacement);

fs.writeFileSync('src/app/[username]/[productSlug]/page.tsx', code);
