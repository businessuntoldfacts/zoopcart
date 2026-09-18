const fs = require('fs');
let code = fs.readFileSync('src/app/[username]/[productSlug]/request/page.tsx', 'utf8');

// 1. Remove Budget from state
code = code.replace(/budget: "",\n/, '');

// 2. Parse delivery from description and compute final price
const parseDelivery = `
  let deliveryType = "free";
  let deliveryCharge = 0;
  let cleanDescription = product?.description || "";
  if (cleanDescription.includes('---ZYP_DELIVERY:')) {
    const parts = cleanDescription.split('---ZYP_DELIVERY:');
    try {
      const meta = JSON.parse(parts[1].split('---')[0]);
      deliveryType = meta.type || "free";
      deliveryCharge = meta.charge ? parseFloat(meta.charge) : 0;
    } catch(e) {}
  }
  
  const productTotal = (product?.price || 0) * formData.quantity;
  const finalPrice = productTotal + (deliveryType === 'paid' ? deliveryCharge : 0);
`;
code = code.replace(/const handleSubmit = async/, parseDelivery + '\n  const handleSubmit = async');

// 3. Remove budget from insertion payload
code = code.replace(/budget: formData\.budget \? parseFloat\(formData\.budget\) : null,/, 'budget: finalPrice,');
// 4. Update the "notes" in payload to show breakdown
code = code.replace(/notes: "Total Amount: ₹" \+ \(\(product\.price \|\| 0\) \* formData\.quantity\),/, 'notes: `Total: ₹${finalPrice} (Product: ₹${productTotal} + Delivery: ₹${deliveryType === "paid" ? deliveryCharge : 0})`,');

// 5. Remove Budget UI
code = code.replace(/<div>\s*<label className="text-xs font-bold text-slate-700 mb-1\.5 block">Your Budget \(₹\) <span className="text-pink-500">\*<\/span><\/label>[\s\S]*?<\/div>/, '');

// 6. Add Order Summary before Submit Button
const summaryUI = `
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 mt-6 mb-24">
            <h4 className="font-extrabold text-slate-900 text-sm mb-3">Order Summary</h4>
            <div className="flex justify-between text-sm font-medium text-slate-600 mb-2">
              <span>Item Total ({formData.quantity}x)</span>
              <span>₹{productTotal}</span>
            </div>
            <div className="flex justify-between text-sm font-medium text-slate-600 mb-3 pb-3 border-b border-slate-200">
              <span>Delivery Charge</span>
              <span className={deliveryType === 'free' ? "text-green-600 font-bold" : ""}>{deliveryType === 'free' ? "Free" : \`₹\${deliveryCharge}\`}</span>
            </div>
            <div className="flex justify-between text-lg font-extrabold text-slate-900">
              <span>Final Price</span>
              <span>₹{finalPrice}</span>
            </div>
          </div>
`;
code = code.replace(/<div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 z-50 p-4 pb-safe shadow-\[0_-10px_40px_rgba\(0,0,0,0\.06\)\]">/, summaryUI + '\n          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 z-50 p-4 pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.06)]">');

fs.writeFileSync('src/app/[username]/[productSlug]/request/page.tsx', code);
