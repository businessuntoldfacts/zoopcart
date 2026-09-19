import HeaderMenu from "@/components/HeaderMenu";
import Link from "next/link";
import Logo from "@/components/Logo";

export default function Page() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-800 flex flex-col">
      <HeaderMenu />
      
      <main className="pt-32 pb-24 flex-grow">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-extrabold text-[#111111] mb-6 tracking-tight">Privacy Policy</h1>
            <p className="text-xl text-slate-500 font-medium">How we handle and protect your data.</p>
          </div>
          
          <div className="prose prose-lg max-w-none text-slate-700 leading-relaxed bg-slate-50 p-8 md:p-12 rounded-[32px] border border-slate-100 shadow-sm" dangerouslySetInnerHTML={{ __html: `Last updated: January 2026
<br/><br/>
At Zoopcart, we take your privacy seriously. This policy describes what personal data we collect and how we use it.
<br/><br/>
<h3 class="text-2xl font-bold mb-4 mt-8 text-[#111111]">Data we collect</h3>
When you create a store, we collect your business name, email, phone number, and product details. We also collect transactional data when customers place orders on your store.
<br/><br/>
<h3 class="text-2xl font-bold mb-4 mt-8 text-[#111111]">How we use your data</h3>
Your data is strictly used to provide the Zoopcart service, improve our platform, and communicate with you about your account. We never sell your personal data to third parties.
<br/><br/>
<h3 class="text-2xl font-bold mb-4 mt-8 text-[#111111]">Your Rights</h3>
You have the right to access, modify, or delete your data at any time. Contact us at privacy@zoopcart.com to submit a data request.` }} />
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-slate-50 pt-16 pb-8 border-t border-slate-200 mt-auto">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
            <div className="col-span-2 lg:col-span-2">
              <Link href="/" className="flex items-center mb-6">
                <Logo darkText={true} />
              </Link>
              <p className="text-slate-600 text-sm leading-relaxed max-w-sm mb-6">
                The easiest way to turn your social media followers into paying customers. Create your digital storefront in minutes, completely free.
              </p>
            </div>
            
            <div>
              <h4 className="text-slate-900 font-bold mb-4">Product</h4>
              <ul className="space-y-3">
                <li><Link href="/features" className="text-slate-600 hover:text-slate-900 transition-colors text-sm">Features</Link></li>
                <li><Link href="/integrations" className="text-slate-600 hover:text-slate-900 transition-colors text-sm">Integrations</Link></li>
                <li><Link href="/#faq" className="text-slate-600 hover:text-slate-900 transition-colors text-sm">FAQ</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-slate-900 font-bold mb-4">Resources</h4>
              <ul className="space-y-3">
                <li><Link href="/help" className="text-slate-600 hover:text-slate-900 transition-colors text-sm">Help Center</Link></li>
                <li><Link href="/blog" className="text-slate-600 hover:text-slate-900 transition-colors text-sm">Blog</Link></li>
                <li><Link href="/community" className="text-slate-600 hover:text-slate-900 transition-colors text-sm">Seller Community</Link></li>
                <li><Link href="/success-stories" className="text-slate-600 hover:text-slate-900 transition-colors text-sm">Success Stories</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-slate-900 font-bold mb-4">Company</h4>
              <ul className="space-y-3">
                <li><Link href="/about" className="text-slate-600 hover:text-slate-900 transition-colors text-sm">About Us</Link></li>
                <li><Link href="/careers" className="text-slate-600 hover:text-slate-900 transition-colors text-sm">Careers</Link></li>
                <li><Link href="/privacy" className="text-slate-600 hover:text-slate-900 transition-colors text-sm">Privacy Policy</Link></li>
                <li><Link href="/terms" className="text-slate-600 hover:text-slate-900 transition-colors text-sm">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-200 text-center">
            <p className="text-slate-500 text-sm">© 2026 Zoopcart. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}