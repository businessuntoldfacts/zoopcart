"use client";
import { useState, useEffect } from "react";
import { Star, MessageCircle, ArrowRight, CheckCircle, Sparkles } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";

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
          .order('created_at', { ascending: false });
        
        const defaultReviews = [
          {id: 'def1', customer_name: "Priya Sharma", quantity: 5, notes: "Zoopcart's workflows let us automate repetitive tasks, saving valuable time and resources.", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop", role: "Clothing Brand Owner", country: "🇮🇳 India"},
          {id: 'def2', customer_name: "Rahul Gupta", quantity: 5, notes: "Zoopcart is a great tool for any export business looking to manage sales efficiently and grow.", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop", role: "Gems & Jewellery Trader", country: "🇮🇳 India"},
          {id: 'def3', customer_name: "Sneha Reddy", quantity: 5, notes: "With Zoopcart, I receive everything directly on my dashboard. It's very user-friendly.", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop", role: "Home Baker & Creator", country: "🇮🇳 India"}
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

  // On the home screen, show 4-5 reviews max unless expanded
  const visibleReviews = isExpanded ? reviews : reviews.slice(0, 4);

  return (
    <div className="w-full max-w-6xl mx-auto py-24 px-6" id="reviews">
      <div className="bg-gradient-to-br from-indigo-50/40 via-purple-50/20 to-white rounded-[50px] p-8 md:p-16 border border-slate-100 shadow-xl shadow-slate-100/50">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-indigo-600 font-extrabold text-sm tracking-widest bg-indigo-50 px-5 py-2 rounded-full mb-6 inline-block uppercase">
            <Sparkles className="w-4 h-4 inline-block mr-1.5 -mt-0.5 fill-indigo-200" /> Success Stories
          </span>
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-none mb-6">
            What Customers Are Saying
          </h2>
          <p className="text-slate-500 text-lg md:text-xl font-medium leading-relaxed">
            Thousands of dynamic small businesses and independent creators across the world run and expand their sales daily on Zoopcart.
          </p>

          <div className="mt-8 flex justify-center">
            <Button
              onClick={() => setShowForm(!showForm)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-base rounded-full px-8 py-6 shadow-xl shadow-indigo-200/80 transition-all hover:scale-105"
            >
              Write a Verified Review
            </Button>
          </div>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="bg-white p-8 md:p-10 rounded-[32px] shadow-2xl border border-slate-100 mb-12 max-w-2xl mx-auto animate-in fade-in slide-in-from-top-6 duration-300">
            <h3 className="text-2xl font-black text-slate-900 mb-2">Share Your Experience</h3>
            <p className="text-slate-500 text-sm font-medium mb-6">How has Zoopcart transformed the way you manage and receive orders?</p>

            <div className="space-y-6">
              <div>
                <label className="text-sm font-extrabold text-slate-800 mb-2 block">Your Name / Brand Title</label>
                <input
                  required
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-100 focus:border-indigo-500 rounded-2xl px-5 py-3.5 text-sm font-bold outline-none transition-colors placeholder:text-slate-400"
                  placeholder="E.g. Sneha's Organic Bakery"
                />
              </div>

              <div>
                <label className="text-sm font-extrabold text-slate-800 mb-2 block">Select Star Rating</label>
                <div className="flex items-center gap-2 bg-slate-50 px-5 py-3 rounded-2xl w-fit border border-slate-100">
                  {[1,2,3,4,5].map(star => (
                    <button type="button" key={star} onClick={() => setRating(star)} className="focus:outline-none transition-transform active:scale-95">
                      <Star className={`w-7 h-7 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-slate-300"}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-extrabold text-slate-800 mb-2 block">Your Feedback Review</label>
                <textarea
                  required
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-100 focus:border-indigo-500 rounded-2xl px-5 py-4 text-sm font-medium outline-none transition-colors h-32 resize-none placeholder:text-slate-400"
                  placeholder="Write your genuine feedback here..."
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="ghost" className="rounded-full font-bold px-6" onClick={() => setShowForm(false)}>Cancel</Button>
                <Button type="submit" className="bg-slate-900 hover:bg-black text-white font-extrabold rounded-full px-8 shadow-lg" disabled={submitting}>
                  {submitting ? "Publishing..." : "Submit Review"}
                </Button>
              </div>
            </div>
          </form>
        )}

        {loading ? (
          <div className="text-center py-12 text-slate-400 font-extrabold text-lg animate-pulse">Loading verified feedback stream...</div>
        ) : visibleReviews.length > 0 ? (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
              {visibleReviews.map((review) => (
                <div key={review.id} className="bg-white p-8 md:p-10 rounded-[40px] border border-slate-100/80 flex flex-col justify-between h-full shadow-md shadow-slate-100/40 hover:shadow-xl hover:border-indigo-100 transition-all duration-300 relative group overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-indigo-50/30 to-transparent rounded-bl-full pointer-events-none"></div>

                  <div className="mb-6">
                    <div className="flex items-center gap-1 mb-4 text-yellow-400">
                      {Array.from({ length: Number(review.quantity) || 5 }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <p className="text-slate-800 leading-relaxed font-bold text-lg md:text-xl">
                      "{review.notes}"
                    </p>
                  </div>

                  <div className="flex items-center gap-4 pt-4 border-t border-slate-50 mt-auto">
                    {review.avatar ? (
                      <img src={review.avatar} alt={review.customer_name} className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-md ring-2 ring-indigo-50" />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-black text-xl shadow-md">
                        {review.customer_name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-black text-slate-900 text-base">{review.customer_name}</h4>
                        <CheckCircle className="w-4 h-4 text-emerald-500 fill-emerald-50 text-muted" />
                      </div>
                      <p className="text-xs text-slate-500 font-semibold mt-0.5">
                        {review.role || 'Verified Seller'} <span className="mx-1 text-slate-300">·</span> {review.country || '🇮🇳 India'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center mt-12">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="inline-flex items-center gap-2 bg-white border-2 border-slate-200 hover:border-slate-900 rounded-full px-8 py-4 text-slate-900 font-extrabold text-sm transition-all shadow-sm hover:shadow active:scale-95"
              >
                {isExpanded ? "Show Less Reviews" : "More Reviews"}
                <ArrowRight className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-90" : ""}`} />
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border-2 border-dashed border-slate-200 max-w-md mx-auto">
            <MessageCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="font-extrabold text-slate-900 text-lg">No reviews published yet</h3>
            <p className="text-slate-500 text-sm mt-1 px-6">Be the very first to post your active business feedback review story with Zoopcart!</p>
          </div>
        )}
      </div>
    </div>
  );
}


