const fs = require('fs');
let code = fs.readFileSync('src/app/[username]/[productSlug]/page.tsx', 'utf8');

// The replacement logic
const newRender = `
  let cleanDescription = product.description || "";
  let deliveryData = null;
  if (cleanDescription.includes('---ZYP_DELIVERY:')) {
    const parts = cleanDescription.split('---ZYP_DELIVERY:');
    cleanDescription = parts[0].trim();
    try {
      deliveryData = JSON.parse(parts[1].split('---')[0]);
    } catch(e) {}
  } else if (cleanDescription.includes('---ZOOPCART_DELIVERY:')) {
    const parts = cleanDescription.split('---ZOOPCART_DELIVERY:');
    cleanDescription = parts[0].trim();
    try {
      deliveryData = JSON.parse(parts[1].split('---')[0]);
    } catch(e) {}
  }

  return (
`;

code = code.replace(/return \(/, newRender);

const oldDesc = `<p className="text-sm text-slate-600 font-medium leading-relaxed whitespace-pre-wrap">
               {product.description || "This is a sample product. You can add key features, specifications and other important information here for your customers."}
             </p>`;

const newDesc = `<p className="text-sm text-slate-600 font-medium leading-relaxed whitespace-pre-wrap">
               {cleanDescription || "This is a sample product. You can add key features, specifications and other important information here for your customers."}
             </p>
             {deliveryData && deliveryData.video && (
               <div className="mt-6">
                 <a href={deliveryData.video} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full py-4 bg-red-50 text-red-600 font-bold rounded-2xl hover:bg-red-100 transition-colors">
                   <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
                   Watch Product Video
                 </a>
               </div>
             )}
`;

code = code.replace(oldDesc, newDesc);

fs.writeFileSync('src/app/[username]/[productSlug]/page.tsx', code);
console.log("Updated product page!");
