"use client";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Search, Edit2, Trash2, Eye, ExternalLink, Package, ShoppingBag, Tag, DollarSign, Store } from "lucide-react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function AdminProductsPage() {
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    status: ""
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    async function loadProducts() {
      const { data } = await supabase.from('products').select('*, businesses(business_name, username)').order('created_at', { ascending: false });
      if (data) {
        setAllProducts(data);
        setProducts(data);
      }
      setLoading(false);
    }
    loadProducts();
  }, []);

  useEffect(() => {
    let filtered = allProducts;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        (p.name && p.name.toLowerCase().includes(q)) ||
        (p.businesses?.business_name && p.businesses.business_name.toLowerCase().includes(q)) ||
        (p.category && p.category.toLowerCase().includes(q))
      );
    }
    setProducts(filtered);
  }, [searchQuery, allProducts]);

  const openEdit = (product: any) => {
    setSelectedProduct(product);
    setEditForm({
      name: product.name || "",
      price: product.price?.toString() || "",
      description: product.description || "",
      category: product.category || "",
      status: product.status || "active"
    });
    setIsEditing(true);
  };

  const handleUpdateProduct = async () => {
    setLoading(true);
    const { error } = await supabase
      .from('products')
      .update({
        ...editForm,
        price: parseFloat(editForm.price)
      })
      .eq('id', selectedProduct.id);

    if (!error) {
      setAllProducts(allProducts.map(p => p.id === selectedProduct.id ? { ...p, ...editForm, price: parseFloat(editForm.price) } : p));
      setIsEditing(false);
      setSelectedProduct(null);
    }
    setLoading(false);
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product permanently?")) return;
    setLoading(true);
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (!error) {
      setAllProducts(allProducts.filter(p => p.id !== id));
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-[#0F172A]">All Products</h2>
          <p className="text-sm text-slate-500 mt-1">Global catalog management across all sellers.</p>
        </div>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            placeholder="Search by product name or store..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 h-12 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-[#111111]"
          />
        </div>
      </div>

      <Card className="bg-white border-slate-200 shadow-sm rounded-2xl border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
              <tr>
                <th className="p-4 pl-6">Product Info</th>
                <th className="p-4">Seller Store</th>
                <th className="p-4">Category</th>
                <th className="p-4 text-right">Price</th>
                <th className="p-4 text-right pr-6">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan={5} className="p-8 text-center text-slate-500">Loading products...</td></tr>
              ) : products.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-slate-500">No products found.</td></tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center font-bold text-slate-400 shrink-0">
                          {product.image_url ? <img src={product.image_url} className="w-full h-full object-cover" /> : <Package className="w-5 h-5" />}
                        </div>
                        <div>
                          <div className="font-extrabold text-[#0F172A] text-sm">{product.name}</div>
                          <div className="text-[10px] text-slate-400 font-bold uppercase">{product.status || 'Active'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-[#111111]">{product.businesses?.business_name}</div>
                      <div className="text-[10px] text-slate-400 font-medium">@{product.businesses?.username}</div>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-md text-[10px] font-bold uppercase">{product.category || 'N/A'}</span>
                    </td>
                    <td className="p-4 text-right font-extrabold text-[#0F172A]">
                      ₹{product.price}
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openEdit(product)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDeleteProduct(product.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Product Edit Modal */}
      {isEditing && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg border border-slate-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-extrabold text-xl">Edit Product</h3>
              <button onClick={() => setIsEditing(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">Product Name</label>
                <input
                  value={editForm.name}
                  onChange={e => setEditForm({...editForm, name: e.target.value})}
                  className="w-full mt-1 h-12 px-4 border rounded-xl font-bold bg-slate-50"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">Price (₹)</label>
                  <input
                    type="number"
                    value={editForm.price}
                    onChange={e => setEditForm({...editForm, price: e.target.value})}
                    className="w-full mt-1 h-12 px-4 border rounded-xl font-bold bg-slate-50"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">Category</label>
                  <input
                    value={editForm.category}
                    onChange={e => setEditForm({...editForm, category: e.target.value})}
                    className="w-full mt-1 h-12 px-4 border rounded-xl font-bold bg-slate-50"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">Description</label>
                <textarea
                  value={editForm.description}
                  onChange={e => setEditForm({...editForm, description: e.target.value})}
                  rows={3}
                  className="w-full mt-1 p-4 border rounded-xl font-medium bg-slate-50 text-sm"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button onClick={() => setIsEditing(false)} className="flex-1 py-3 border rounded-xl font-bold">Cancel</button>
                <button onClick={handleUpdateProduct} className="flex-1 py-3 bg-slate-900 text-white rounded-xl font-bold shadow-lg shadow-black/20">Save Changes</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
