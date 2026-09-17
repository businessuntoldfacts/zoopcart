"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Eye, Edit2, Share2, Trash2, ArrowLeft, UploadCloud, CheckCircle2, Box } from "lucide-react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [businessUsername, setBusinessUsername] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [formData, setFormData] = useState({ name: "", short_description: "", description: "", category: "", price: "", sale_price: "", availability: "in_stock", image: "" });
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
  
      const { data: business } = await supabase.from('businesses').select('id, username').eq('user_id', user.id).single();
      if (business) {
        setBusinessId(business.id);
        setBusinessUsername(business.username);
        const { data } = await supabase.from('products').select('*').eq('business_id', business.id).order('created_at', { ascending: false });
        if (data) setProducts(data);
      }
      setLoading(false);
    }
    loadProducts();
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setUploadingImage(true);
    
    // Compress image client-side to ensure small base64 string
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 600;
        const scaleSize = MAX_WIDTH / img.width;
        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scaleSize;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.6); // 60% quality JPEG
        setFormData({...formData, image: compressedBase64});
        setUploadingImage(false);
      };
      if (event.target?.result) {
        img.src = event.target.result as string;
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessId) return;
    setSubmitting(true);

    const slug = formData.name.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Math.floor(Math.random() * 1000);
    
    const payload = {
      business_id: businessId,
      name: formData.name,
      slug: slug,
      price: parseFloat(formData.price),
      sale_price: formData.sale_price ? parseFloat(formData.sale_price) : null,
      short_description: formData.short_description,
      description: formData.description,
      category: formData.category,
      availability: formData.availability,
      image: formData.image
    };

    if (editingId) {
       const { data, error } = await supabase.from('products').update(payload).eq('id', editingId).select();
       if (!error && data) {
         setProducts(products.map(p => p.id === editingId ? data[0] : p));
       }
    } else {
       const { data, error } = await supabase.from('products').insert([payload]).select();
       if (!error && data) {
         setProducts([data[0], ...products]);
       } else {
         alert("Error adding product");
       }
    }

    setShowAddForm(false);
    setEditingId(null);
    setSubmitting(false);
    setFormData({ name: "", short_description: "", description: "", category: "", price: "", sale_price: "", availability: "in_stock", image: "" });
  };

  if (loading) return <div className="p-4 text-zyp-textMuted font-medium">Loading products...</div>;
  if (!businessId) return <div className="p-4 text-zyp-danger font-medium">Please create your store profile first.</div>;

  if (showAddForm) {
    return (
      <div className="max-w-2xl mx-auto space-y-6 pb-12">
        <button onClick={() => setShowAddForm(false)} className="flex items-center text-sm font-bold text-zyp-textMuted hover:text-zyp-textPrimary transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back
        </button>
        
        <div>
          <h2 className="text-2xl font-extrabold text-zyp-textPrimary">{editingId ? "Edit Product" : "Add New Product"}</h2>
          <p className="text-sm text-zyp-textMuted mt-1">Add complete product details to showcase on your store.</p>
        </div>

        <form onSubmit={handleAddProduct} className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-zyp-border space-y-6">
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            <div className="w-full sm:w-32 flex flex-col gap-2">
              <div className="w-full aspect-square rounded-2xl border-2 border-dashed border-zyp-border bg-slate-50 overflow-hidden relative flex flex-col items-center justify-center text-center p-2 group hover:border-zyp-primary/50 transition-colors">
                {formData.image ? (
                  <img src={formData.image} alt="Preview" className="w-full h-full object-cover absolute inset-0" />
                ) : (
                  <>
                    <UploadCloud className="w-6 h-6 text-slate-400 mb-1 group-hover:text-zyp-primary" />
                    <span className="text-[10px] font-bold text-slate-400">Upload Image<br/>JPG, PNG</span>
                  </>
                )}
                <Input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
              </div>
              {uploadingImage && <div className="text-[10px] font-bold text-zyp-primary text-center">Optimizing...</div>}
              {formData.image && <div className="text-[10px] font-bold text-center text-zyp-primary cursor-pointer">Change Image</div>}
            </div>

            <div className="flex-1 space-y-4 w-full">
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-bold text-zyp-textPrimary">Product Details <span className="text-red-500">*</span></label>
                <button 
                  type="button" 
                  onClick={() => setFormData({...formData, name: 'Premium ' + (formData.name || 'Product'), short_description: 'Discover the amazing quality of our premium offering, crafted with care for the best experience.'})}
                  className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md hover:bg-blue-100 flex items-center gap-1"
                >
                  ✨ AI Suggest
                </button>
              </div>
              <div className="space-y-1.5">
                <Input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Product Name (e.g. Chocolate Cake)" className="bg-slate-50" />
              </div>
              <div className="space-y-1.5">
                <Input required value={formData.short_description} onChange={e => setFormData({...formData, short_description: e.target.value})} placeholder="Short Description (Rich and moist chocolate cake...)" className="bg-slate-50" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Input value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} placeholder="Category (e.g. Desserts)" className="bg-slate-50" />
                </div>
                <div className="space-y-1.5">
                  <select value={formData.availability} onChange={e => setFormData({...formData, availability: e.target.value})} className="w-full h-10 px-3 rounded-md border border-slate-200 bg-slate-50 text-sm">
                    <option value="in_stock">In Stock</option>
                    <option value="out_of_stock">Out of Stock</option>
                    <option value="preorder">Pre-order</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-1.5 pt-4 border-t border-slate-100">
            <label className="text-sm font-bold text-zyp-textPrimary">Detailed Description (Optional)</label>
            <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Add more details about ingredients, sizing, etc." className="w-full min-h-[100px] rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/20" />
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-zyp-border">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-zyp-textPrimary">Price (₹) <span className="text-red-500">*</span></label>
              <Input required type="number" min="0" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} placeholder="499" className="bg-slate-50" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-zyp-textPrimary">Sale Price (Optional)</label>
              <Input type="number" min="0" value={formData.sale_price} onChange={e => setFormData({...formData, sale_price: e.target.value})} placeholder="699" className="bg-slate-50" />
            </div>
          </div>

          <div className="pt-6 flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => setShowAddForm(false)} className="font-bold">Cancel</Button>
            <Button type="submit" variant="primary" className="w-full sm:w-auto px-8" disabled={submitting}>
              {submitting ? "Saving..." : (editingId ? "Update Product" : "Publish Product")}
            </Button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-zyp-textPrimary">Your Products</h2>
          <p className="text-sm text-zyp-textMuted mt-1">Manage your products and share them with your customers.</p>
        </div>
        <Button variant="primary" className="font-bold rounded-xl shadow-md" onClick={() => setShowAddForm(true)}>
          <Plus className="w-4 h-4 mr-2" /> Add Product
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input placeholder="Search products..." className="pl-9 bg-white" />
        </div>
        <select className="bg-white border border-zyp-border text-sm font-semibold text-zyp-textPrimary rounded-lg px-4 h-12 outline-none">
          <option>All Categories</option>
        </select>
        <select className="bg-white border border-zyp-border text-sm font-semibold text-zyp-textPrimary rounded-lg px-4 h-12 outline-none">
          <option>All Status</option>
        </select>
      </div>

      {products.length === 0 ? (
        <div className="bg-white rounded-3xl border border-zyp-border p-12 text-center shadow-sm">
          <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Box className="w-8 h-8" />
          </div>
          <h3 className="font-extrabold text-lg text-zyp-textPrimary">No products yet</h3>
          <p className="text-sm text-zyp-textMuted mt-1 mb-6 max-w-sm mx-auto">Add your first product to start taking orders from customers.</p>
          <Button variant="primary" className="font-bold rounded-xl" onClick={() => setShowAddForm(true)}>
            <Plus className="w-4 h-4 mr-2" /> Add Product
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {products.map(p => (
            <div key={p.id} className="bg-white rounded-2xl p-4 border border-zyp-border shadow-sm flex flex-col sm:flex-row items-center gap-4 hover:shadow-md transition-shadow">
              <div className="w-full sm:w-24 h-40 sm:h-24 rounded-xl bg-slate-100 overflow-hidden shrink-0">
                {p.image ? (
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300"><Box className="w-8 h-8" /></div>
                )}
              </div>
              <div className="flex-1 min-w-0 w-full">
                <h4 className="font-extrabold text-zyp-textPrimary text-lg truncate">{p.name}</h4>
                <p className="text-sm text-zyp-textMuted truncate mt-0.5 mb-2">{p.short_description}</p>
                <div className="flex items-center gap-3">
                  <span className="font-extrabold text-zyp-textPrimary">₹{p.price}</span>
                  <span className="text-xs font-bold text-slate-400 line-through">₹{Math.round(p.price * 1.3)}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-700 ml-2">In Stock</span>
                </div>
                  <div className="grid grid-cols-2 gap-2 mt-auto">
                    <Link href={`/${businessUsername}/${p.slug}`} className="block" onClick={(e) => {
                       e.preventDefault();
                       window.open(`/${businessUsername}/${p.slug}`, '_blank');
                    }}>
                      <Button variant="secondary" className="w-full h-9 text-xs font-bold bg-blue-50 text-blue-600 border-none hover:bg-blue-100 rounded-lg">View</Button>
                    </Link>
                  </div>
              </div>
              <div className="flex sm:flex-col gap-2 w-full sm:w-auto mt-4 sm:mt-0 border-t sm:border-t-0 sm:border-l border-slate-100 pt-4 sm:pt-0 sm:pl-4">
                <button 
                  onClick={() => window.open(`/${businessUsername}/${p.slug}`, '_blank')}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 text-xs font-bold text-slate-500 hover:text-zyp-primary py-1 px-2 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" /> View
                </button>
                <button 
                  onClick={() => {
                    setFormData({
                      name: p.name,
                      short_description: p.short_description,
                      description: p.description || "",
                      category: p.category || "",
                      availability: p.availability || "in_stock",
                      price: p.price.toString(),
                      sale_price: p.sale_price ? p.sale_price.toString() : "",
                      image: p.image || ""
                    });
                    setEditingId(p.id);
                    setShowAddForm(true);
                  }}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 text-xs font-bold text-slate-500 hover:text-zyp-primary py-1 px-2 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" /> Edit
                </button>
                <button 
                  onClick={() => {
                     const url = `${window.location.origin}/${businessUsername}/${p.slug}`;
                     navigator.clipboard.writeText(url);
                     alert("Product link copied to clipboard!");
                  }}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 text-xs font-bold text-slate-500 hover:text-zyp-primary py-1 px-2 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5" /> Share
                </button>
                <button 
                  onClick={async () => {
                    if (confirm("Are you sure you want to delete this product?")) {
                       await supabase.from('products').delete().eq('id', p.id);
                       setProducts(products.filter(prod => prod.id !== p.id));
                    }
                  }}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 text-xs font-bold text-slate-500 hover:text-red-600 py-1 px-2 rounded-lg hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            </div>
          ))}
          
          <div className="mt-8 bg-blue-50 border border-blue-100 rounded-3xl p-8 text-center flex flex-col items-center">
            <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-4">
              <Box className="w-6 h-6 text-blue-500" />
            </div>
            <h3 className="font-extrabold text-[#0F172A] text-lg mb-1">Add more amazing products</h3>
            <p className="text-sm font-medium text-slate-500 mb-6">The more products you add, the more requests you'll receive.</p>
            <Button variant="primary" className="font-bold rounded-xl shadow-md" onClick={() => setShowAddForm(true)}>
              <Plus className="w-4 h-4 mr-2" /> Add Product
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
