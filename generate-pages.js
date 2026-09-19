const fs = require('fs');
const path = require('path');

const pages = [
  {
    dir: 'features',
    title: 'Powerful Features for Social Sellers',
    subtitle: 'Everything you need to run your WhatsApp, Instagram, or TikTok store effortlessly.',
    content: `We built Zoopcart specifically for modern social media sellers. 
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
Build your brand identity. Link your own custom domain (e.g., yourbrand.com) to your Zoopcart store and give your customers a premium shopping experience.`
  },
  {
    dir: 'integrations',
    title: 'Integrations & Add-ons',
    subtitle: 'Connect Zoopcart with your favorite tools to supercharge your business.',
    content: `Zoopcart plays well with others. Integrate your store with the tools you already use to manage your business.
<br/><br/>
<h3 class="text-2xl font-bold mb-4 mt-8 text-[#111111]">Payment Gateways</h3>
We currently support manual UPI, bank transfers, and Cash on Delivery. Native integrations for Razorpay, Stripe, and PayPal are coming soon.
<br/><br/>
<h3 class="text-2xl font-bold mb-4 mt-8 text-[#111111]">Logistics & Delivery</h3>
Sync your orders with Shiprocket, Delhivery, and Dunzo to automatically generate shipping labels and tracking links (Coming Q3).
<br/><br/>
<h3 class="text-2xl font-bold mb-4 mt-8 text-[#111111]">Analytics</h3>
Connect Google Analytics and Meta Pixel to track visitor behavior, measure conversion rates, and run retargeting ads easily.`
  },
  {
    dir: 'blog',
    title: 'The Zoopcart Blog',
    subtitle: 'Tips, tricks, and strategies to grow your social commerce business.',
    content: `Read the latest articles from our team of e-commerce experts.
<br/><br/>
<div class="grid md:grid-cols-2 gap-8 mt-8">
  <div class="p-6 border border-slate-200 rounded-3xl hover:shadow-md transition-shadow">
    <span class="text-sm font-bold text-blue-600 mb-2 block">Growth</span>
    <h3 class="text-xl font-bold mb-3 text-[#111111]">How to optimize your Instagram Bio for Sales</h3>
    <p class="text-slate-600 mb-4">Learn the exact formula to turn your Instagram profile visitors into paying customers using a clean bio structure and a Zoopcart link.</p>
    <a href="#" class="font-semibold text-[#111111] hover:underline">Read article →</a>
  </div>
  <div class="p-6 border border-slate-200 rounded-3xl hover:shadow-md transition-shadow">
    <span class="text-sm font-bold text-blue-600 mb-2 block">Case Study</span>
    <h3 class="text-xl font-bold mb-3 text-[#111111]">How Sneha scaled her bakery to 100 orders/day</h3>
    <p class="text-slate-600 mb-4">Discover how moving from manual DMs to an automated Zoopcart catalog helped a local home baker scale operations seamlessly.</p>
    <a href="#" class="font-semibold text-[#111111] hover:underline">Read article →</a>
  </div>
</div>`
  },
  {
    dir: 'community',
    title: 'Seller Community',
    subtitle: 'Join thousands of ambitious sellers growing together.',
    content: `Building a business is hard, but you don't have to do it alone. The Zoopcart Seller Community is a private space for verified merchants to share strategies, ask questions, and network.
<br/><br/>
<h3 class="text-2xl font-bold mb-4 mt-8 text-[#111111]">Weekly Masterclasses</h3>
Join our live Zoom sessions every Friday where top sellers share their exact blueprints for running successful WhatsApp ad campaigns.
<br/><br/>
<h3 class="text-2xl font-bold mb-4 mt-8 text-[#111111]">Exclusive Resources</h3>
Get access to high-converting product photography templates, WhatsApp broadcast message scripts, and pricing calculators.
<br/><br/>
<h3 class="text-2xl font-bold mb-4 mt-8 text-[#111111]">How to join</h3>
The community is currently invite-only for merchants with at least 10 processed orders on Zoopcart. Check your dashboard for an invite link once you hit the milestone!`
  },
  {
    dir: 'success-stories',
    title: 'Customer Success Stories',
    subtitle: 'Real businesses. Real growth. See how they did it.',
    content: `Nothing makes us happier than seeing our merchants succeed. 
<br/><br/>
<h3 class="text-2xl font-bold mb-4 mt-8 text-[#111111]">From 10 to 500 orders a month</h3>
"Before Zoopcart, I was spending 6 hours a day just replying to WhatsApp messages asking 'price plz'. Now, customers see the catalog, build their cart, and send me a neat order summary. It literally gave me my life back." <br/><b>- Rahul, Clothing Brand Owner</b>
<br/><br/>
<h3 class="text-2xl font-bold mb-4 mt-8 text-[#111111]">Organizing chaos into a system</h3>
"I used to write down orders in a notebook and frequently missed shipments. The Zoopcart dashboard lets me change order statuses from 'Pending' to 'Shipped', and I never miss an order anymore." <br/><b>- Priya, Home Baker</b>`
  },
  {
    dir: 'careers',
    title: 'Careers at Zoopcart',
    subtitle: 'Help us build the future of social commerce.',
    content: `We are a small, fast-moving team dedicated to empowering independent creators and small businesses.
<br/><br/>
<h3 class="text-2xl font-bold mb-4 mt-8 text-[#111111]">Open Positions</h3>
<ul class="list-disc pl-5 space-y-4 text-slate-600 text-lg">
  <li><b>Senior Full-Stack Engineer (Next.js/Node)</b> - Remote (India)</li>
  <li><b>Product Designer (UI/UX)</b> - Remote (India)</li>
  <li><b>Customer Success Specialist</b> - Remote (India)</li>
</ul>
<br/><br/>
<p class="text-slate-600 text-lg">Don't see a role that fits? We are always looking for talented individuals. Send your resume to <b>careers@zoopcart.com</b> and tell us how you can help.</p>`
  },
  {
    dir: 'help',
    title: 'Help Center',
    subtitle: 'Find answers, tutorials, and contact support.',
    content: `How can we help you today?
<br/><br/>
<h3 class="text-2xl font-bold mb-4 mt-8 text-[#111111]">Getting Started</h3>
<ul class="list-disc pl-5 space-y-2 text-slate-600 text-lg">
  <li>How to create your first product</li>
  <li>Setting up WhatsApp ordering</li>
  <li>Connecting your payment methods</li>
</ul>
<br/><br/>
<h3 class="text-2xl font-bold mb-4 mt-8 text-[#111111]">Managing Orders</h3>
<ul class="list-disc pl-5 space-y-2 text-slate-600 text-lg">
  <li>How to update order status</li>
  <li>Filtering and searching past orders</li>
  <li>Exporting order data to CSV</li>
</ul>
<br/><br/>
<h3 class="text-2xl font-bold mb-4 mt-8 text-[#111111]">Contact Support</h3>
If you can't find what you're looking for, our team is ready to help. Email us at <b>support@zoopcart.com</b>.`
  },
  {
    dir: 'about',
    title: 'About Us',
    subtitle: 'Empowering the next million digital entrepreneurs.',
    content: `Zoopcart was built with a simple belief: Starting an online business should be incredibly easy and accessible to everyone.
<br/><br/>
In the age of social media, anyone with a smartphone can find an audience. However, turning that audience into customers has historically required complex website builders, expensive payment gateways, and technical knowledge.
<br/><br/>
We built Zoopcart to bridge that gap. By combining the conversational power of WhatsApp with a structured, beautiful digital catalog, we give sellers the best of both worlds. 
<br/><br/>
Our mission is to help 1 million small businesses, creators, and home-preneurs take control of their sales and build lasting brands.`
  },
  {
    dir: 'privacy',
    title: 'Privacy Policy',
    subtitle: 'How we handle and protect your data.',
    content: `Last updated: January 2026
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
You have the right to access, modify, or delete your data at any time. Contact us at privacy@zoopcart.com to submit a data request.`
  },
  {
    dir: 'terms',
    title: 'Terms of Service',
    subtitle: 'The rules of the road for using Zoopcart.',
    content: `Last updated: January 2026
<br/><br/>
By using Zoopcart, you agree to the following terms and conditions.
<br/><br/>
<h3 class="text-2xl font-bold mb-4 mt-8 text-[#111111]">Acceptable Use</h3>
You agree not to use Zoopcart to sell illegal goods, restricted substances, or engage in fraudulent activities. We reserve the right to suspend or terminate accounts that violate our policies.
<br/><br/>
<h3 class="text-2xl font-bold mb-4 mt-8 text-[#111111]">Account Responsibilities</h3>
You are responsible for maintaining the security of your account credentials. You are also responsible for fulfilling the orders placed by customers through your store. Zoopcart acts purely as an enabler and is not liable for disputes between you and your buyers.
<br/><br/>
<h3 class="text-2xl font-bold mb-4 mt-8 text-[#111111]">Service Availability</h3>
While we strive for 99.9% uptime, Zoopcart is provided "as is". We are not liable for any lost revenue due to temporary service interruptions or bugs.`
  }
];

pages.forEach(p => {
  const dirPath = path.join('src/app', p.dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  const template = `import HeaderMenu from "@/components/HeaderMenu";
import Link from "next/link";
import Logo from "@/components/Logo";

export default function Page() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-800 flex flex-col">
      <HeaderMenu />
      
      <main className="pt-32 pb-24 flex-grow">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-extrabold text-[#111111] mb-6 tracking-tight">${p.title}</h1>
            <p className="text-xl text-slate-500 font-medium">${p.subtitle}</p>
          </div>
          
          <div className="prose prose-lg max-w-none text-slate-700 leading-relaxed bg-slate-50 p-8 md:p-12 rounded-[32px] border border-slate-100 shadow-sm" dangerouslySetInnerHTML={{ __html: \`${p.content}\` }} />
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
}`;

  fs.writeFileSync(path.join(dirPath, 'page.tsx'), template);
});

console.log("Fixed page templates");
