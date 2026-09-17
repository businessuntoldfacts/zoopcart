import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { MapPin, MessageCircle, Instagram, Share2, Search, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function PublicStorePage({ params }: { params: { username: string } }) {
  const { data: business } = await supabase
    .from('businesses')
    .select('*, products(*)')
    .eq('username', params.username.toLowerCase())
    .single();

  if (!business) {
    notFound();
  }

  const products = business.products || [];

  return (
    <div className="min-h-screen bg-zyp-bg font-sans pb-20">
      {/* Top Header */}
      <header className="bg-white px-4 h-14 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-zyp-primary rounded flex items-center justify-center font-bold text-white text-sm tracking-tighter italic">e</div>
          <span className="font-bold text-lg text-[#0F172A] tracking-tight">Zypcart</span>
        </div>
        <div className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1.5 rounded-full truncate max-w-[150px]">
          zypcart.com/{business.username}
        </div>
      </header>

      {/* Cover Image */}
      <div className="w-full h-40 md:h-64 bg-slate-200 relative">
        <img src="https://images.unsplash.com/photo-1557308536-ee471ef2c390?q=80&w=1000&auto=format&fit=crop" alt="Cover" className="w-full h-full object-cover" />
      </div>

      {/* Store Info Profile */}
      <div className="max-w-4xl mx-auto px-4 md:px-8 relative -mt-12 md:-mt-16 z-10">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-zyp-border">
          <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white shadow-md bg-white overflow-hidden shrink-0">
                {business.profile_image ? (
                  <img src={business.profile_image} alt={business.business_name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-blue-50 flex items-center justify-center text-blue-200 text-3xl font-bold">
                    {business.business_name?.charAt(0)}
                  </div>
                )}
              </div>
              
              <div className="mt-2 md:mt-0">
                <h1 className="text-2xl md:text-3xl font-extrabold text-[#0F172A] flex items-center gap-2">
                  {business.business_name}
                  <CheckCircle2 className="w-5 h-5 text-zyp-success fill-zyp-success/20" />
                </h1>
                <p className="text-sm text-zyp-textMuted mt-1 mb-3 max-w-md">{business.description || "Welcome to our store!"}</p>
                
                <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-500">
                  <span className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-md"><MapPin className="w-3.5 h-3.5" /> Lucknow</span>
                  {business.instagram_handle && (
                     <a href={`https://instagram.com/${business.instagram_handle.replace('@','')}`} target="_blank" className="flex items-center gap-1 text-pink-600 bg-pink-50 px-2 py-1 rounded-md hover:bg-pink-100">
                       <Instagram className="w-3.5 h-3.5" /> {business.instagram_handle}
                     </a>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 w-full md:w-auto mt-2 md:mt-0">
               <a href={`https://wa.me/${business.whatsapp_country_code}${business.whatsapp_number}`} target="_blank" className="flex-1">
                 <Button className="w-full bg-green-500 hover:bg-green-600 text-white rounded-xl shadow-md font-bold h-12">
                   <MessageCircle className="w-4 h-4 mr-2" /> Chat on WhatsApp
                 </Button>
               </a>
               <Button variant="secondary" className="rounded-xl h-12 w-12 p-0 shrink-0">
                 <Share2 className="w-4 h-4" />
               </Button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-8 mt-8 border-b border-zyp-border">
            <button className="pb-3 border-b-2 border-zyp-primary text-sm font-extrabold text-zyp-primary">Products</button>
            <button className="pb-3 border-b-2 border-transparent text-sm font-bold text-slate-400 hover:text-slate-600">About</button>
            <button className="pb-3 border-b-2 border-transparent text-sm font-bold text-slate-400 hover:text-slate-600">Reviews</button>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-4xl mx-auto px-4 md:px-8 mt-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-extrabold text-[#0F172A]">Our Products</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="text" placeholder="Search..." className="pl-9 pr-4 py-2 rounded-full border border-zyp-border bg-white text-sm outline-none w-32 focus:w-48 transition-all" />
          </div>
        </div>

        {products.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-zyp-border shadow-sm">
            <h3 className="font-extrabold text-lg text-slate-800">No products available</h3>
            <p className="text-sm text-slate-500 mt-1">This seller hasn't added any products yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-2xl overflow-hidden border border-zyp-border shadow-sm hover:shadow-md transition-shadow group flex flex-col">
                <div className="aspect-square bg-slate-100 relative overflow-hidden">
                  {product.image ? (
                     <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                     <div className="w-full h-full flex items-center justify-center text-slate-300">No Image</div>
                  )}
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="font-extrabold text-[#0F172A] text-sm md:text-base line-clamp-1">{product.name}</h3>
                  <p className="text-[11px] md:text-xs text-slate-500 mt-1 mb-3 line-clamp-2 leading-relaxed flex-1">{product.short_description}</p>
                  
                  <div className="flex items-center gap-2 mb-4">
                    <span className="font-extrabold text-zyp-primary text-sm md:text-base">₹{product.price}</span>
                    <span className="text-[10px] md:text-xs font-bold text-slate-400 line-through">₹{Math.round(product.price * 1.3)}</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 mt-auto">
                    <Link href={`/${business.username}/${product.slug}`} className="block">
                      <Button variant="secondary" className="w-full h-9 text-xs font-bold bg-blue-50 text-blue-600 border-none hover:bg-blue-100 rounded-lg">View</Button>
                    </Link>
                    <Link href={`/${business.username}/${product.slug}/request`} className="block">
                      <Button variant="primary" className="w-full h-9 text-xs font-bold rounded-lg shadow-sm">Request</Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
