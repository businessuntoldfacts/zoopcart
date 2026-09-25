"use client";
import { useState, useEffect } from "react";
import { Star, MessageCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import HeaderMenu from "@/components/HeaderMenu";
import Link from "next/link";
import Logo from "@/components/Logo";

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAllReviews() {
      const { data: host } = await supabase.from('businesses').select('id').eq('username', 'faisal').single();
      let bid = host?.id;
      if (!bid) {
        const { data: anyHost } = await supabase.from('businesses').select('id').limit(1).single();
        bid = anyHost?.id;
      }

      if (bid) {
        const { data } = await supabase
          .from('orders')
          .select('*')
          .eq('business_id', bid)
          .eq('status', 'platform_review')
          .order('created_at', { ascending: false });

        const defaultReviews = [
          {id: 'def1', customer_name: "Priya Sharma", quantity: 5, notes: "Zoopcart's workflows let us automate repetitive tasks, saving valuable time and resources.", avatar: "https://i.pravatar.cc/150?img=5", role: "Marketer", country: "🇮🇳 India"},
          {id: 'def2', customer_name: "Rahul Gupta", quantity: 5, notes: "Zoopcart is a great tool for any export business looking to manage sales efficiently and grow.", avatar: "https://i.pravatar.cc/150?img=11", role: "CEO", country: "🇮🇳 India"},
          {id: 'def3', customer_name: "Sneha Reddy", quantity: 5, notes: "With Zoopcart, I receive everything directly on my dashboard. It's very user-friendly.", avatar: "https://i.pravatar.cc/150?img=43", role: "Proprietor", country: "🇮🇳 India"},
          {id: 'def4', customer_name: "Vikram Malhotra", quantity: 5, notes: "Setting up our online store took less than 5 minutes. Customers love the clean WhatsApp order flow!", avatar: "https://i.pravatar.cc/150?img=60", role: "Boutique Owner", country: "🇮🇳 India"},
          {id: 'def5', customer_name: "Ananya Iyer", quantity: 5, notes: "No commission fees means I save thousands every month compared to other ordering platforms.", avatar: "https://i.pravatar.cc/150?img=47", role: "Home Baker", country: "🇮🇳 India"}
        ];

        if (data && data.length > 0) {
          setReviews([...data, ...defaultReviews]);
        } else {
          setReviews(defaultReviews);
        }
      }
      setLoading(false);
    }
    loadAllReviews();
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-800 flex flex-col">
      <HeaderMenu />

      <main className="pt-32 pb-24 flex-grow">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-16">
            <span className="text-[#111111] font-bold text-sm tracking-wide bg-slate-200/60 px-4 py-1 rounded-full mb-4 inline-block">Wall of Love</span>
            <h1 className="text-4xl md:text-6xl font-extrabold text-[#111111] mb-6 tracking-tight">What Social Sellers Say About Zoopcart</h1>
            <p className="text-xl text-slate-500 font-medium max-w-2xl mx-auto">Discover how thousands of modern entrepreneurs run their online automated storefronts seamlessly.</p>
          </div>

          {loading ? (
            <div className="text-center py-20 text-slate-400 font-bold text-xl">Loading all reviews...</div>
          ) : reviews.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-6">
              {reviews.map((review) => (
                <div key={review.id} className="bg-white p-8 rounded-[32px] border border-slate-100 flex flex-col h-full shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-[#111111] leading-relaxed font-bold text-lg mb-8 flex-1">&quot;{review.notes}&quot;</p>
                  <div className="flex items-center gap-4">
                    {review.avatar ? (
                      <img src={review.avatar} alt={review.customer_name} className="w-12 h-12 rounded-full object-cover border border-slate-200 shadow-sm" />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-[#111111] flex items-center justify-center text-white font-extrabold text-lg shadow-sm">
                        {review.customer_name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <h4 className="font-extrabold text-[#111111] text-base">{review.customer_name}</h4>
                      <p className="text-sm text-slate-500 font-medium">
                        {review.role || 'Verified Seller'} <span className="mx-1">·</span> {review.country || '🇮🇳 India'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-100">
              <MessageCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="font-bold text-slate-900">No reviews found</h3>
            </div>
          )}
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
                <li><Link href="/reviews" className="text-slate-900 font-bold transition-colors text-sm">Reviews</Link></li>
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
