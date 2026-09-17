import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen bg-zyp-lightSurface text-zyp-bg dark:bg-zyp-bg dark:text-zyp-textPrimary">
      {/* Navbar */}
      <header className="container mx-auto px-6 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <img src="/logo.jpg" alt="Zypcart" className="h-10" />
        </div>
        <div className="space-x-4">
          <Link href="/login" className="text-sm font-medium hover:text-zyp-accent transition-colors">
            Log in
          </Link>
          <Link href="/signup">
            <Button size="sm">Get Started</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-6 pt-20 pb-32 text-center max-w-4xl">
        <h1 className="font-display text-5xl md:text-7xl font-bold leading-tight tracking-tight mb-8">
          Turn conversations into <span className="text-zyp-accent">orders.</span>
        </h1>
        <p className="text-lg md:text-xl text-zyp-textMuted mb-12 max-w-2xl mx-auto">
          Give your customers one simple link to request an order, while you manage every request — and see what's working — in one place.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/signup">
            <Button size="lg" className="w-full sm:w-auto">Create your Zypcart</Button>
          </Link>
          <Button variant="secondary" size="lg" className="w-full sm:w-auto">
            See how it works
          </Button>
        </div>

        {/* Social Proof */}
        <div className="mt-24 py-8 border-y border-white/10 flex flex-col md:flex-row justify-center gap-12 text-zyp-textMuted">
          <div>
            <div className="text-3xl font-display font-bold text-zyp-textPrimary">10k+</div>
            <div className="text-sm">Stores Created</div>
          </div>
          <div>
            <div className="text-3xl font-display font-bold text-zyp-textPrimary">2M+</div>
            <div className="text-sm">Requests Processed</div>
          </div>
          <div>
            <div className="text-3xl font-display font-bold text-zyp-textPrimary">0%</div>
            <div className="text-sm">Commission Fees</div>
          </div>
        </div>

        {/* Built For Section */}
        <div className="mt-24">
          <h2 className="text-sm font-semibold tracking-widest uppercase text-zyp-textMuted mb-8">Built for social sellers</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {["Home Bakers", "Clothing Sellers", "Jewellery Businesses", "Gift Businesses", "Interior Designers", "Custom Furniture Makers", "Artists", "Photographers", "Wedding Vendors", "Others"].map((category) => (
              <span key={category} className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm">
                {category}
              </span>
            ))}
          </div>
        </div>

        {/* How it works */}
        <div className="mt-32 text-left">
          <h2 className="font-display text-4xl font-bold text-center mb-16">How Zypcart works</h2>
          <div className="grid md:grid-cols-5 gap-8">
            {[
              { title: "Create store", desc: "Set up your free Zypcart link." },
              { title: "Add products", desc: "List your items with images and prices." },
              { title: "Share link", desc: "Post your link on Instagram, WhatsApp, anywhere." },
              { title: "Receive requests", desc: "Customers order without signing up." },
              { title: "Manage & track", desc: "Track performance and manage statuses in one place." },
            ].map((step, i) => (
              <div key={i} className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-zyp-accent/10 text-zyp-accent flex items-center justify-center font-display font-bold text-xl mb-4">
                  {i + 1}
                </div>
                <h3 className="font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-zyp-textMuted">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 text-sm text-zyp-textMuted">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            © {new Date().getFullYear()} Zypcart. All rights reserved.
          </div>
          <div className="space-x-6">
            <Link href="/terms" className="hover:text-zyp-textPrimary">Terms of Service</Link>
            <Link href="/privacy" className="hover:text-zyp-textPrimary">Privacy Policy</Link>
            <Link href="/refund" className="hover:text-zyp-textPrimary">Refund Policy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
