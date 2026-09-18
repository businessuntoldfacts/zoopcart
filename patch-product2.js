const fs = require('fs');
let code = fs.readFileSync('src/app/dashboard/products/page.tsx', 'utf8');

// AI Generator Function
const aiFunc = `
  const handleAIGenerate = (e: any) => {
    e.preventDefault();
    if (!formData.name) return alert("Please enter a basic product name first!");
    setGeneratingAI(true);
    setTimeout(() => {
      setFormData(prev => ({
        ...prev,
        name: prev.name.length < 15 ? \`Premium \${prev.name}\` : prev.name,
        description: \`Elevate your experience with our \${prev.name}. Crafted with precision and attention to detail, this product is designed to meet your everyday needs.\\n\\n✨ Key Features:\\n- Premium build quality\\n- Excellent durability\\n- Perfect for daily use\\n\\nOrder now and experience the difference!\`
      }));
      setGeneratingAI(false);
    }, 1500);
  };
`;
code = code.replace(/const handleAddProduct = async \(e: React\.FormEvent\) => \{/, aiFunc + '\n  const handleAddProduct = async (e: React.FormEvent) => {');

// Inject AI button near name
const aiButtonHTML = `
              <div className="flex justify-between items-end mb-1.5">
                <label className="text-sm font-bold text-slate-700">Product Name <span className="text-pink-500">*</span></label>
                <button onClick={handleAIGenerate} disabled={generatingAI} className="text-xs font-extrabold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg flex items-center gap-1 hover:bg-indigo-100 transition-colors">
                  {generatingAI ? "✨ Generating..." : "✨ Optimize with AI"}
                </button>
              </div>
`;
code = code.replace(/<label className="text-sm font-bold text-slate-700 mb-1\.5 block">Product Name <span className="text-pink-500">\*<\/span><\/label>/, aiButtonHTML);

// Inject Delivery options UI
const deliveryUI = `
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-bold text-slate-700 mb-1.5 block">Delivery <span className="text-pink-500">*</span></label>
                <select required value={formData.delivery_type} onChange={(e: any) => setFormData({...formData, delivery_type: e.target.value})} className="w-full bg-white border border-slate-200 text-slate-900 h-14 rounded-xl px-4 outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 font-medium">
                  <option value="free">Free Delivery</option>
                  <option value="paid">Paid (Charge)</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-bold text-slate-700 mb-1.5 block">Delivery Charge (₹)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                  <input type="number" disabled={formData.delivery_type === 'free'} value={formData.delivery_charge} onChange={(e: any) => setFormData({...formData, delivery_charge: e.target.value})} placeholder={formData.delivery_type === 'free' ? "0" : "e.g. 50"} className="w-full bg-white border border-slate-200 text-slate-900 h-14 rounded-xl pl-8 pr-4 outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 font-medium disabled:opacity-50 disabled:bg-slate-50" />
                </div>
              </div>
            </div>
`;
// Insert it before the Image upload block
code = code.replace(/<div>\s*<label className="text-sm font-bold text-slate-700 mb-1\.5 block">Product Image/, deliveryUI + '\n            <div>\n              <label className="text-sm font-bold text-slate-700 mb-1.5 block">Product Image');

fs.writeFileSync('src/app/dashboard/products/page.tsx', code);
