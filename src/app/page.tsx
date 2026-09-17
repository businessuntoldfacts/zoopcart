import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FDFDFC] text-[#0B0E14] font-sans selection:bg-zyp-accent selection:text-white overflow-x-hidden">
      {/* Navbar */}
      <header className="fixed top-0 w-full bg-[#FDFDFC]/80 backdrop-blur-md z-50 border-b border-black/5">
        <div className="container mx-auto px-6 h-20 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <img src="/logo.jpg" alt="Zypcart" className="h-10 object-contain rounded-md" />
          </div>
          <div className="space-x-6 flex items-center">
            <Link href="/login" className="text-sm font-semibold text-black/70 hover:text-black transition-colors">
              Log in
            </Link>
            <Link href="/signup">
              <Button variant="primary" className="shadow-lg shadow-zyp-accent/20">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6">
        <div className="container mx-auto text-center max-w-4xl relative">
          {/* Decorative background blur */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-zyp-accent/10 rounded-full blur-[100px] -z-10 pointer-events-none" />
          
          <h1 className="font-display text-6xl md:text-8xl font-extrabold tracking-tight mb-8 leading-[1.1]">
            Turn conversations <br className="hidden md:block" /> into <span className="text-transparent bg-clip-text bg-gradient-to-r from-zyp-accent to-zyp-accentSecondary">orders.</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-black/60 mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
            Give your customers one simple link to request an order, while you manage every request — and see what's working — in one place.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/signup">
              <Button variant="primary" size="lg" className="w-full sm:w-auto text-lg px-8 py-6 rounded-full shadow-xl shadow-zyp-accent/20 hover:scale-105 transition-transform">
                Create your Zypcart
              </Button>
            </Link>
            <Link href="#how-it-works">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto text-lg px-8 py-6 rounded-full border-2 border-black/10 bg-white text-black hover:bg-black/5 transition-colors">
                See how it works
              </Button>
            </Link>
          </div>

          <div className="mt-20 pt-10 border-t border-black/10 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-display font-bold text-black mb-2">10K+</div>
              <div className="text-sm font-semibold text-black/50 uppercase tracking-wider">Stores Created</div>
            </div>
            <div>
              <div className="text-4xl font-display font-bold text-black mb-2">2M+</div>
              <div className="text-sm font-semibold text-black/50 uppercase tracking-wider">Requests Processed</div>
            </div>
            <div>
              <div className="text-4xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-zyp-accent to-zyp-accentSecondary mb-2">0%</div>
              <div className="text-sm font-semibold text-black/50 uppercase tracking-wider">Commission Fees</div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section id="how-it-works" className="py-24 bg-black/5">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">How Zypcart works</h2>
            <p className="text-xl text-black/60 max-w-2xl mx-auto">Skip the complicated ecommerce setups. We designed this specifically for sellers who talk to their customers on social media.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Step 1 */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-black/5 hover:shadow-xl transition-shadow relative overflow-hidden group">
              <div className="w-16 h-16 bg-zyp-accent/10 text-zyp-accent rounded-2xl flex items-center justify-center text-2xl font-bold font-display mb-6 group-hover:scale-110 transition-transform">1</div>
              <h3 className="text-2xl font-bold mb-4">Create your catalog</h3>
              <p className="text-black/60 text-lg">Add your products, prices, and images in seconds. No complex inventory management.</p>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-black/5 hover:shadow-xl transition-shadow relative overflow-hidden group">
              <div className="w-16 h-16 bg-zyp-accent/10 text-zyp-accent rounded-2xl flex items-center justify-center text-2xl font-bold font-display mb-6 group-hover:scale-110 transition-transform">2</div>
              <h3 className="text-2xl font-bold mb-4">Share your link</h3>
              <p className="text-black/60 text-lg">Put your zypcart.com/store link in your Instagram bio, WhatsApp status, or send it directly in DMs.</p>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-black/5 hover:shadow-xl transition-shadow relative overflow-hidden group">
              <div className="w-16 h-16 bg-zyp-accent/10 text-zyp-accent rounded-2xl flex items-center justify-center text-2xl font-bold font-display mb-6 group-hover:scale-110 transition-transform">3</div>
              <h3 className="text-2xl font-bold mb-4">Receive organized requests</h3>
              <p className="text-black/60 text-lg">Customers fill out a clean form. You get a neat dashboard with all details instead of messy chat logs.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Built For Section */}
      <section className="py-24 px-6 bg-zyp-bg text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-zyp-accent/20 rounded-full blur-[120px] -z-10 pointer-events-none translate-x-1/3 -translate-y-1/3" />
        <div className="container mx-auto text-center max-w-5xl">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-16">Built for social sellers</h2>
          
          <div className="flex flex-wrap justify-center gap-4">
            {["Home Bakers", "Clothing Brands", "Jewellery Sellers", "Thrift Stores", "Custom Artists", "Event Planners", "Resellers"].map((tag) => (
              <span key={tag} className="px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/10 rounded-full text-lg font-medium hover:bg-white/20 transition-colors cursor-default">
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-20 bg-white/5 border border-white/10 rounded-3xl p-12 text-center">
            <h3 className="text-3xl font-display font-bold mb-6">Ready to upgrade your DMs?</h3>
            <Link href="/signup">
              <Button variant="primary" size="lg" className="text-lg px-8 py-6 rounded-full shadow-xl shadow-zyp-accent/20 hover:scale-105 transition-transform">
                Start your free store today
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-black border-t border-white/10 text-center">
        <div className="container mx-auto px-6 text-white/50">
          <div className="flex items-center justify-center gap-2 mb-6 opacity-50">
            <img src="/logo.jpg" alt="Zypcart" className="h-8 grayscale" />
          </div>
          <p>© {new Date().getFullYear()} Zypcart. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
