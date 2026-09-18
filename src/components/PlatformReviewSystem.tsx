"use client";

import { useState, useEffect } from "react";
import { Star, MessageCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";

export default function PlatformReviewSystem() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
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
          .limit(10);
        
                const defaultReviews = [
          {id: 'def1', customer_name: "Priya Sharma", quantity: 5, notes: "Zypcart completely changed how I take orders. No more messy DMs, just a clean catalog link on my Instagram bio!"},
          {id: 'def2', customer_name: "Rahul Gupta", quantity: 5, notes: "The checkout process is so smooth. My conversion rate doubled because customers can order in 3 clicks without downloading any app."},
          {id: 'def3', customer_name: "Sneha Reddy", quantity: 5, notes: "I share my products on WhatsApp groups. Now I just share my Zypcart link and all requests come perfectly organized to my dashboard."}
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
      quantity: rating 
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

  return (
    <div className="w-full max-w-4xl mx-auto py-12">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-extrabold text-[#0F172A]">Real Sellers, Real Stories</h2>
        <Button onClick={() => setShowForm(!showForm)} variant="secondary" className="font-bold border-blue-200 text-blue-600 hover:bg-blue-50">
          Write a Review
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-8 animate-in slide-in-from-top-4">
          <h3 className="font-bold text-[#0F172A] mb-4">How is Zypcart helping your business?</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-bold text-slate-700 mb-1 block">Your Name / Brand Name</label>
              <input 
                required 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
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
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 h-24 resize-none"
                placeholder="Tell us how Zypcart has changed the way you take orders..."
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold" disabled={submitting}>
                {submitting ? "Posting..." : "Post Review"}
              </Button>
            </div>
          </div>
        </form>
      )}

      {loading ? (
        <div className="text-center py-12 text-slate-400 font-bold">Loading reviews...</div>
      ) : reviews.length > 0 ? (
        <div className="grid md:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col h-full">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(review.quantity || 5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-slate-700 leading-relaxed font-medium mb-6 flex-1">"{review.notes}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-blue-700 font-extrabold">
                  {review.customer_name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-extrabold text-[#0F172A] text-sm">{review.customer_name}</h4>
                  <p className="text-xs text-slate-500 font-medium">Verified Seller</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-100">
          <MessageCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-bold text-slate-900">No reviews yet</h3>
          <p className="text-slate-500 text-sm mt-1">Be the first to share your experience with Zypcart!</p>
        </div>
      )}
    </div>
  );
}


