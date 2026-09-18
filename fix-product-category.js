const fs = require('fs');
let code = fs.readFileSync('src/app/dashboard/products/page.tsx', 'utf8');

const selectHTML = `<select required value={formData.category} onChange={(e: any) => setFormData({...formData, category: e.target.value})} className="w-full bg-black/50 border border-slate-700 text-white h-12 rounded-xl px-4 outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500/50 appearance-none">
                  <option value="" disabled>Select category</option>
                  <option value="General">General</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Fashion">Fashion</option>
                  <option value="Home">Home</option>
                  <option value="Beauty">Beauty</option>
                  <option value="Grocery">Grocery</option>
                  <option value="Other">Other</option>
                </select>`;

code = code.replace(/<Input required value=\{formData.category\} onChange=\{\(e: any\) => setFormData\(\{\.\.\.formData, category: e\.target\.value\}\)\} placeholder="e\.g\. bags" className="bg-black\/50 border-slate-700 text-white placeholder:text-slate-600 h-12 rounded-xl" \/>/, selectHTML);

// For the edit modal:
code = code.replace(/<Input required value=\{editFormData\.category\} onChange=\{\(e: any\) => setEditFormData\(\{\.\.\.editFormData, category: e\.target\.value\}\)\} placeholder="e\.g\. bags" className="bg-black\/50 border-slate-700 text-white placeholder:text-slate-600 h-12 rounded-xl" \/>/, selectHTML.replace(/formData/g, 'editFormData'));

fs.writeFileSync('src/app/dashboard/products/page.tsx', code);
