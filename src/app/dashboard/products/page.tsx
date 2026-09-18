"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Plus, Search, Eye, Edit2, Share2, Trash2, ArrowLeft, UploadCloud, Box, Camera, Image as ImageIcon } from "lucide-react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

import { useDashboardData, invalidateDashboardCache } from "@/lib/useDashboardData";

export default function ProductsPage() {
  const { business, products: cachedProducts, loading } = useDashboardData();
  const [products, setProducts] = useState<any[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [businessUsername, setBusinessUsername] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [formData, setFormData] = useState({ 
    name: "", 
    description: "", 
    category: "", 
    price: "", 
    sale_price: "", 
    availability: "in_stock", 
    image: "",
    stock: "50",
    videoLink: "",
    published: true,
    featured: false,
    delivery_type: "free",
    delivery_charge: ""
  });
  const [uploadingImage, setUploadingImage] = useState(false);
  const [generatingAI, setGeneratingAI] = useState(false);

  useEffect(() => {
    if (business) {
      setBusinessId(business.id);
      setBusinessUsername(business.username);
    }
    if (cachedProducts) {
      setProducts(cachedProducts);
    }
  }, [business, cachedProducts]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setUploadingImage(true);
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 400; // Even smaller to guarantee it uploads
        let scaleSize = 1;
        if (img.width > MAX_WIDTH) {
          scaleSize = MAX_WIDTH / img.width;
        }
        canvas.width = img.width * scaleSize;
        canvas.height = img.height * scaleSize;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.5); // 50% quality
        setFormData({...formData, image: compressedBase64});
        setUploadingImage(false);
      };
      if (event.target?.result) {
        img.src = event.target.result as string;
      }
    };
    reader.readAsDataURL(file);
  };

  
  const handleAIGenerate = (e: any) => {
    e.preventDefault();
    if (!formData.name) return alert("Please enter a basic product name first!");
    setGeneratingAI(true);
    setTimeout(() => {
      setFormData(prev => ({
        ...prev,
        name: prev.name.length < 15 ? `Premium ${prev.name}` : prev.name,
        description: `Elevate your experience with our ${prev.name}. Crafted with precision and attention to detail, this product is designed to meet your everyday needs.\n\n✨ Key Features:\n- Premium build quality\n- Excellent durability\n- Perfect for daily use\n\nOrder now and experience the difference!`
      }));
      setGeneratingAI(false);
    }, 1500);
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessId) return;
    setSubmitting(true);

    const slug = formData.name.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Math.floor(Math.random() * 1000);
    
    // We map price -> selling price, sale_price -> MRP
    
    
    const deliveryData = JSON.stringify({ type: formData.delivery_type, charge: formData.delivery_charge, video: formData.videoLink });
    const payloadDesc = formData.description + `\n\n---ZYP_DELIVERY:${deliveryData}---`;


    const payload = {
      business_id: businessId,
      name: formData.name,
      slug: slug,
      price: parseFloat(formData.price),
      sale_price: formData.sale_price ? parseFloat(formData.sale_price) : null,
      short_description: payloadDesc.substring(0, 100),
      description: payloadDesc,
      category: formData.category,
      availability: formData.availability,
      image: formData.image
    };


    if (editingId) {
       invalidateDashboardCache(); const { data, error } = await supabase.from('products').update(payload).eq('id', editingId).select();
       if (error) {
         alert("Error updating product: " + error.message);
       } else if (data) {
         setProducts(products.map(p => p.id === editingId ? data[0] : p));
         setShowAddForm(false);
       }
    } else {
       invalidateDashboardCache(); const { data, error } = await supabase.from('products').insert([payload]).select();
       if (error) {
         alert("Error adding product: " + error.message);
       } else if (data) {
         setProducts([data[0], ...products]);
         setShowAddForm(false);
       }
    }

    setEditingId(null);
    setSubmitting(false);
    setFormData({ name: "", description: "", category: "", price: "", sale_price: "", availability: "in_stock", image: "", stock: "50", videoLink: "", published: true, featured: false, delivery_type: "free", delivery_charge: "" });
  };

  if (loading) return <div className="p-4 text-zyp-textMuted font-medium">Loading products...</div>;
  if (!businessId) return <div className="p-4 text-zyp-danger font-medium">Please create your store profile first.</div>;

  if (showAddForm) {
    return (
      <div className="max-w-2xl mx-auto space-y-6 pb-12">
        <div className="flex items-center justify-between">
          <button onClick={() => setShowAddForm(false)} className="flex items-center text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-1" /> Products
          </button>
          <Button onClick={handleAddProduct} variant="primary" className="rounded-xl px-6 bg-pink-500 hover:bg-pink-600 border-none shadow-md" disabled={submitting}>
            {submitting ? "Saving..." : "Save"}
          </Button>
        </div>
        
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900">{editingId ? "Edit product" : "New product"}</h2>
        </div>

        <form id="productForm" onSubmit={handleAddProduct} className="space-y-6">
          
          {/* PHOTOS SECTION */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-500 tracking-wider uppercase ml-1">Photos</h3>
            <div className="bg-[#1A1A1A] p-6 rounded-3xl border border-slate-800 shadow-xl">
              <div className="flex flex-col items-center">
                <div className="w-40 h-40 rounded-2xl border-2 border-dashed border-slate-600 bg-black/50 overflow-hidden relative flex flex-col items-center justify-center text-center p-2 group hover:border-pink-500/50 transition-colors mb-6">
                  {formData.image ? (
                    <img src={formData.image} alt="Preview" className="w-full h-full object-cover absolute inset-0" />
                  ) : (
                    <>
                      <ImageIcon className="w-8 h-8 text-slate-500 mb-2 group-hover:text-pink-500" />
                      <span className="text-xs font-bold text-slate-500">Cover Image</span>
                    </>
                  )}
                  <Input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
                
                <div className="flex gap-4 w-full justify-center">
                  <div className="relative">
                    <Button type="button" variant="ghost" className="rounded-full bg-white/10 text-white border-none hover:bg-white/20 text-sm h-10 px-6 font-bold">
                      <UploadCloud className="w-4 h-4 mr-2" /> Gallery
                    </Button>
                    <Input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                  </div>
                  <div className="relative">
                    <Button type="button" variant="ghost" className="rounded-full bg-white/10 text-white border-none hover:bg-white/20 text-sm h-10 px-6 font-bold">
                      <Camera className="w-4 h-4 mr-2" /> Camera
                    </Button>
                    <Input type="file" accept="image/*" capture="environment" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-4 font-medium">JPG, PNG or WebP • up to 5 MB</p>
                {uploadingImage && <p className="text-xs text-pink-500 mt-2 font-bold animate-pulse">Optimizing image...</p>}
              </div>
            </div>
            <p className="text-xs text-slate-500 ml-2 font-medium">Up to 10 • the cover is what customers see first.</p>
          </div>

          {/* DETAILS SECTION */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-500 tracking-wider uppercase ml-1">Details</h3>
            <div className="bg-[#1A1A1A] p-6 rounded-3xl border border-slate-800 shadow-xl space-y-5">
              <div>
                
              <div className="flex justify-between items-end mb-1.5">
                <label className="text-sm font-bold text-white">Name <span className="text-pink-500">*</span></label>
                <button onClick={handleAIGenerate} disabled={generatingAI} className="text-xs font-extrabold text-pink-400 bg-pink-500/10 px-2.5 py-1 rounded-lg flex items-center gap-1 hover:bg-pink-500/20 transition-colors">
                  {generatingAI ? "✨ Generating..." : "✨ Optimize with AI"}
                </button>
              </div>

                <Input required value={formData.name} onChange={(e: any) => setFormData({...formData, name: e.target.value})} placeholder="e.g. Shop Faisal" className="bg-black/50 border-slate-700 text-white placeholder:text-slate-600 h-12 rounded-xl" />
              </div>
              <div>
                <label className="text-sm font-bold text-white mb-1.5 block">Category <span className="text-pink-500">*</span></label>
                <select required value={formData.category} onChange={(e: any) => setFormData({...formData, category: e.target.value})} className="w-full bg-slate-50 border border-slate-200 text-slate-900 h-14 rounded-xl px-4 outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 appearance-none font-medium">
                  <option value="" disabled>Select category</option>
                  <option value="Home Bakers">Home Bakers</option>
                  <option value="Clothing Sellers">Clothing Sellers</option>
                  <option value="Jewellery Businesses">Jewellery Businesses</option>
                  <option value="Gift Businesses">Gift Businesses</option>
                  <option value="Interior Designers">Interior Designers</option>
                  <option value="Custom Furniture">Custom Furniture</option>
                  <option value="Artists">Artists</option>
                  <option value="Photographers">Photographers</option>
                  <option value="Wedding Vendors">Wedding Vendors</option>
                  <option value="Others">Others</option>
                </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-bold text-white mb-1.5 block">Delivery <span className="text-pink-500">*</span></label>
                    <select required value={formData.delivery_type} onChange={(e: any) => setFormData({...formData, delivery_type: e.target.value})} className="w-full bg-black/50 border border-slate-700 text-white h-12 rounded-xl px-4 outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500/50 appearance-none">
                      <option value="free">Free Delivery</option>
                      <option value="paid">Paid (Charge)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-bold text-white mb-1.5 block">Delivery Charge (₹)</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">₹</span>
                      <input type="number" disabled={formData.delivery_type === 'free'} value={formData.delivery_charge} onChange={(e: any) => setFormData({...formData, delivery_charge: e.target.value})} placeholder={formData.delivery_type === 'free' ? "0" : "e.g. 50"} className="w-full bg-black/50 border border-slate-700 text-white h-12 rounded-xl pl-8 pr-4 outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500/50 font-medium disabled:opacity-50 disabled:bg-slate-900" />
                    </div>
                  </div>
                </div>

              <div>
                <label className="text-sm font-bold text-white mb-1.5 flex items-center justify-between">
                  <span>Description</span>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-slate-800 px-2 py-0.5 rounded-full">Recommended</span>
                </label>
                <textarea 
                  value={formData.description} 
                  onChange={(e: any) => setFormData({...formData, description: e.target.value})} 
                  placeholder="Describe your product in detail. Include materials, dimensions, care instructions, or any special features..." 
                  className="w-full bg-black/50 border border-slate-700 text-white placeholder:text-slate-600 p-4 min-h-[160px] rounded-xl resize-y outline-none focus:border-pink-500 transition-colors" 
                />
                <p className="text-xs text-slate-500 mt-2">A good description helps customers decide and builds trust.</p>
                </div>

                <div>
                  <label className="text-sm font-bold text-white mb-1.5 flex items-center justify-between">
                    <span>YouTube/Instagram Video Link</span>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-slate-800 px-2 py-0.5 rounded-full">Optional</span>
                  </label>
                  <Input value={formData.videoLink} onChange={(e: any) => setFormData({...formData, videoLink: e.target.value})} placeholder="https://youtube.com/..." className="bg-black/50 border-slate-700 text-white placeholder:text-slate-600 h-12 rounded-xl" />
                </div>

            </div>
          </div>

          {/* PRICING & STOCK SECTION */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-500 tracking-wider uppercase ml-1">Pricing & Stock</h3>
            <div className="bg-[#1A1A1A] p-6 rounded-3xl border border-slate-800 shadow-xl space-y-5">
              <div>
                <label className="text-sm font-bold text-white mb-1.5 block">Price <span className="text-pink-500">*</span></label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">₹</span>
                  <Input required type="number" value={formData.price} onChange={(e: any) => setFormData({...formData, price: e.target.value})} placeholder="20" className="bg-black/50 border-slate-700 text-white placeholder:text-slate-600 h-12 rounded-xl pl-8" />
                </div>
              </div>
              <div>
                <label className="text-sm font-bold text-white mb-1.5 block">MRP <span className="text-pink-500">*</span></label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">₹</span>
                  <Input type="number" value={formData.sale_price} onChange={(e: any) => setFormData({...formData, sale_price: e.target.value})} placeholder="20" className="bg-black/50 border-slate-700 text-white placeholder:text-slate-600 h-12 rounded-xl pl-8" />
                </div>
              </div>
              <div>
                <label className="text-sm font-bold text-white mb-1.5 block">Stock <span className="text-pink-500">*</span></label>
                <Input type="number" value={formData.stock} onChange={(e: any) => setFormData({...formData, stock: e.target.value})} placeholder="50" className="bg-black/50 border-slate-700 text-white placeholder:text-slate-600 h-12 rounded-xl" />
              </div>
            </div>
          </div>

          {/* VISIBILITY SECTION */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-500 tracking-wider uppercase ml-1">Visibility</h3>
            <div className="bg-[#1A1A1A] p-6 rounded-3xl border border-slate-800 shadow-xl space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-white font-bold">Published</h4>
                  <p className="text-xs text-slate-400">Show this product on your storefront.</p>
                </div>
                <button type="button" onClick={() => setFormData({...formData, published: !formData.published})} className={`w-12 h-6 rounded-full transition-colors relative ${formData.published ? 'bg-pink-500' : 'bg-slate-700'}`}>
                  <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${formData.published ? 'translate-x-6' : 'translate-x-0.5'}`}></div>
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-white font-bold">Featured</h4>
                  <p className="text-xs text-slate-400">Highlight it on the store's front page.</p>
                </div>
                <button type="button" onClick={() => setFormData({...formData, featured: !formData.featured})} className={`w-12 h-6 rounded-full transition-colors relative ${formData.featured ? 'bg-pink-500' : 'bg-slate-700'}`}>
                  <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${formData.featured ? 'translate-x-6' : 'translate-x-0.5'}`}></div>
                </button>
              </div>
            </div>
            <p className="text-xs text-slate-500 ml-2 mt-2 font-medium">Unpublished products are hidden from your store. Featured ones lead the storefront.</p>
          </div>

        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900">Your Products</h2>
          <p className="text-sm text-slate-500 mt-1">Manage your products and share them with your customers.</p>
        </div>
        <Button variant="primary" className="font-bold rounded-xl shadow-md bg-pink-500 hover:bg-pink-600 border-none" onClick={() => setShowAddForm(true)}>
          <Plus className="w-4 h-4 mr-2" /> Add Product
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input placeholder="Search products..." className="pl-9 bg-white border-slate-200" />
        </div>
      </div>

      {products.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-sm">
          <div className="w-16 h-16 bg-pink-50 text-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Box className="w-8 h-8" />
          </div>
          <h3 className="font-extrabold text-lg text-slate-900">No products yet</h3>
          <p className="text-sm text-slate-500 mt-1 mb-6 max-w-sm mx-auto">Add your first product to start taking orders from customers.</p>
          <Button variant="primary" className="font-bold rounded-xl bg-pink-500 hover:bg-pink-600 border-none" onClick={() => setShowAddForm(true)}>
            <Plus className="w-4 h-4 mr-2" /> Add Product
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {products.map(p => (
            <div key={p.id} className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center gap-4 hover:shadow-md transition-shadow">
              <div className="w-full sm:w-24 h-40 sm:h-24 rounded-xl bg-slate-100 overflow-hidden shrink-0">
                {p.image ? (
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300"><Box className="w-8 h-8" /></div>
                )}
              </div>
              <div className="flex-1 min-w-0 w-full">
                <h4 className="font-extrabold text-slate-900 text-lg truncate">{p.name}</h4>
                <p className="text-sm text-slate-500 truncate mt-0.5 mb-2">{p.short_description}</p>
                <div className="flex items-center gap-3">
                  <span className="font-extrabold text-slate-900">₹{p.price}</span>
                  {p.sale_price && <span className="text-xs font-bold text-slate-400 line-through">₹{p.sale_price}</span>}
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-700 ml-2">In Stock</span>
                </div>
              </div>
              <div className="flex sm:flex-col gap-2 w-full sm:w-auto mt-4 sm:mt-0 border-t sm:border-t-0 sm:border-l border-slate-100 pt-4 sm:pt-0 sm:pl-4">
                <button 
                  onClick={() => window.open(`/${businessUsername}/${p.slug}`, '_blank')}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 text-xs font-bold text-slate-500 hover:text-pink-500 py-1 px-2 rounded-lg hover:bg-pink-50 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" /> View
                </button>
                <button 
                  onClick={() => {
                    
                    
                    let desc = p.description || "";
                    let delType = "free";
                    let delCharge = "";
                    let vLink = "";
                    if (desc.includes('---ZYP_DELIVERY:')) {
                      const parts = desc.split('---ZYP_DELIVERY:');
                      desc = parts[0].trim();
                      try {
                        const meta = JSON.parse(parts[1].split('---')[0]);
                        delType = meta.type || "free";
                        delCharge = meta.charge || "";
                        vLink = meta.video || "";
                      } catch(e) {}
                    }
                    
                    setFormData({
                      name: p.name,
                      description: desc,
                      category: p.category || "",
                      price: p.price.toString(),
                      sale_price: p.sale_price ? p.sale_price.toString() : "",
                      availability: p.availability || "in_stock",
                      image: p.image || "",
                      stock: "50",
                      videoLink: vLink,
                      published: true,
                      featured: false,
                      delivery_type: delType,
                      delivery_charge: delCharge
                    });


                    setEditingId(p.id);
                    setShowAddForm(true);
                  }}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 text-xs font-bold text-slate-500 hover:text-pink-500 py-1 px-2 rounded-lg hover:bg-pink-50 transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" /> Edit
                </button>
                <button 
                  onClick={() => {
                     const url = `${window.location.origin}/${businessUsername}/${p.slug}`;
                     navigator.clipboard.writeText(url);
                     alert("Product link copied to clipboard!");
                  }}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 text-xs font-bold text-slate-500 hover:text-pink-500 py-1 px-2 rounded-lg hover:bg-pink-50 transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5" /> Share
                </button>
                <button 
                  onClick={async () => {
                    if (confirm("Are you sure you want to delete this product?")) {
                       invalidateDashboardCache(); await supabase.from('products').delete().eq('id', p.id);
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
        </div>
      )}
    </div>
  );
}




