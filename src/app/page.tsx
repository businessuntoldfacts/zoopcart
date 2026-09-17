import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Play, ArrowRight, MessageCircle, ShoppingBag, Grid, Palette, Camera, Heart, HelpCircle, Star } from "lucide-react";

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
            <Link href="#reviews" className="hover:text-zyp-primary transition-colors">Reviews</Link>
          </nav>
          <div className="flex items-center">
            <Link href="/login" className="hidden md:block text-sm font-semibold text-zyp-textPrimary hover:text-zyp-primary mr-4">
              Log in
            </Link>
            <Link href="/signup" className="hidden md:block">
              <Button variant="primary" className="rounded-full px-6 shadow-sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
        <div className="flex-1 text-center lg:text-left z-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#0F172A] mb-6 leading-tight">
            Already selling through <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500">Instagram</span>, <span className="text-red-600">YouTube</span> or <span className="text-black">TikTok?</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-600 mb-8 font-medium leading-relaxed max-w-xl mx-auto lg:mx-0">
            Create your free Zypcart store in minutes.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
            <Link href="/signup" className="w-full sm:w-auto">
              <Button variant="primary" size="lg" className="rounded-full w-full text-base font-extrabold px-8 py-7 shadow-lg shadow-blue-600/30">
                Create My Free Zypcart Store
              </Button>
            </Link>
            <Link href="#how-it-works">
              <Button variant="ghost" size="lg" className="rounded-full w-full sm:w-auto text-base font-bold text-slate-500 hover:text-[#0F172A]">
                See how it works
              </Button>
            </Link>
          </div>
          
          <div className="mt-8 flex items-center justify-center lg:justify-start gap-4">
            <div className="flex -space-x-3">
              {[1,2,3,4].map(i => <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden"><img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${i}&backgroundColor=e2e8f0`} alt="Avatar" /></div>)}
            </div>
            <div className="text-sm font-bold text-[#0F172A]">
              Join <span className="text-blue-600">1,000+</span> social sellers
            </div>
          </div>
        </div>

        {/* Right side Phone Mockup */}
        <div className="flex-1 relative w-full flex justify-center lg:justify-end">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-blue-100 via-blue-50 to-purple-50 rounded-full blur-3xl -z-10" />
          
          <div className="relative w-[300px] h-[600px] bg-black rounded-[40px] p-3 shadow-2xl shadow-blue-900/20 rotate-[-2deg] hover:rotate-0 transition-transform duration-500">
            <div className="w-full h-full bg-[#F8FAFC] rounded-[32px] overflow-hidden flex flex-col relative border border-white/10">
              <div className="absolute top-0 inset-x-0 h-6 bg-black rounded-b-3xl w-1/2 mx-auto z-20"></div>
              
              <div className="bg-white pt-10 pb-4 px-4 shadow-sm z-10 flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600 text-lg">M</div>
                <div>
                  <h3 className="font-bold text-[#0F172A] text-sm">My Bakery</h3>
                  <p className="text-[10px] text-zyp-textMuted font-medium">@my_bakery_official</p>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-2xl border border-blue-100 shadow-sm flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-blue-900 text-sm">Store Performance</h3>
                    <p className="text-[10px] text-blue-700 font-medium">Last 7 days</p>
                  </div>
                  <div className="flex gap-2 text-center">
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

                <div className="bg-white p-3 rounded-2xl shadow-sm flex gap-3">
                  <div className="w-16 h-16 bg-blue-50 rounded-xl flex items-center justify-center text-2xl shrink-0">🍰</div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-[#0F172A]">Chocolate Cake</h4>
                    <p className="text-xs text-zyp-textMuted mt-0.5 mb-1">Rich and moist...</p>
                    <div className="text-sm font-bold text-zyp-primary">₹499</div>
                  </div>
                </div>

                <div className="bg-white p-3 rounded-2xl shadow-sm flex gap-3">
                  <div className="w-16 h-16 bg-pink-50 rounded-xl flex items-center justify-center text-2xl shrink-0">🧁</div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-[#0F172A]">Cupcakes</h4>
                    <p className="text-xs text-zyp-textMuted mt-0.5 mb-1">Soft & fluffy...</p>
                    <div className="text-sm font-bold text-zyp-primary">₹299</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="absolute -left-12 bottom-20 bg-white p-3 rounded-2xl shadow-xl flex items-center gap-3 animate-bounce" style={{animationDuration: '3s'}}>
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 flex items-center justify-center text-white">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
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
                  {step.num === 1 && <div className="absolute -inset-1 rounded-full border-2 border-zyp-primary/30 animate-pulse"></div>}
                </div>
                <div className="text-sm font-bold text-[#0F172A] whitespace-pre-line leading-snug">{step.title}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section id="reviews" className="py-24 bg-white border-y border-slate-200">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#0F172A] mb-4">Loved by Social Sellers</h2>
            <p className="text-slate-500 text-lg">See how Zypcart is helping creators and businesses grow.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {name: "Priya Sharma", role: "Home Baker", text: "Zypcart completely changed how I take orders. No more messy DMs, just a clean catalog link on my Instagram bio!"},
              {name: "Rahul Gupta", role: "Clothing Brand", text: "The checkout process is so smooth. My conversion rate doubled because customers can order in 3 clicks without downloading any app."},
              {name: "Sneha Reddy", role: "Reseller", text: "I share my products on WhatsApp groups. Now I just share my Zypcart link and all requests come perfectly organized to my dashboard."}
            ].map((review, i) => (
              <div key={i} className="bg-slate-50 border border-slate-100 rounded-3xl p-8 hover:shadow-md transition-shadow">
                <div className="flex gap-1 mb-4">
                  {[1,2,3,4,5].map(s => <Star key={s} className="w-5 h-5 fill-yellow-400 text-yellow-400" />)}
                </div>
                <p className="text-slate-700 font-medium leading-relaxed mb-6">"{review.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">{review.name.charAt(0)}</div>
                  <div>
                    <h4 className="font-bold text-[#0F172A] text-sm">{review.name}</h4>
                    <p className="text-xs text-slate-500 font-medium">{review.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-5xl mx-auto bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-12 text-center shadow-xl shadow-blue-900/20">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">Ready to grow your business?</h2>
          <p className="text-blue-100 text-lg mb-8 max-w-xl mx-auto">Join thousands of social sellers on Zypcart. Add products, share your link, and get more orders today.</p>
          <Link href="/signup">
            <Button className="bg-white text-zyp-primary hover:bg-gray-50 text-lg px-8 py-6 rounded-full font-bold shadow-lg">
              Create My Free Zypcart Store
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-white border-t border-zyp-border text-center">
        <div className="container mx-auto px-6 text-zyp-textMuted text-sm">
          <p>c {new Date().getFullYear()} Zypcart. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
