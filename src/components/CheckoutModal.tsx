"use client";
import { useState } from "react";
import { ArrowRight, ShoppingBag, X, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

export default function CheckoutModal({ 
  business, 
  product 
}: { 
  business: any, 
  product: any 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !address.trim()) return;
    
    setLoading(true);

    const totalAmount = (product.price || 0) * quantity;

    const { data, error } = await supabase
      .from('orders')
      .insert({
        business_id: business.id,
        product_id: product.id,
        customer_name: name,
        customer_phone: phone,
        delivery_location: address,
        quantity: quantity,
        tracking_token: Math.random().toString(36).substring(2, 10).toUpperCase(),
        notes: "Total Amount: ₹" + totalAmount,
        status: 'pending'
      })
      .select('id')
      .single();

    if (error || !data) {
      alert("Failed to place order. Please try again.");
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);

    // Redirect to WhatsApp after 2 seconds
    setTimeout(() => {
      const message = `*New Order Placed!* 🛍️%0A%0A*Order ID:* #${data.id.substring(0,6).toUpperCase()}%0A*Product:* ${encodeURIComponent(product.name)}%0A*Quantity:* ${quantity}%0A*Total Price:* ₹${totalAmount}%0A%0A*Customer Details:*%0AName: ${encodeURIComponent(name)}%0APhone: ${encodeURIComponent(phone)}%0AAddress: ${encodeURIComponent(address)}%0A%0AI have placed this order on your website.`;
      
      let number = business.whatsapp_number || '';
      if (!number) return;
      let waUrl = `https://wa.me/${business.whatsapp_country_code || '91'}${number}?text=${message}`;
      window.location.href = waUrl;
      setIsOpen(false);
      setSuccess(false);
    }, 2000);
  };

  return (
    <>
      <Button 
        onClick={() => setIsOpen(true)}
        className="flex-1 h-14 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-base font-extrabold shadow-md w-full"
      >
        Request Product <ArrowRight className="w-5 h-5 ml-2" />
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-slate-900/40 backdrop-blur-sm p-4 sm:items-center">
          <div 
            className="w-full max-w-md bg-white rounded-[32px] overflow-hidden shadow-2xl animate-in slide-in-from-bottom-8 duration-300"
          >
            {success ? (
              <div className="p-8 flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-10 h-10 text-green-500" />
                </div>
                <h3 className="text-2xl font-extrabold text-slate-900 mb-2">Order Placed!</h3>
                <p className="text-sm font-medium text-slate-500 leading-relaxed mb-6">
                  Your order has been recorded successfully. Redirecting to WhatsApp to notify the seller...
                </p>
                <div className="w-6 h-6 border-4 border-green-200 border-t-green-500 rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="flex flex-col max-h-[90vh]">
                <div className="px-6 py-5 flex items-center justify-between border-b border-slate-100 bg-white sticky top-0 z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
                      <ShoppingBag className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-slate-900">Complete Request</h3>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{business.business_name}</p>
                    </div>
                  </div>
                  <button onClick={() => setIsOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-6 overflow-y-auto">
                  <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl mb-6 border border-slate-100">
                    <div className="w-16 h-16 rounded-xl bg-slate-200 shrink-0 overflow-hidden">
                      {product.image ? (
                        <img src={product.image} className="w-full h-full object-cover" alt={product.name} />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-slate-400">No Img</div>
                      )}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-900 line-clamp-2 mb-1">{product.name}</h4>
                      <div className="font-extrabold text-blue-600">₹{product.price}</div>
                    </div>
                  </div>

                  <form id="checkout-form" onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-extrabold text-slate-700 mb-1.5 ml-1">Quantity</label>
                      <div className="flex items-center gap-4 bg-slate-50 border border-slate-200 rounded-xl p-1 w-max">
                        <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 rounded-lg flex items-center justify-center text-slate-600 hover:bg-white hover:shadow-sm font-bold text-xl transition-all">-</button>
                        <span className="w-8 text-center font-extrabold text-slate-900">{quantity}</span>
                        <button type="button" onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 rounded-lg flex items-center justify-center text-slate-600 hover:bg-white hover:shadow-sm font-bold text-xl transition-all">+</button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-extrabold text-slate-700 mb-1.5 ml-1">Full Name</label>
                      <input 
                        type="text" 
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe" 
                        className="w-full h-12 px-4 rounded-xl border border-slate-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 font-medium transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-extrabold text-slate-700 mb-1.5 ml-1">Phone Number</label>
                      <input 
                        type="tel" 
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="10-digit mobile number" 
                        className="w-full h-12 px-4 rounded-xl border border-slate-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 font-medium transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-extrabold text-slate-700 mb-1.5 ml-1">Complete Delivery Address</label>
                      <textarea 
                        required
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="House/Flat No, Street, City, Pincode" 
                        className="w-full h-24 p-4 rounded-xl border border-slate-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 font-medium resize-none transition-all"
                      />
                    </div>
                  </form>
                </div>

                <div className="p-6 border-t border-slate-100 bg-white sticky bottom-0">
                  <Button 
                    type="submit"
                    form="checkout-form"
                    disabled={loading}
                    className="w-full h-14 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-base shadow-xl shadow-blue-600/20"
                  >
                    {loading ? "Placing Order..." : "Confirm & Send"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}




