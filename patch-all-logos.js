const fs = require('fs');

function patchFile(filePath, darkText = false, needsImport = true) {
  if (!fs.existsSync(filePath)) return;
  let code = fs.readFileSync(filePath, 'utf8');
  
  if (needsImport && !code.includes('import Logo')) {
    // Try to insert import after 'lucide-react' or 'react' or 'next/link'
    if (code.includes('import Link from "next/link";')) {
      code = code.replace('import Link from "next/link";', 'import Link from "next/link";\nimport Logo from "@/components/Logo";');
    } else if (code.includes('import { supabase } from "@/lib/supabase";')) {
      code = code.replace('import { supabase } from "@/lib/supabase";', 'import { supabase } from "@/lib/supabase";\nimport Logo from "@/components/Logo";');
    } else {
      code = `import Logo from "@/components/Logo";\n` + code;
    }
  }

  const imgRegex = /<img src="\/logo\.png\?v=3"([^>]*?)>/g;
  code = code.replace(imgRegex, `<Logo ${darkText ? 'darkText={true} ' : ''}/>`);
  
  fs.writeFileSync(filePath, code);
  console.log(`Patched ${filePath}`);
}

// 1. page.tsx (Footer - dark background -> light text)
patchFile('src/app/page.tsx', false);

// 2. admin/layout.tsx (Sidebar - dark background -> light text)
patchFile('src/app/admin/layout.tsx', false);

// 3. admin/login/page.tsx (Form - dark background -> light text)
patchFile('src/app/admin/login/page.tsx', false);

// 4. dashboard/layout.tsx (Sidebar is dark, Mobile header is white)
// Let's manually patch dashboard layout because it needs BOTH light and dark text depending on the location
let dash = fs.readFileSync('src/app/dashboard/layout.tsx', 'utf8');
if (!dash.includes('import Logo')) {
  dash = dash.replace('import Link from "next/link";', 'import Link from "next/link";\nimport Logo from "@/components/Logo";');
}
// 1st img is sidebar (light text)
dash = dash.replace(/<img src="\/logo\.png\?v=3"([^>]*?)>/, '<Logo />');
// 2nd img is mobile header (dark text)
dash = dash.replace(/<img src="\/logo\.png\?v=3"([^>]*?)>/, '<Logo darkText={true} />');
fs.writeFileSync('src/app/dashboard/layout.tsx', dash);
console.log("Patched dashboard/layout.tsx");

// 5. login/page.tsx (White background -> dark text)
patchFile('src/app/login/page.tsx', true);

// 6. signup/page.tsx (White background -> dark text)
patchFile('src/app/signup/page.tsx', true);

// 7. StorefrontClient.tsx (White header -> dark text)
patchFile('src/components/StorefrontClient.tsx', true);

