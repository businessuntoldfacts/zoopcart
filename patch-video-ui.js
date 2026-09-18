const fs = require('fs');
let code = fs.readFileSync('src/app/[username]/[productSlug]/page.tsx', 'utf8');

const parseReplacement = `
  let cleanDescription = product.description || "";
  let deliveryType = "free";
  let deliveryCharge = 0;
  let videoLink = "";
  if (cleanDescription.includes('---ZYP_DELIVERY:')) {
    const parts = cleanDescription.split('---ZYP_DELIVERY:');
    cleanDescription = parts[0].trim();
    try {
      const meta = JSON.parse(parts[1].split('---')[0]);
      deliveryType = meta.type || "free";
      deliveryCharge = meta.charge || 0;
      videoLink = meta.video || "";
    } catch(e) {}
  }
`;
code = code.replace(/let cleanDescription = product\.description \|\| "";[\s\S]*?\} catch\(e\) \{\}\n\s*\}/, parseReplacement);

const videoBtnHTML = `
            {videoLink && (
              <div className="mb-6">
                <a href={videoLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full py-3.5 bg-red-50 text-red-600 font-extrabold rounded-2xl hover:bg-red-100 transition-colors border border-red-100">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                  Watch Product Video
                </a>
              </div>
            )}
`;
// Insert before description section
code = code.replace(/<div>\s*<h3 className="font-extrabold text-slate-900 text-lg mb-2">Description<\/h3>/, videoBtnHTML + '\n            <div>\n              <h3 className="font-extrabold text-slate-900 text-lg mb-2">Description</h3>');

fs.writeFileSync('src/app/[username]/[productSlug]/page.tsx', code);
