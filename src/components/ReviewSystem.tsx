"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ReviewSystem({ businessId, productId }: { businessId: string, productId?: string }) {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function fetchReviews() {
      let query = supabase.from('orders').select('*').eq('business_id', businessId).eq('status', 'review');
      if (productId) {
        query = query.eq('product_id', productId);
      }
      const { data } = await query.order('created_at', { ascending: false });
      if (data) {
        setReviews(data);
      }
      setLoading(false);
    }
    fetchReviews();
  }, [businessId, productId]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!name || !comment) return;
    setSubmitting(true);
    
    const newReview = {
      business_id: businessId,
      product_id: productId || null,
      status: 'review',
      customer_name: name,
      customer_phone: "0000000000",
      notes: comment, // using notes to store review text
      quantity: rating // using quantity to store rating
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

  if (loading) return <div className="py-8 text-center text-slate-400 font-bold text-sm">Loading reviews...</div>;

  const averageRating = reviews.length > 0 ? (reviews.reduce((acc, r) => acc + (r.quantity || 5), 0) / reviews.length).toFixed(1) : "5.0";

  return (
    <div className="mt-8 border-t border-slate-100 pt-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">Customer Reviews</h2>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex text-yellow-400">
              <Star className="w-4 h-4 fill-current" />
            </div>
            <span className="text-sm font-bold text-slate-600">{averageRating} ({reviews.length} reviews)</span>
          </div>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="bg-pink-50 text-pink-600 hover:bg-pink-100 font-bold rounded-xl h-10 px-4 border-none shadow-none">
          {showForm ? "Cancel" : "Write Review"}
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-slate-50 p-5 rounded-[24px] border border-slate-100 mb-8 space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button type="button" key={star} onClick={() => setRating(star)}>
                  <Star className={`w-8 h-8 ${rating >= star ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'}`} />
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Your Name</label>
            <input required value={name} onChange={e => setName(e.target.value)} className="w-full h-12 px-4 rounded-xl border border-slate-200 outline-none focus:border-pink-500 font-medium" placeholder="John Doe" />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Review</label>
            <textarea required value={comment} onChange={e => setComment(e.target.value)} className="w-full p-4 rounded-xl border border-slate-200 outline-none focus:border-pink-500 font-medium min-h-[100px] resize-y" placeholder="Tell others what you think..." />
          </div>
          <Button type="submit" disabled={submitting} className="w-full h-12 bg-pink-600 hover:bg-pink-700 text-white font-extrabold rounded-xl shadow-md border-none">
            {submitting ? "Submitting..." : "Submit Review"}
          </Button>
        </form>
      )}

      {reviews.length === 0 && !showForm && (
        <div className="text-center py-8 bg-slate-50 rounded-[24px] border border-slate-100">
          <p className="text-slate-500 font-medium text-sm">No reviews yet. Be the first to review!</p>
        </div>
      )}

      <div className="space-y-4">
        {reviews.map((r, idx) => (
          <div key={idx} className="p-5 rounded-[24px] border border-slate-100 shadow-sm bg-white">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center text-pink-600 font-bold uppercase shrink-0">
                {r.customer_name?.charAt(0) || 'U'}
              </div>
              <div>
                <div className="font-extrabold text-slate-900 text-sm leading-tight mb-1">{r.customer_name}</div>
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-3 h-3 ${i < (r.quantity || 5) ? 'fill-current' : 'text-slate-200'}`} />
                  ))}
                </div>
              </div>
            </div>
            <p className="text-sm font-medium text-slate-600 leading-relaxed">{r.address}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

