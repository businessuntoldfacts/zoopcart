const fs = require('fs');
let code = fs.readFileSync('src/app/[username]/[productSlug]/request/page.tsx', 'utf8');

const regex = /<h3 className="font-extrabold text-slate-900 mb-4 mt-8 text-sm tracking-wider uppercase">Request Details<\/h3>[\s\S]*?<div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 mt-6 mb-24">/;

const newDetails = `
          <h3 className="font-extrabold text-slate-900 mb-4 mt-8 text-sm tracking-wider uppercase">Request Details</h3>
          
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 mb-1.5 block">Quantity <span className="text-pink-500">*</span></label>
              <div className="relative">
                <select value={formData.quantity} onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value)})} className="w-full h-14 pl-4 pr-10 rounded-xl border border-slate-200 bg-white outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 text-sm font-extrabold appearance-none transition-all">
                  {[1, 2, 3, 4, 5, 10, 20, 50].map(num => <option key={num} value={num}>{num}</option>)}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 mb-1.5 block">Required Date (Optional)</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type="date" value={formData.requiredDate} onChange={(e) => setFormData({...formData, requiredDate: e.target.value})} className="w-full h-14 pl-11 pr-4 rounded-xl border border-slate-200 bg-white outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 text-sm font-medium transition-all" />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 mb-1.5 block">Delivery Location <span className="text-pink-500">*</span></label>
              <div className="relative">
                <MapPin className="absolute left-4 top-4 w-4 h-4 text-slate-400" />
                <textarea required value={formData.delivery_location} onChange={(e) => setFormData({...formData, delivery_location: e.target.value})} placeholder="Enter full address" className="w-full h-24 pt-4 pb-4 pl-11 pr-4 rounded-xl border border-slate-200 bg-white outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 text-sm font-medium transition-all resize-none"></textarea>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 mt-6 mb-24">
`;

code = code.replace(regex, newDetails);

fs.writeFileSync('src/app/[username]/[productSlug]/request/page.tsx', code);
