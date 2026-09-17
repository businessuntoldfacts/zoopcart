"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, PackageSearch, X } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [businessId, setBusinessId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    short_description: "",
    image: "",
  });

  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: business } = await supabase.from('businesses').select('id').eq('user_id', user.id).single();
    if (business) {
      setBusinessId(business.id);
      const { data } = await supabase.from('products').select('*').eq('business_id', business.id);
      if (data) setProducts(data);
    }
    setLoading(false);
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setUploadingImage(true);
    
    const fileExt = file.name.split('.').pop();
    const fileName = `product-${Math.random()}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage.from('images').upload(fileName, file);
    if (!uploadError) {
      const { data } = supabase.storage.from('images').getPublicUrl(fileName);
      setFormData({...formData, image: data.publicUrl});
    } else {
      alert("Image upload failed. Ensure you created the public 'images' bucket.");
    }
    setUploadingImage(false);
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessId) return;

    // generate slug
    const slug = formData.name.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Math.floor(Math.random() * 1000);

    const { data, error } = await supabase.from('products').insert([{
      business_id: businessId,
      name: formData.name,
      slug: slug,
      price: parseFloat(formData.price),
      short_description: formData.short_description,
      image: formData.image
    }]).select();

    if (!error && data) {
      setProducts([...products, data[0]]);
      setShowAddForm(false);
      setFormData({ name: "", price: "", short_description: "", image: "" });
    } else {
      alert("Error adding product");
    }
  };

  if (loading) return <div className="p-4 text-white">Loading products...</div>;
  if (!businessId) return <div className="p-4 text-white">Please create your store profile first by signing up properly.</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Your Products</h2>
        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      {showAddForm && (
        <Card className="bg-zyp-surface border-white/10 mb-8 relative">
          <button onClick={() => setShowAddForm(false)} className="absolute top-4 right-4 text-white/50 hover:text-white">
            <X className="w-5 h-5" />
          </button>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium text-white mb-4">Add New Product</h3>
            <form onSubmit={handleAddProduct} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Product Image</label>
                <div className="flex items-center gap-4">
                  {formData.image && <img src={formData.image} alt="Preview" className="w-16 h-16 rounded-md object-cover border border-white/10" />}
                  <Input type="file" accept="image/*" onChange={handleImageUpload} className="border-white/10" />
                </div>
                {uploadingImage && <p className="text-xs text-zyp-accent">Uploading image...</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Product Name</label>
                <Input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="E.g. Custom Birthday Cake" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Price (₹)</label>
                <Input required type="number" min="0" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} placeholder="500" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Short Description</label>
                <Input required value={formData.short_description} onChange={e => setFormData({...formData, short_description: e.target.value})} placeholder="Brief details about the product" />
              </div>
              <Button type="submit" variant="primary">Save Product</Button>
            </form>
          </CardContent>
        </Card>
      )}

      {products.length === 0 && !showAddForm ? (
        <Card className="bg-zyp-surface border-white/5">
          <CardContent className="pt-12 pb-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
              <PackageSearch className="w-8 h-8 text-zyp-textMuted" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">No products found</h3>
            <p className="text-zyp-textMuted max-w-sm mb-6 text-sm">
              Add your first product to start receiving orders.
            </p>
            <Button onClick={() => setShowAddForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map(p => (
            <Card key={p.id} className="bg-zyp-surface border-white/5 flex flex-col overflow-hidden">
              {p.image && <img src={p.image} alt={p.name} className="w-full h-48 object-cover border-b border-white/5" />}
              <CardContent className="p-4 flex flex-col h-full mt-2">
                <h4 className="font-semibold text-white text-lg">{p.name}</h4>
                <p className="text-sm text-zyp-textMuted mt-1 mb-4 flex-1">{p.short_description}</p>
                <div className="text-lg font-display font-bold text-zyp-accent">₹{p.price}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
