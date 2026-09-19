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
            <h1 className="text-4xl md:text-6xl font-extrabold text-[#111111] mb-6 tracking-tight">Powerful Features for Social Sellers</h1>
            <p className="text-xl text-slate-500 font-medium">Everything you need to run your WhatsApp, Instagram, or TikTok store effortlessly.</p>
          </div>
          
          <div className="prose prose-lg max-w-none text-slate-700 leading-relaxed bg-slate-50 p-8 md:p-12 rounded-[32px] border border-slate-100 shadow-sm" dangerouslySetInnerHTML={{ __html: `We built Zoopcart specifically for modern social media sellers. 
<br/><br/>
<h3 class="text-2xl font-bold mb-4 mt-8 text-[#111111]">1. Instant WhatsApp Ordering</h3>
Your customers can browse your beautiful catalog and send their structured order directly to your WhatsApp. No more back-and-forth messaging trying to understand what they want.
<br/><br/>
<h3 class="text-2xl font-bold mb-4 mt-8 text-[#111111]">2. Zero Transaction Fees</h3>
We don't take a cut of your hard-earned money. Connect your UPI, bank account, or accept Cash on Delivery with absolutely zero commission.
<br/><br/>
<h3 class="text-2xl font-bold mb-4 mt-8 text-[#111111]">3. Inventory Management</h3>
Never sell what you don't have. Track your stock levels in real-time, get low-stock alerts, and automatically mark products as 'Out of Stock' when they sell out.
<br/><br/>
<h3 class="text-2xl font-bold mb-4 mt-8 text-[#111111]">4. Custom Domain</h3>
Build your brand identity. Link your own custom domain (e.g., yourbrand.com) to your Zoopcart store and give your customers a premium shopping experience.` }} />
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