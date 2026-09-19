const fs = require('fs');

let code = fs.readFileSync('src/components/PlatformReviewSystem.tsx', 'utf8');

// Update heading to match Take App
code = code.replace(/<h2 className="text-3xl md:text-4xl font-extrabold text-\[\#0F172A\] w-full text-center">Real Stories & Reviews<\/h2>/, 
  `<div className="text-center w-full mb-8">
     <span className="text-blue-500 font-bold text-sm tracking-wide bg-blue-50 px-4 py-1 rounded-full mb-4 inline-block">Customers</span>
     <h2 className="text-4xl md:text-5xl font-extrabold text-[#111111] w-full text-center mb-4">What Customers Are Saying</h2>
     <p className="text-slate-500 text-lg md:text-xl font-medium max-w-xl mx-auto">Small businesses across the world run on Zoopcart.</p>
   </div>`);

// Update the grid layout to look more like the screenshot (stacked or masonry, let's use flex-col on mobile and grid on desktop, maybe larger cards)
code = code.replace(/<div className="grid md:grid-cols-3 gap-6">/, '<div className="grid md:grid-cols-3 gap-6">');

// Update the review card styling
// Screenshot uses simple rounded cards, black text, and subtle user info.
const newCard = `<div key={review.id} className="bg-white p-8 rounded-[32px] border border-slate-100 flex flex-col h-full shadow-sm hover:shadow-md transition-shadow">
              <p className="text-[#111111] leading-relaxed font-bold text-lg mb-8 flex-1">"{review.notes}"</p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#111111] flex items-center justify-center text-white font-extrabold text-lg">
                  {review.customer_name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-extrabold text-[#111111] text-base">{review.customer_name}</h4>
                  <p className="text-sm text-slate-500 font-medium">Verified Seller</p>
                </div>
              </div>
            </div>`;

code = code.replace(/<div key=\{review\.id\} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col h-full">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/g, newCard);

fs.writeFileSync('src/components/PlatformReviewSystem.tsx', code);
console.log("Updated Review System component");
