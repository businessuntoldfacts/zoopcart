const fs = require('fs');
let code = fs.readFileSync('src/components/StorefrontClient.tsx', 'utf8');

// 1. Add state for selectedCategory
code = code.replace(/const \[activeTab, setActiveTab\] = useState\("Products"\);/, 'const [activeTab, setActiveTab] = useState("Products");\n  const [selectedCategory, setSelectedCategory] = useState("All");');

// 2. Extract actual categories and replace hardcoded categories block
const dynamicCategoriesCode = `
            {/* Categories */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar mt-4 pb-2">
              <button 
                onClick={() => setSelectedCategory('All')} 
                className={\`px-5 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-colors \${selectedCategory === 'All' ? 'bg-pink-500 text-white shadow-sm shadow-pink-500/20' : 'bg-white border border-slate-200 text-slate-600'}\`}
              >
                All
              </button>
              {Array.from(new Set(products.map(p => p.category).filter(Boolean))).map(cat => (
                <button 
                  key={cat} 
                  onClick={() => setSelectedCategory(cat)} 
                  className={\`px-5 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-colors \${selectedCategory === cat ? 'bg-pink-500 text-white shadow-sm shadow-pink-500/20' : 'bg-white border border-slate-200 text-slate-600'}\`}
                >
                  {cat}
                </button>
              ))}
            </div>
`;
code = code.replace(/\{\/\* Categories \*\/\}[\s\S]*?<\/div>/, dynamicCategoriesCode);

// 3. Filter products before rendering
code = code.replace(/products\.map\(\(product\) =>/g, '(selectedCategory === "All" ? products : products.filter(p => p.category === selectedCategory)).map((product) =>');
// 4. Update product length check
code = code.replace(/products\.length === 0 \?/g, '(selectedCategory === "All" ? products : products.filter(p => p.category === selectedCategory)).length === 0 ?');

// 5. Update the category badge on the product card
code = code.replace(/<div className="text-\[9px\] font-extrabold tracking-widest text-pink-500 uppercase mb-1">General<\/div>/g, '<div className="text-[9px] font-extrabold tracking-widest text-pink-500 uppercase mb-1">{product.category || "General"}</div>');

fs.writeFileSync('src/components/StorefrontClient.tsx', code);
