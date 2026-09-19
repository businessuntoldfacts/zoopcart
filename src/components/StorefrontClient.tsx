"use client";
import { useState } from "react";
import Link from "next/link";
import Logo from "@/components/Logo";
import { ArrowLeft, Share2, Heart, Search, Filter, MessageCircle, Star, BadgeCheck } from "lucide-react";
import StoreBottomNav from "@/components/StoreBottomNav";
import { useRouter } from "next/navigation";

export default function StorefrontClient({ business, products }: { business: any, products: any[] }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Products");
  const [selectedCategory, setSelectedCategory] = useState("All");

  
  let theme = 'light';
  if (business?.instagram_profile_url) {
    try {
      if (business.instagram_profile_url.startsWith('{')) {
        theme = JSON.parse(business.instagram_profile_url).theme || 'light';
      } else {
        theme = business.instagram_profile_url;
      }
    } catch(e) {}
  }

  
  const getHeroGradient = () => {
    if (theme === 'dark') return 'bg-gradient-to-br from-slate-900 via-slate-900 to-black';
    if (theme === 'playful') return 'bg-gradient-to-br from-orange-400 via-amber-500 to-yellow-400';
    return 'bg-[#111111]';
  };

  const primaryColor = theme === 'playful' ? 'bg-orange-500 shadow-orange-500/20' : 'bg-[#111111] shadow-black/20';
  const primaryText = theme === 'playful' ? 'text-orange-500' : 'text-[#111111]';
  const activeTabColor = theme === 'playful' ? 'bg-orange-500' : 'bg-[#111111]';

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-24 relative">
      

      {/* Top Header - Floating over purple gradient */}
      <header className="fixed top-0 w-full z-50 flex items-center justify-between px-4 h-16 bg-white border-b border-slate-100 shadow-sm">
        <button onClick={() => { if (window.history.length > 1) router.back(); }} className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-50 text-slate-600 transition-colors hover:bg-slate-100">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-1">
          <Logo darkText={true} />
        </div>
        <button onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: business.business_name,
                text: business.business_description || 'Check out this store on Zoopcart!',
                url: window.location.href,
              }).catch(console.error);
            } else {
              navigator.clipboard.writeText(window.location.href);
              alert("Store link copied to clipboard!");
            }
        }} className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-50 text-slate-600 transition-colors hover:bg-slate-100">
          <Share2 className="w-5 h-5" />
        </button>
      </header>

      {/* Curved Hero */}
      <div className={`absolute top-0 w-full h-[220px] ${getHeroGradient()} rounded-b-[40px] shadow-inner`} style={{ clipPath: 'ellipse(120% 100% at 50% 0%)' }}></div>

      <div className="max-w-md mx-auto relative pt-[160px] px-4">
        
        {/* Profile Card */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 flex flex-col items-center text-center relative mt-4">
          
          {/* Avatar floating up */}
          <div className="absolute -top-12 w-24 h-24 rounded-full p-1 bg-white shadow-md">
            <div className="w-full h-full rounded-full overflow-hidden bg-slate-100 border border-slate-100 relative">
              {business.profile_image ? (
                <img src={business.profile_image} alt={business.business_name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-slate-100 text-[#111111] font-extrabold text-3xl">
                  {business.business_name?.charAt(0)}
                </div>
              )}
            </div>
            {/* Verified Badge */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1 border border-slate-100 whitespace-nowrap">
              <BadgeCheck className="w-3 h-3 text-green-500" />
              <span className="text-[9px] font-extrabold text-green-600">Verified Seller</span>
            </div>
          </div>

          <div className="mt-12 w-full">
            <h2 className="text-xl font-extrabold text-slate-900">{business.business_name}</h2>
            <p className="text-xs font-medium text-slate-500 mt-1">{business.business_description || "Quality products, trusted by customers"}</p>
            
            <div className="flex items-center justify-center gap-1 mt-2 text-sm">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-extrabold text-slate-900">5.0</span>
              <span className="text-slate-400 font-medium">(0 reviews)</span>
            </div>

            {/* Stats Row */}
            <div className="flex justify-between items-center px-4 mt-6">
              <div className="flex flex-col items-center">
                <span className="font-extrabold text-lg text-slate-900">{products.length}</span>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Products</span>
              </div>
              <div className="w-px h-8 bg-slate-100"></div>
              <div className="flex flex-col items-center">
                <span className="font-extrabold text-lg text-slate-900">0</span>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Followers</span>
              </div>
              <div className="w-px h-8 bg-slate-100"></div>
              <div className="flex flex-col items-center">
                <span className="font-extrabold text-lg text-slate-900">10+</span>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Customers</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6">
              <button onClick={() => window.open(`https://wa.me/${business.whatsapp_country_code || '91'}${business.whatsapp_number}`, '_blank')} className="flex-1 py-3 rounded-2xl bg-green-500 text-white font-extrabold flex items-center justify-center gap-2 shadow-sm shadow-green-500/30 hover:bg-green-600 transition-colors">
                <MessageCircle className="w-4 h-4" /> Chat
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center justify-between px-4 mt-6 border-b border-slate-200">
          {["Products", "About", "Reviews"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-sm font-extrabold transition-all relative ${activeTab === tab ? "text-slate-900" : "text-slate-400"}`}
            >
              {tab}
              {activeTab === tab && (
                <div className={`absolute bottom-0 left-0 w-full h-0.5 rounded-t-full ${activeTabColor}`}></div>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "Products" && (
          <div className="mt-6">
            {/* Search Bar */}
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input 
                  type="text" 
                  placeholder="Search products..." 
                  className={`w-full h-12 pl-10 pr-4 bg-white border border-slate-200 rounded-2xl text-sm font-medium outline-none focus:border-[#111111] focus:ring-1 focus:ring-[#111111]/20`}
                />
              </div>
              <button className="w-12 h-12 flex items-center justify-center bg-white border border-slate-200 rounded-2xl text-slate-600 hover:bg-slate-50">
                <Filter className="w-5 h-5" />
              </button>
            </div>

            {/* Categories */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar mt-4 pb-2">
              <button 
                onClick={() => setSelectedCategory('All')} 
                className={`px-5 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-colors ${selectedCategory === 'All' ? `${primaryColor} text-white shadow-sm` : 'bg-white border border-slate-200 text-slate-600'}`}
              >
                All
              </button>
              {Array.from(new Set(products.map(p => p.category).filter(Boolean))).map(cat => (
                <button 
                  key={cat} 
                  onClick={() => setSelectedCategory(cat)} 
                  className={`px-5 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-colors ${selectedCategory === cat ? `${primaryColor} text-white shadow-sm` : 'bg-white border border-slate-200 text-slate-600'}`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-2 gap-3 mt-4">
              {(selectedCategory === "All" ? products : products.filter(p => p.category === selectedCategory)).length === 0 ? (
                <div className="col-span-2 text-center py-12 bg-white rounded-3xl border border-slate-100">
                  <h3 className="font-extrabold text-lg text-slate-900">No products found</h3>
                  <p className="text-sm text-slate-500 mt-1">Try another category</p>
                </div>
              ) : (
                (selectedCategory === "All" ? products : products.filter(p => p.category === selectedCategory)).map((product) => (
                  <Link href={`/${business.username}/${product.slug}`} key={product.id} className="block group bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden hover:border-slate-300 transition-colors relative pb-3">
                    <button onClick={(e) => { e.preventDefault(); }} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-slate-300 hover:text-[#111111] hover:bg-white z-10 transition-colors shadow-sm">
                      <Heart className="w-4 h-4" />
                    </button>
                    <div className={`w-full bg-slate-50 overflow-hidden relative ${product.image ? "aspect-square" : "h-40"}`}>
                      {product.image ? (
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300 font-bold text-sm">No Image</div>
                      )}
                    </div>
                    <div className="px-3 pt-3">
                      <div className={`text-[9px] font-extrabold tracking-widest ${primaryText} uppercase mb-1`}>{product.category || "General"}</div>
                      <h3 className="font-extrabold text-sm text-slate-900 leading-tight mb-2 line-clamp-2">{product.name}</h3>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-base font-extrabold text-slate-900">₹{product.price}</span>
                        {product.original_price && (
                          <span className="text-[10px] font-bold text-slate-400 line-through">₹{product.original_price}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-[9px] font-bold text-green-600 mt-2 bg-green-50 self-start inline-flex px-1.5 py-0.5 rounded pl-1">
                        <div className="w-1 h-1 rounded-full bg-green-500"></div>
                        In stock &middot; ships soon
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        )}

        {/* Tab Content: About */}
        {activeTab === "About" && (
           <div className="mt-6 bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
              <h3 className="font-extrabold text-lg text-slate-900 mb-4">About Store</h3>
              <div className="space-y-4">
                 <div className="flex gap-3">
                    <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 shrink-0">
                       <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                    </div>
                    <div>
                       <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Member Since</div>
                       <div className="font-extrabold text-slate-900 text-sm">September 2026</div>
                    </div>
                 </div>
                 <div className="flex gap-3">
                    <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 shrink-0">
                       <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                    </div>
                    <div>
                       <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Location</div>
                       <div className="font-extrabold text-slate-900 text-sm">Saadatganj, Chamanganj</div>
                    </div>
                 </div>
                 <div className="flex gap-3">
                    <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 shrink-0">
                       <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                    </div>
                    <div>
                       <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Response Time</div>
                       <div className="font-extrabold text-slate-900 text-sm">Usually replies within a few hours</div>
                    </div>
                 </div>
              </div>
              <h3 className="font-extrabold text-lg text-slate-900 mb-4 mt-8">Our Commitment</h3>
              <div className="space-y-4">
                 <div className="flex gap-3">
                    <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-[#111111] shrink-0">
                       <BadgeCheck className="w-5 h-5" />
                    </div>
                    <div>
                       <div className="font-extrabold text-slate-900 text-sm mb-0.5">Quality Products</div>
                       <div className="text-xs font-medium text-slate-500">Only the best for our customers</div>
                    </div>
                 </div>
                 <div className="flex gap-3">
                    <div className="w-10 h-10 bg-purple-50 rounded-full flex items-center justify-center text-purple-500 shrink-0">
                       <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                    </div>
                    <div>
                       <div className="font-extrabold text-slate-900 text-sm mb-0.5">Customer Support</div>
                       <div className="text-xs font-medium text-slate-500">We're here to help you</div>
                    </div>
                 </div>
              </div>
           </div>
        )}

        {/* Tab Content: Reviews */}
        {activeTab === "Reviews" && (
           <div className="mt-6 bg-white rounded-3xl p-6 border border-slate-100 shadow-sm text-center">
              <h3 className="font-extrabold text-lg text-slate-900 mb-2">Customer Reviews</h3>
              <div className="flex justify-center items-center gap-2 mb-1">
                 <Star className="w-8 h-8 fill-yellow-400 text-yellow-400" />
                 <span className="text-3xl font-extrabold text-slate-900">5.0</span>
              </div>
              <p className="text-xs font-bold text-slate-400">Based on 0 reviews</p>

              <div className="mt-8 pt-8 border-t border-slate-100 flex flex-col items-center">
                 <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-4">
                    <MessageCircle className="w-8 h-8" />
                 </div>
                 <h4 className="font-extrabold text-slate-900">No reviews yet.</h4>
                 <p className="text-sm font-medium text-slate-500 mt-1 max-w-[200px]">Be the first to review this store and help other customers.</p>
                 <button className={`mt-6 px-8 py-3 ${primaryColor} text-white font-extrabold rounded-2xl shadow-sm transition-colors`}>
                    Write a Review
                 </button>
              </div>
           </div>
        )}
      </div>

      <StoreBottomNav username={business.username} />
    </div>
  );
}
