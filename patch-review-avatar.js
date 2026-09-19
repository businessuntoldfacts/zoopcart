const fs = require('fs');

let code = fs.readFileSync('src/components/PlatformReviewSystem.tsx', 'utf8');

// 1. Update the defaultReviews array to include avatar, role, and country
const newDefaultReviews = `const defaultReviews = [
          {id: 'def1', customer_name: "Priya Sharma", quantity: 5, notes: "Zoopcart's workflows let us automate repetitive tasks, saving valuable time and resources.", avatar: "https://i.pravatar.cc/150?img=5", role: "Marketer", country: "🇮🇳 India"},
          {id: 'def2', customer_name: "Rahul Gupta", quantity: 5, notes: "Zoopcart is a great tool for any export business looking to manage sales efficiently and grow.", avatar: "https://i.pravatar.cc/150?img=11", role: "CEO", country: "🇮🇳 India"},
          {id: 'def3', customer_name: "Sneha Reddy", quantity: 5, notes: "With Zoopcart, I receive everything directly on my WhatsApp number. It's very user-friendly.", avatar: "https://i.pravatar.cc/150?img=43", role: "Proprietor", country: "🇮🇳 India"}
        ];`;

code = code.replace(/const defaultReviews = \[[\s\S]*?\];/, newDefaultReviews);

// 2. Update the JSX for the avatar and subtitle
const oldJsxAvatar = /<div className="w-12 h-12 rounded-full bg-\[\#111111\] flex items-center justify-center text-white font-extrabold text-lg">\s*\{review\.customer_name\.charAt\(0\)\.toUpperCase\(\)\}\s*<\/div>/;
const newJsxAvatar = `{review.avatar ? (
                    <img src={review.avatar} alt={review.customer_name} className="w-12 h-12 rounded-full object-cover border border-slate-200 shadow-sm" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-[#111111] flex items-center justify-center text-white font-extrabold text-lg shadow-sm">
                      {review.customer_name.charAt(0).toUpperCase()}
                    </div>
                  )}`;
code = code.replace(oldJsxAvatar, newJsxAvatar);

const oldJsxSubtitle = /<p className="text-sm text-slate-500 font-medium">Verified Seller<\/p>/;
const newJsxSubtitle = `<p className="text-sm text-slate-500 font-medium">
                      {review.role || 'Verified Seller'} <span className="mx-1">·</span> {review.country || '🇮🇳 India'}
                    </p>`;
code = code.replace(oldJsxSubtitle, newJsxSubtitle);

// 3. Add "More reviews ->" below the grid
const moreReviewsLink = `</div>
          <div className="flex justify-center mt-10">
            <Link href="#reviews" className="text-blue-600 font-semibold hover:underline flex items-center gap-1">
              More reviews <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
          </div>
        ) : (`;

// We need to add Link import if it's not there.
if (!code.includes('import Link from "next/link";')) {
    code = code.replace(/import \{ Button \} from "@\/components\/ui\/button";/, 'import { Button } from "@/components/ui/button";\nimport Link from "next/link";');
}

code = code.replace(/<\/div>\s*\)\s*:\s*\(/, moreReviewsLink);

fs.writeFileSync('src/components/PlatformReviewSystem.tsx', code);
console.log("Updated Review System with Avatars, Roles, Countries, and More Links");
