"use client";
import { useState, useEffect } from "react";
import { Star, MessageCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function PlatformReviewSystem() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);
  const [platformBusinessId, setPlatformBusinessId] = useState<string | null>(null);

  useEffect(() => {
    async function loadReviews() {
      // Find a host business for platform reviews
      const { data: host } = await supabase.from('businesses').select('id').eq('username', 'faisal').single();
      let bid = host?.id;
      if (!bid) {
        const { data: anyHost } = await supabase.from('businesses').select('id').limit(1).single();
        bid = anyHost?.id;
      }
      setPlatformBusinessId(bid);

      if (bid) {
        const { data } = await supabase
          .from('orders')
          .select('*')
          .eq('business_id', bid)
          .eq('status', 'platform_review')
          .order('created_at', { ascending: false })
          .limit(30);
        
        const defaultReviews = [
          {id: 'def1', customer_name: "Priya Sharma", quantity: 5, notes: "Zoopcart's workflows let us automate repetitive tasks, saving valuable time and resources.", avatar: "https://i.pravatar.cc/150?img=5", role: "Marketer", country: "🇮🇳 India"},
          {id: 'def2', customer_name: "Rahul Gupta", quantity: 5, notes: "Zoopcart is a great tool for any export business looking to manage sales efficiently and grow.", avatar: "https://i.pravatar.cc/150?img=11", role: "CEO", country: "🇮🇳 India"},
          {id: 'def3', customer_name: "Sneha Reddy", quantity: 5, notes: "With Zoopcart, I receive everything directly on my dashboard. It's very user-friendly.", avatar: "https://i.pravatar.cc/150?img=43", role: "Proprietor", country: "🇮🇳 India"}
        ];
        
        if (data && data.length > 0) {
          setReviews([...data, ...defaultReviews]);
        } else {
          setReviews(defaultReviews);
        }
      }
      setLoading(false);
    }
    loadReviews();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!platformBusinessId || !name || !comment) return;
    
    setSubmitting(true);
    
    const newReview = {
      business_id: platformBusinessId,
      status: 'platform_review',
      customer_name: name,
      customer_phone: "0000000000",
      notes: comment,
      quantity: rating,
      tracking_token: Math.random().toString(36).substring(2, 10).toUpperCase()
    };

    const { data, error } = await supabase.from('orders').insert([newReview]).select();
    
    if (!error && data) {
      setReviews([data[0], ...reviews]);
      setShowForm(false);
      setName("");
      setComment("");
      setRating(5);
    } else {
      alert("Error submitting review. Please try again.");
    }
    setSubmitting(false);
  };

  // Limit home screen display to 4 reviews unless expanded
  const displayableReviews = isExpanded ? reviews : reviews.slice(0, 4);

  return (
    <div className="w-full max-w-4xl mx-auto py-12 px-4">
      <div className="flex flex-col md:flex-row items-center justify-between text-center md:text-left mb-10 gap-4">
        <div className="text-center w-full mb-6">
          <span className="text-[#111111] font-bold text-sm tracking-wide bg-slate-100 px-4 py-1 rounded-full mb-4 inline-block">Customers</span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#111111] w-full text-center mb-4">What Customers Are Saying</h2>
          <p className="text-slate-500 text-lg md:text-xl font-medium max-w-xl mx-auto">Small businesses across the world run on Zoopcart.</p>
        </div>
        <div className="w-full flex justify-center mt-2">
          <Button onClick={() => setShowForm(!showForm)} variant="secondary" className="font-extrabold border-slate-300 text-slate-900 bg-white hover:bg-slate-50 rounded-full px-10 py-6 text-base shadow-sm">
            Write a Review
          </Button>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-8 animate-in slide-in-from-top-4">
          <h3 className="font-bold text-[#0F172A] mb-4">How is Zoopcart helping your business?</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-bold text-slate-700 mb-1 block">Your Name / Brand Name</label>
              <input 
                required 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-[#111111]/20"
                placeholder="E.g. Sneha's Bakery"
              />
            </div>
            <div>
              <label className="text-sm font-bold text-slate-700 mb-1 block">Rating</label>
              <div className="flex items-center gap-2">
                {[1,2,3,4,5].map(star => (
                  <button type="button" key={star} onClick={() => setRating(star)} className="focus:outline-none">
                    <Star className={`w-6 h-6 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-slate-300"}`} />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-bold text-slate-700 mb-1 block">Your Review</label>
              <textarea 
                required 
                value={comment} 
                onChange={(e) => setComment(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#111111]/20 h-24 resize-none"
                placeholder="Tell us how Zoopcart has changed the way you take orders..."
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
              <Button type="submit" className="bg-[#111111] hover:bg-black text-white font-bold rounded-full" disabled={submitting}>
                {submitting ? "Posting..." : "Post Review"}
              </Button>
            </div>
          </div>
        </form>
      )}

      {loading ? (
        <div className="text-center py-12 text-slate-400 font-bold">Loading reviews...</div>
      ) : displayableReviews.length > 0 ? (
        <>
          <div className="grid md:grid-cols-3 gap-6">
            {displayableReviews.map((review) => (
              <div key={review.id} className="bg-white p-8 rounded-[32px] border border-slate-100 flex flex-col h-full shadow-sm hover:shadow-md transition-shadow">
                <p className="text-[#111111] leading-relaxed font-bold text-lg mb-8 flex-1">"{review.notes}"</p>
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
          <div className="flex justify-center mt-10">
            <Link
              href="/reviews"
              className="text-[#111111] font-bold hover:underline flex items-center gap-1.5 bg-slate-50 px-6 py-3 rounded-full border border-slate-200 text-sm transition-all active:scale-95 shadow-sm hover:bg-slate-100"
            >
              More reviews
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
          </div>
        </>
      ) : (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-100">
          <MessageCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-bold text-slate-900">No reviews yet</h3>
          <p className="text-slate-500 text-sm mt-1">Be the first to share your experience with Zoopcart!</p>
        </div>
      )}
    </div>
  );
}


