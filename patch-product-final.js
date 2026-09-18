const fs = require('fs');
let code = fs.readFileSync('src/app/dashboard/products/page.tsx', 'utf8');

// 1. AI Generator button injection
const aiButtonHTML = `
              <div className="flex justify-between items-end mb-1.5">
                <label className="text-sm font-bold text-white">Name <span className="text-pink-500">*</span></label>
                <button onClick={handleAIGenerate} disabled={generatingAI} className="text-xs font-extrabold text-pink-400 bg-pink-500/10 px-2.5 py-1 rounded-lg flex items-center gap-1 hover:bg-pink-500/20 transition-colors">
                  {generatingAI ? "✨ Generating..." : "✨ Optimize with AI"}
                </button>
              </div>
`;
code = code.replace(/<label className="text-sm font-bold text-white mb-1\.5 block">Name <span className="text-pink-500">\*<\/span><\/label>/, aiButtonHTML);

// 2. Delivery options UI (Dark theme UI since the form is dark)
const deliveryUI = `
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-bold text-white mb-1.5 block">Delivery <span className="text-pink-500">*</span></label>
                    <select required value={formData.delivery_type} onChange={(e: any) => setFormData({...formData, delivery_type: e.target.value})} className="w-full bg-black/50 border border-slate-700 text-white h-12 rounded-xl px-4 outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500/50 appearance-none">
                      <option value="free">Free Delivery</option>
                      <option value="paid">Paid (Charge)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-bold text-white mb-1.5 block">Delivery Charge (₹)</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">₹</span>
                      <input type="number" disabled={formData.delivery_type === 'free'} value={formData.delivery_charge} onChange={(e: any) => setFormData({...formData, delivery_charge: e.target.value})} placeholder={formData.delivery_type === 'free' ? "0" : "e.g. 50"} className="w-full bg-black/50 border border-slate-700 text-white h-12 rounded-xl pl-8 pr-4 outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500/50 font-medium disabled:opacity-50 disabled:bg-slate-900" />
                    </div>
                  </div>
                </div>
`;
// Insert Delivery UI after Category select
code = code.replace(/<\/select>\s*<\/div>/, '</select>\n                </div>\n' + deliveryUI);

// 3. Video Link UI
const videoLinkUI = `
                <div>
                  <label className="text-sm font-bold text-white mb-1.5 flex items-center justify-between">
                    <span>YouTube/Instagram Video Link</span>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-slate-800 px-2 py-0.5 rounded-full">Optional</span>
                  </label>
                  <Input value={formData.videoLink} onChange={(e: any) => setFormData({...formData, videoLink: e.target.value})} placeholder="https://youtube.com/..." className="bg-black/50 border-slate-700 text-white placeholder:text-slate-600 h-12 rounded-xl" />
                </div>
`;
// Insert Video Link UI after Description textarea block
code = code.replace(/<p className="text-xs text-slate-500 mt-2">A good description helps customers decide and builds trust\.<\/p>\s*<\/div>/, '<p className="text-xs text-slate-500 mt-2">A good description helps customers decide and builds trust.</p>\n                </div>\n' + videoLinkUI);


// Let's also fix the payload serialization for Video Link
// formData.videoLink is mapped in the edit but wait, the database products table DOES NOT HAVE video_link.
// I can stash it in description too, or use `availability` since it's just 'in_stock'. 
// Wait, I already stash Delivery Data in description via `---ZYP_DELIVERY:`
// Let's modify the serialization in handleAddProduct!

fs.writeFileSync('src/app/dashboard/products/page.tsx', code);
