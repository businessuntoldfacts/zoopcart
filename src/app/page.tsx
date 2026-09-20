import HeaderMenu from "@/components/HeaderMenu";
import PlatformReviewSystem from "@/components/PlatformReviewSystem";
import FAQSection from "@/components/FAQSection";
import Link from "next/link";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Play, Target, Zap, Smartphone, TrendingUp, Sparkles, ArrowRight, MessageCircle, ShoppingBag, Grid, Palette, Camera, Heart, HelpCircle, Star, Store, LineChart, LayoutTemplate, CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import AuthCatcher from "@/components/AuthCatcher";

export default async function LandingPage() {
  const { data: realBusinesses } = await supabase
    .from('businesses')
    .select('business_name, username')
    .order('created_at', { ascending: false })
    .limit(3);

  const defaultReviews = [
    {name: "Priya Sharma", role: "Home Baker", text: "Zoopcart completely changed how I take orders. No more messy DMs, just a clean catalog link on my Instagram bio!"},
    {name: "Rahul Gupta", role: "Clothing Brand", text: "The checkout process is so smooth. My conversion rate doubled because customers can order in 3 clicks without downloading any app."},
    {name: "Sneha Reddy", role: "Reseller", text: "I share my products on WhatsApp groups. Now I just share my Zoopcart link and all requests come perfectly organized to my dashboard."}
  ];

  const displayReviews = realBusinesses && realBusinesses.length > 0 
    ? realBusinesses.map((b, i) => ({
        name: b.business_name || `Store ${b.username}`,
        role: `zoopcart.com/${b.username}`,
        text: defaultReviews[i % 3].text
      }))
    : defaultReviews;

  return (
    <div className="min-h-screen bg-white font-sans overflow-x-hidden selection:bg-[#111111]/20">
      <AuthCatcher />
      {/* Header */}
      <HeaderMenu />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
        <div className="flex-1 text-center lg:text-left z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both">
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold tracking-tight text-[#0F172A] mb-6 leading-[1.1]">
            Already selling through <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">Instagram</span>,
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-500"> YouTube</span> or
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-700"> TikTok?</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-500 mb-10 font-medium leading-relaxed max-w-xl mx-auto lg:mx-0">
            Create your professional Zoopcart store in 60 seconds. <br className="hidden md:block" />
            <span className="text-[#111111] font-bold">No coding, no monthly fees.</span>
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
            <Link href="/signup" className="w-full sm:w-auto">
              <Button variant="primary" size="lg" className="rounded-full w-full text-base font-extrabold px-8 py-7 shadow-lg shadow-xl shadow-slate-900/10">
                Create My Free Zoopcart Store
              </Button>
            </Link>
            <Link href="#how-it-works">
              <Button variant="ghost" size="lg" className="rounded-full w-full sm:w-auto text-base font-bold text-slate-500 hover:text-[#0F172A]">
                See how it works
              </Button>
            </Link>
          </div>
          
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6">
            <div className="flex -space-x-4">
              {[
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
                "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
                "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop"
              ].map((url, i) => (
                <div key={i} className="w-12 h-12 rounded-full border-4 border-white shadow-lg overflow-hidden relative z-[10]">
                  <img src={url} alt="Seller" className="w-full h-full object-cover" />
                </div>
              ))}
              <div className="w-12 h-12 rounded-full border-4 border-white shadow-lg bg-[#111111] flex items-center justify-center text-[10px] text-white font-bold relative z-[5]">
                +1k
              </div>
            </div>
            <div className="flex flex-col items-center sm:items-start">
              <div className="flex items-center gap-1 mb-0.5">
                {[1,2,3,4,5].map(s => <Star key={s} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
              </div>
              <p className="text-sm font-bold text-[#0F172A]">
                Trusted by <span className="text-indigo-600">1,200+ active sellers</span>
              </p>
            </div>
          </div>
        </div>

        {/* Right side Phone Mockup */}
        <div className="flex-1 relative w-full flex justify-center lg:justify-end">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-slate-100 via-white to-slate-50 rounded-full blur-3xl -z-10" />
          
          <div className="relative w-[300px] h-[600px] bg-black rounded-[40px] p-3 shadow-2xl shadow-2xl shadow-slate-900/20 rotate-[-2deg] hover:rotate-0 transition-transform duration-500">
            <div className="w-full h-full bg-[#F8FAFC] rounded-[32px] overflow-hidden flex flex-col relative border border-white/10">
              <div className="absolute top-0 inset-x-0 h-6 bg-black rounded-b-3xl w-1/2 mx-auto z-20"></div>
              
              <div className="bg-white pt-10 pb-4 px-4 shadow-sm z-10 flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-900 text-lg">M</div>
                <div>
                  <h3 className="font-bold text-[#0F172A] text-sm">My Bakery</h3>
                  <p className="text-[10px] text-zyp-textMuted font-medium">@my_bakery_official</p>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-2xl border border-blue-100 shadow-sm flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-blue-900 text-sm">Store Performance</h3>
                    <p className="text-[10px] text-black font-medium">Last 7 days</p>
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
                  <div className="w-16 h-16 bg-slate-100 rounded-xl flex items-center justify-center text-2xl shrink-0">🍰</div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-[#0F172A]">Chocolate Cake</h4>
                    <p className="text-xs text-zyp-textMuted mt-0.5 mb-1">Rich and moist...</p>
                    <div className="text-sm font-bold text-[#111111]">₹499</div>
                  </div>
                </div>

                <div className="bg-white p-3 rounded-2xl shadow-sm flex gap-3">
                  <div className="w-16 h-16 bg-slate-100 rounded-xl flex items-center justify-center text-2xl shrink-0">🧁</div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-[#0F172A]">Cupcakes</h4>
                    <p className="text-xs text-zyp-textMuted mt-0.5 mb-1">Soft & fluffy...</p>
                    <div className="text-sm font-bold text-[#111111]">₹299</div>
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
      <section id="how-it-works" className="py-24 bg-white">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#0F172A] mb-4">How Zoopcart Works</h2>
            <p className="text-zyp-textMuted text-lg">From a social link to a completed order.</p>
          </div>
          
          <div className="flex justify-between items-center relative">
            <div className="absolute top-8 left-0 w-full h-0.5 bg-slate-200 -z-10"></div>
            
            {[
              { num: 1, title: "Create\nYour Store" },
              { num: 2, title: "Add\nProducts" },
              { num: 3, title: "Share\nAnywhere" },
              { num: 4, title: "Receive\nRequests" },
              { num: 5, title: "Manage\nOrders" }
            ].map((step) => (
              <div key={step.num} className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-white border-4 border-blue-50 shadow-sm flex items-center justify-center text-[#111111] font-bold text-xl mb-4 relative">
                  {step.num}
                  {step.num === 1 && <div className="absolute -inset-1 rounded-full border-2 border-[#111111]/30 animate-pulse"></div>}
                </div>
                <div className="text-sm font-bold text-[#0F172A] whitespace-pre-line leading-snug">{step.title}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      
      {/* Real Sellers Section */}
      <section id="real-sellers" className="py-24 bg-slate-50 border-y border-slate-200">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#0F172A] mb-4">Meet Our Real Sellers</h2>
            <p className="text-slate-500 text-lg">Thousands of businesses use Zoopcart to power their online sales.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {realBusinesses && realBusinesses.map((b, i) => (
              <Link key={i} href={`/${b.username}`} className="bg-white rounded-3xl p-6 flex flex-col items-center text-center border border-slate-100 shadow-sm hover:shadow-md hover:border-slate-300 transition-all group">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-extrabold text-2xl mb-4 group-hover:scale-110 transition-transform">
                  {b.business_name ? b.business_name.charAt(0).toUpperCase() : 'S'}
                </div>
                <h4 className="font-extrabold text-[#0F172A] line-clamp-1">{b.business_name || `Store ${b.username}`}</h4>
                <p className="text-xs font-medium text-[#111111] mt-1">zoopcart.com/{b.username}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>


      {/* Powerful Features */}
      <section className="py-24 bg-white border-y border-slate-200">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#0F172A] mb-4">Everything you need to sell online</h2>
            <p className="text-slate-500 text-lg">Powerful features designed specifically for social media sellers.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-50 border border-slate-100 rounded-3xl p-8 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-slate-200 rounded-2xl flex items-center justify-center mb-6">
                <Store className="w-6 h-6 text-slate-900" />
              </div>
              <h3 className="text-xl font-bold text-[#0F172A] mb-3">Custom Storefront</h3>
              <p className="text-slate-600 leading-relaxed font-medium">Personalize your store with beautiful themes, your logo, and branding. Create a professional catalog in minutes.</p>
            </div>
            <div className="bg-slate-50 border border-slate-100 rounded-3xl p-8 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center mb-6">
                <MessageCircle className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-[#0F172A] mb-3">WhatsApp Integration</h3>
              <p className="text-slate-600 leading-relaxed font-medium">Customers can easily chat with you on WhatsApp directly from your store to discuss custom requirements.</p>
            </div>
            <div className="bg-slate-50 border border-slate-100 rounded-3xl p-8 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center mb-6">
                <LineChart className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-[#0F172A] mb-3">Smart Analytics</h3>
              <p className="text-slate-600 leading-relaxed font-medium">Track your visitors, views, and conversion rates. Our AI gives you actionable insights to grow your sales.</p>
            </div>
            <div className="bg-slate-50 border border-slate-100 rounded-3xl p-8 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center mb-6">
                <LayoutTemplate className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-[#0F172A] mb-3">Order Management</h3>
              <p className="text-slate-600 leading-relaxed font-medium">Keep track of new, accepted, and completed orders in one clean dashboard. No more losing requests in DMs.</p>
            </div>
            <div className="bg-slate-50 border border-slate-100 rounded-3xl p-8 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-yellow-100 rounded-2xl flex items-center justify-center mb-6">
                <CheckCircle2 className="w-6 h-6 text-yellow-600" />
              </div>
              <h3 className="text-xl font-bold text-[#0F172A] mb-3">No Coding Required</h3>
              <p className="text-slate-600 leading-relaxed font-medium">You don't need any technical skills to launch. Zoopcart is built for creators, not developers.</p>
            </div>
            <div className="bg-slate-50 border border-slate-100 rounded-3xl p-8 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-slate-200 rounded-2xl flex items-center justify-center mb-6">
                <Heart className="w-6 h-6 text-slate-900" />
              </div>
              <h3 className="text-xl font-bold text-[#0F172A] mb-3">Built for Mobile</h3>
              <p className="text-slate-600 leading-relaxed font-medium">Your store is perfectly optimized for mobile devices, which is where 90% of your Instagram and TikTok buyers are.</p>
            </div>
          </div>
        </div>
      </section>

      <PlatformReviewSystem />

      <FAQSection />

      {/* Bottom CTA */}
      <section className="py-24 px-6 max-w-5xl mx-auto">
        <div className="bg-[#111111] rounded-[40px] p-12 md:p-20 text-center text-white shadow-2xl flex flex-col items-center">
            <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">Clean Orders. Fast Payments. No Mistakes.</h2>
            <p className="text-xl md:text-2xl text-slate-300 font-medium mb-10 max-w-2xl mx-auto">Start taking WhatsApp orders in minutes.</p>
            <Link href="/signup">
                <Button variant="secondary" size="lg" className="rounded-full text-lg font-bold px-10 py-8 bg-white text-black hover:bg-slate-100 border-0">
                    Start for free
                </Button>
            </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-50 pt-16 pb-8 border-t border-slate-200">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
            <div className="col-span-2 lg:col-span-2">
              <Link href="/" className="flex items-center mb-6">
                <Logo darkText={true} />
              </Link>
              <p className="text-slate-600 text-sm leading-relaxed max-w-sm mb-6">
                The easiest way to turn your social media followers into paying customers. Create your digital storefront in minutes, completely free.
              </p>
              <div className="flex items-center gap-4">
                <a href="/" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors text-slate-900">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" /></svg>
                </a>
                <a href="/" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors text-slate-900">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg>
                </a>
              </div>
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
          
          <div className="border-t border-slate-200 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-slate-500 text-sm">
              &copy; {new Date().getFullYear()} Zoopcart. All rights reserved.
            </p>
            <div className="flex gap-4 text-sm text-slate-500">
              <span>Made with ❤️ for Creators</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}




