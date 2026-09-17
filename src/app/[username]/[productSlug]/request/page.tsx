"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";

export default function RequestFormPage({ params }: { params: { username: string, productSlug: string } }) {
  const { username, productSlug } = params;
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [trackingToken, setTrackingToken] = useState("");
  
  const [productData, setProductData] = useState<any>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    quantity: 1,
    requiredDate: "",
    address: "",
    city: "",
    pincode: "",
    notes: ""
  });

  useEffect(() => {
    async function loadData() {
      // 1. Get Business
      const { data: business } = await supabase.from('businesses').select('id').eq('username', username).single();
      if (!business) return;
      
      // 2. Get Product
      const { data: product } = await supabase.from('products').select('id, name, price').eq('business_id', business.id).eq('slug', productSlug).single();
      if (product) {
        setProductData({ ...product, business_id: business.id });
      }
    }
    loadData();
  }, [username, productSlug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productData) {
      setError("Product not found");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      
      const { error: insertError } = await supabase.from('orders').insert([{
        business_id: productData.business_id,
        product_id: productData.id,
        tracking_token: token,
        customer_name: formData.name,
        customer_email: formData.email,
        customer_phone: formData.phone,
        quantity: formData.quantity,
        required_date: formData.requiredDate || null,
        delivery_location: formData.address,
        city: formData.city,
        pincode: formData.pincode,
        notes: formData.notes,
        status: 'new'
      }]);

      if (insertError) throw insertError;
      
      setTrackingToken(token);
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || "Failed to submit request");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-zyp-lightSurface flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white text-center py-8">
          <CardContent className="space-y-4 flex flex-col items-center">
            <div className="w-16 h-16 bg-zyp-success/10 text-zyp-success rounded-full flex items-center justify-center mb-4">
              <Check className="w-8 h-8" />
            </div>
            <h2 className="font-display text-2xl font-bold text-zyp-bg">Request Submitted</h2>
            <p className="text-black/60">
              Your request has been sent. The seller will review your request and update the status.
            </p>
            <div className="bg-black/5 rounded-lg px-4 py-2 mt-4 text-sm font-mono text-black/70">
              Tracking Token: {trackingToken}
            </div>
            <Link href={`/order/${trackingToken}`} className="w-full mt-6 block">
              <Button className="w-full">View Request Status</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zyp-lightSurface text-zyp-bg py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <Link href={`/${username}/${productSlug}`} className="text-black/60 hover:text-black">
            ← Cancel Request
          </Link>
          <img src="/logo.jpg" alt="Zypcart" className="h-8" />
        </div>

        <h1 className="font-display text-3xl font-bold mb-8">Request Order {productData ? `- ${productData.name}` : ''}</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <div className="p-4 bg-zyp-danger/10 text-zyp-danger rounded-[16px]">{error}</div>}
          
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Contact Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Full Name</label>
                <Input required value={formData.name} onChange={e=>setFormData({...formData, name: e.target.value})} className="border-black/10 bg-white text-black" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email (Optional)</label>
                  <Input type="email" value={formData.email} onChange={e=>setFormData({...formData, email: e.target.value})} className="border-black/10 bg-white text-black" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Phone</label>
                  <div className="flex gap-2">
                    <select className="flex h-12 w-24 rounded-[16px] border border-black/10 bg-white px-4 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-zyp-accent">
                      <option value="+91">+91</option>
                    </select>
                    <Input required value={formData.phone} onChange={e=>setFormData({...formData, phone: e.target.value})} className="flex-1 border-black/10 bg-white text-black" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Request Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Quantity</label>
                  <Input type="number" min="1" required value={formData.quantity} onChange={e=>setFormData({...formData, quantity: parseInt(e.target.value)})} className="border-black/10 bg-white text-black" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Required Date (Optional)</label>
                  <Input type="date" value={formData.requiredDate} onChange={e=>setFormData({...formData, requiredDate: e.target.value})} className="border-black/10 bg-white text-black" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Delivery Address</label>
                <textarea required value={formData.address} onChange={e=>setFormData({...formData, address: e.target.value})} className="flex w-full rounded-[16px] border border-black/10 bg-white px-4 py-3 text-sm text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zyp-accent min-h-[80px]" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">City</label>
                  <Input required value={formData.city} onChange={e=>setFormData({...formData, city: e.target.value})} className="border-black/10 bg-white text-black" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Pincode</label>
                  <Input required value={formData.pincode} onChange={e=>setFormData({...formData, pincode: e.target.value})} className="border-black/10 bg-white text-black" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Additional Notes</label>
                <textarea value={formData.notes} onChange={e=>setFormData({...formData, notes: e.target.value})} className="flex w-full rounded-[16px] border border-black/10 bg-white px-4 py-3 text-sm text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zyp-accent min-h-[80px]" placeholder="Any customizations or instructions..." />
              </div>
            </CardContent>
          </Card>

          <Button type="submit" size="lg" className="w-full" disabled={loading || !productData}>
            {loading ? "Submitting..." : "Submit Request"}
          </Button>
        </form>
      </div>
    </div>
  );
}

function Check(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}
