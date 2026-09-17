import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Play, ArrowRight, Instagram, MessageCircle, ShoppingBag, Grid, Palette, Camera, Heart, HelpCircle } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-zyp-bg font-sans overflow-x-hidden selection:bg-zyp-primary/20">
      {/* Navbar */}
      <header className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-zyp-border">
        <div className="container mx-auto px-6 h-16 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <img src="/logo.jpg" alt="Zypcart" className="h-8 object-contain rounded-md" />
            <span className="font-bold text-xl tracking-tight text-[#0F172A]">Zypcart</span>
          </div>
          <nav className="hidden md:flex gap-8 text-sm font-medium text-zyp-textPrimary">
            <Link href="#" className="hover:text-zyp-primary transition-colors">Home</Link>
            <Link href="#how-it-works" className="hover:text-zyp-primary transition-colors">How it works</Link>
            <Link href="#" className="hover:text-zyp-primary transition-colors">Pricing</Link>
          </nav>
          <div className="flex items-center">
            <Button variant="ghost" size="icon" className="md:hidden">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
            </Button>
            <Link href="/login" className="hidden md:block text-sm font-semibold text-zyp-textPrimary hover:text-zyp-primary mr-4">
              Log in
            </Link>
            <Link href="/signup" className="hidden md:block">
              <Button variant="primary" className="rounded-full px-6">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
        <div className="flex-1 text-center lg:text-left z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 text-zyp-primary text-xs font-bold tracking-wide uppercase mb-6 border border-blue-100">
            <span className="text-yellow-500">⚡</span> Built for social sellers
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#0F172A] mb-6 leading-[1.1]">
            Turn<br className="hidden md:block" /> conversations<br className="hidden md:block" /> into <span className="text-zyp-primary">orders.</span>
          </h1>
          
          <p className="text-lg text-zyp-textMuted mb-8 max-w-md mx-auto lg:mx-0 leading-relaxed">
            Give your customers one simple link to request an order while you manage every request in one place.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
            <Link href="/signup">
              <Button variant="primary" size="lg" className="rounded-full w-full sm:w-auto text-base font-semibold px-8 shadow-lg shadow-zyp-primary/30">
                Create Your Zypcart <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link href="#how-it-works">
              <Button variant="ghost" size="lg" className="rounded-full w-full sm:w-auto text-base font-semibold text-[#0F172A]">
                <div className="w-8 h-8 rounded-full bg-zyp-primary flex items-center justify-center mr-3">
                  <Play className="w-4 h-4 text-white fill-current ml-1" />
                </div>
                See how it works
              </Button>
            </Link>
          </div>
        </div>

        {/* Right side Phone Mockup */}
        <div className="flex-1 relative w-full flex justify-center lg:justify-end">
          {/* Blue glow background */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-blue-100 via-blue-50 to-purple-50 rounded-full blur-3xl -z-10" />
          
          <div className="relative w-[300px] h-[600px] bg-black rounded-[40px] p-3 shadow-2xl shadow-blue-900/20 rotate-[-2deg] hover:rotate-0 transition-transform duration-500">
            {/* Screen */}
            <div className="w-full h-full bg-[#F8FAFC] rounded-[32px] overflow-hidden flex flex-col relative border border-white/10">
              {/* Notch */}
              <div className="absolute top-0 inset-x-0 h-6 bg-black rounded-b-3xl w-1/2 mx-auto z-20"></div>
              
              {/* App Header */}
              <div className="bg-white pt-10 pb-4 px-4 shadow-sm z-10 flex items-center gap-2">
                <Button variant="ghost" size="icon" className="w-8 h-8 -ml-2 rounded-full"><ArrowRight className="w-4 h-4 rotate-180" /></Button>
                <img src="/logo.jpg" alt="Zypcart" className="h-5 rounded" />
                <span className="font-bold text-sm">Zypcart</span>
              </div>

              {/* App Content */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4">
                <div className="bg-white p-4 rounded-2xl shadow-sm text-center">
                  <div className="w-16 h-16 bg-red-100 rounded-full mx-auto mb-3 flex items-center justify-center text-2xl border-4 border-white shadow-sm">🎂</div>
                  <h3 className="font-bold text-[#0F172A]">ABC Cakes</h3>
                  <p className="text-xs text-zyp-textMuted mt-1">Custom cakes for every celebration 💖</p>
                  
                  <div className="flex justify-center gap-6 mt-4 border-t border-zyp-border pt-4">
                    <div>
                      <div className="text-sm font-bold text-[#0F172A]">12</div>
                      <div className="text-[10px] text-zyp-textMuted uppercase font-semibold">Products</div>
                    </div>
                    <div>
                      <div className="text-sm font-bold text-[#0F172A]">48</div>
                      <div className="text-[10px] text-zyp-textMuted uppercase font-semibold">Orders</div>
                    </div>
                  </div>
                </div>

                {/* Mock Product 1 */}
                <div className="bg-white p-3 rounded-2xl shadow-sm flex gap-3">
                  <div className="w-16 h-16 bg-blue-50 rounded-xl flex items-center justify-center text-2xl shrink-0">🍰</div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-[#0F172A]">Chocolate Cake</h4>
                    <p className="text-xs text-zyp-textMuted mt-0.5 mb-1">Rich and moist...</p>
                    <div className="text-sm font-bold text-zyp-primary">₹499</div>
                  </div>
                </div>

                {/* Mock Product 2 */}
                <div className="bg-white p-3 rounded-2xl shadow-sm flex gap-3">
                  <div className="w-16 h-16 bg-pink-50 rounded-xl flex items-center justify-center text-2xl shrink-0">🧁</div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-[#0F172A]">Cupcakes</h4>
                    <p className="text-xs text-zyp-textMuted mt-0.5 mb-1">Soft & fluffy...</p>
                    <div className="text-sm font-bold text-zyp-primary">₹299</div>
                  </div>
                </div>
              </div>

              {/* App Bottom Bar */}
              <div className="bg-white p-4 border-t border-zyp-border">
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-md shadow-green-600/20">
                  Request Order
                </Button>
              </div>
            </div>
          </div>
          
          {/* Floating UI elements near phone */}
          <div className="absolute -left-12 bottom-20 bg-white p-3 rounded-2xl shadow-xl flex items-center gap-3 animate-bounce" style={{animationDuration: '3s'}}>
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 flex items-center justify-center text-white">
              <Instagram className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#0F172A]">Share on</div>
              <div className="text-xs text-zyp-textMuted">Instagram</div>
            </div>
          </div>
          <div className="absolute -right-8 top-1/4 bg-white p-3 rounded-2xl shadow-xl flex items-center gap-3 animate-bounce" style={{animationDuration: '4s'}}>
            <div className="w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center text-white">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#0F172A]">Share on</div>
              <div className="text-xs text-zyp-textMuted">WhatsApp</div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 bg-white border-y border-zyp-border">
        <div className="container mx-auto px-6 text-center">
          <p className="text-sm font-bold text-zyp-textMuted uppercase tracking-wider mb-8">Trusted by thousands of social sellers</p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-70">
            <div className="flex flex-col items-center gap-2"><ShoppingBag className="w-6 h-6" /><span className="text-xs font-medium">Clothing</span></div>
            <div className="flex flex-col items-center gap-2"><svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg><span className="text-xs font-medium">Home Bakers</span></div>
            <div className="flex flex-col items-center gap-2"><HelpCircle className="w-6 h-6" /><span className="text-xs font-medium">Jewellery</span></div>
            <div className="flex flex-col items-center gap-2"><Heart className="w-6 h-6" /><span className="text-xs font-medium">Gifts</span></div>
            <div className="flex flex-col items-center gap-2"><Grid className="w-6 h-6" /><span className="text-xs font-medium">Interior</span></div>
            <div className="flex flex-col items-center gap-2"><Palette className="w-6 h-6" /><span className="text-xs font-medium">Artists</span></div>
            <div className="flex flex-col items-center gap-2"><Camera className="w-6 h-6" /><span className="text-xs font-medium">Photographers</span></div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-24 bg-zyp-bg">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#0F172A] mb-4">How Zypcart Works</h2>
            <p className="text-zyp-textMuted text-lg">From a social link to a completed order.</p>
          </div>
          
          <div className="flex justify-between items-center relative">
            {/* Connecting Line */}
            <div className="absolute top-8 left-0 w-full h-0.5 bg-blue-100 -z-10"></div>
            
            {[
              { num: 1, title: "Create\nYour Store" },
              { num: 2, title: "Add\nProducts" },
              { num: 3, title: "Share\nAnywhere" },
              { num: 4, title: "Receive\nRequests" },
              { num: 5, title: "Manage\nOrders" }
            ].map((step) => (
              <div key={step.num} className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-white border-4 border-blue-50 shadow-sm flex items-center justify-center text-zyp-primary font-bold text-xl mb-4 relative">
                  {step.num}
                  {/* Subtle active ring for first step as example */}
                  {step.num === 1 && <div className="absolute -inset-1 rounded-full border-2 border-zyp-primary/30 animate-pulse"></div>}
                </div>
                <div className="text-sm font-bold text-[#0F172A] whitespace-pre-line leading-snug">{step.title}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-12 text-center shadow-xl shadow-blue-900/20">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">Ready to grow your business?</h2>
          <p className="text-blue-100 text-lg mb-8 max-w-xl mx-auto">Join thousands of social sellers on Zypcart. Add products, share your link, and get more orders today.</p>
          <Link href="/signup">
            <Button className="bg-white text-zyp-primary hover:bg-gray-50 text-lg px-8 py-6 rounded-full font-bold shadow-lg">
              Create Your Zypcart &rarr;
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-white border-t border-zyp-border text-center">
        <div className="container mx-auto px-6 text-zyp-textMuted text-sm">
          <p>© {new Date().getFullYear()} Zypcart. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
