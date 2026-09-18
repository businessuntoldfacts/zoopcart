const fs = require('fs');
let code = fs.readFileSync('src/app/[username]/[productSlug]/page.tsx', 'utf8');

const deliveryParse = `
  let cleanDescription = product.description || "";
  let deliveryType = "free";
  let deliveryCharge = 0;
  if (cleanDescription.includes('---ZYP_DELIVERY:')) {
    const parts = cleanDescription.split('---ZYP_DELIVERY:');
    cleanDescription = parts[0].trim();
    try {
      const meta = JSON.parse(parts[1].split('---')[0]);
      deliveryType = meta.type || "free";
      deliveryCharge = meta.charge || 0;
    } catch(e) {}
  }
`;
code = code.replace(/const products = business\.products \|\| \[\];/, 'const products = business.products || [];\n' + deliveryParse);
code = code.replace(/<p className="text-sm text-slate-600 leading-relaxed">\{product\.description\}<\/p>/, '<p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{cleanDescription}</p>');

// Update the Shipping Details block
const shippingBlockOld = `<div className="font-extrabold text-slate-900 text-sm mb-0\.5">Free Delivery<\/div>\\s*<div className="text-xs font-medium text-slate-500">Ships within 2-3 business days<\/div>`;
const shippingBlockNew = `{deliveryType === 'free' ? (
                        <>
                           <div className="font-extrabold text-slate-900 text-sm mb-0.5">Free Delivery</div>
                           <div className="text-xs font-medium text-slate-500">Enjoy zero shipping charges</div>
                        </>
                     ) : (
                        <>
                           <div className="font-extrabold text-slate-900 text-sm mb-0.5">Delivery Charge: ₹{deliveryCharge}</div>
                           <div className="text-xs font-medium text-slate-500">Standard shipping fees apply</div>
                        </>
                     )}`;
code = code.replace(/<div className="font-extrabold text-slate-900 text-sm mb-0\.5">Free Delivery<\/div>[\s\S]*?<div className="text-xs font-medium text-slate-500">Ships within 2-3 business days<\/div>/, shippingBlockNew);

fs.writeFileSync('src/app/[username]/[productSlug]/page.tsx', code);
