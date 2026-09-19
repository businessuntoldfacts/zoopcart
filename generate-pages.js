const fs = require('fs');
const path = require('path');

const generatePage = (title, content) => `
import HeaderMenu from "@/components/HeaderMenu";

export const metadata = {
  title: "${title} | Zoopcart",
};

export default function Page() {
  return (
    <main className="min-h-screen bg-slate-50 flex flex-col pt-24">
      <HeaderMenu />
      <div className="flex-1 container mx-auto px-6 max-w-4xl py-12">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-8">${title}</h1>
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100 prose prose-slate max-w-none">
          ${content}
        </div>
      </div>
    </main>
  );
}
`;

const pages = {
  about: {
    title: 'About Us',
    content: '<p className="text-lg text-slate-600 mb-4">Zoopcart is the easiest way to turn your social media followers into paying customers. We empower creators and small businesses to launch their own digital storefronts in minutes, entirely for free.</p>'
  },
  privacy: {
    title: 'Privacy Policy',
    content: '<p className="text-lg text-slate-600 mb-4">Your privacy is important to us. This Privacy Policy outlines how Zoopcart collects, uses, and protects your personal information.</p>'
  },
  terms: {
    title: 'Terms of Service',
    content: '<p className="text-lg text-slate-600 mb-4">By using Zoopcart, you agree to these terms of service. Please read them carefully.</p>'
  },
  help: {
    title: 'Help Center',
    content: '<p className="text-lg text-slate-600 mb-4">Need help? We are here for you. Check out our guides below or contact our support team to get your store up and running.</p>'
  }
};

for (const [slug, data] of Object.entries(pages)) {
  const dirPath = path.join('src/app', slug);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  fs.writeFileSync(path.join(dirPath, 'page.tsx'), generatePage(data.title, data.content));
  console.log(`Generated /${slug}`);
}

