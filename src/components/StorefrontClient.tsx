"use client";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Logo from "@/components/Logo";
import { ArrowLeft, Share2, Heart, Search, Filter, MessageCircle, Star, BadgeCheck, MapPin, LayoutGrid } from "lucide-react";
import StoreBottomNav from "@/components/StoreBottomNav";
import ReviewSystem from "@/components/ReviewSystem";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function StorefrontClient({ business, products, stats }: { business: any, products: any[], stats?: { views: number, orders: number } }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Products");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [savedItems, setSavedItems] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('zoopcart_saved');
    if (saved) {
      try {
        setSavedItems(JSON.parse(saved));
      } catch (e) {
        setSavedItems([]);
      }
    }
  }, []);

  const toggleSave = (productId: string) => {
    const newSaved = savedItems.includes(productId)
      ? savedItems.filter(id => id !== productId)
      : [...savedItems, productId];
    setSavedItems(newSaved);
    localStorage.setItem('zoopcart_saved', JSON.stringify(newSaved));
    window.dispatchEvent(new Event('cart-updated'));
  };

  const extraSettings = useMemo(() => {
    try {
      if (business?.instagram_profile_url?.startsWith('{')) {
        return JSON.parse(business.instagram_profile_url);
      }
    } catch (e) {}
    return {};
  }, [business?.instagram_profile_url]);

  const theme = extraSettings.theme || (business?.instagram_profile_url && !business.instagram_profile_url.startsWith('{') ? business.instagram_profile_url : 'light');

  const getHeroGradient = () => {
    if (theme === 'dark') return 'bg-gradient-to-br from-slate-900 via-slate-900 to-black';
    if (theme === 'playful') return 'bg-gradient-to-br from-orange-400 via-amber-500 to-yellow-400';
    return 'bg-[#111111]';
  };

  const primaryColor = theme === 'playful' ? 'bg-orange-500 shadow-orange-500/20' : 'bg-[#111111] shadow-black/20';
  const primaryText = theme === 'playful' ? 'text-orange-500' : 'text-[#111111]';
  const activeTabColor = theme === 'playful' ? 'bg-orange-500' : 'bg-[#111111]';

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    const name = product.name?.toLowerCase() || "";
    const description = product.description?.toLowerCase() || "";
    const search = searchQuery.toLowerCase();
    const matchesSearch = name.includes(search) || description.includes(search);
    return matchesCategory && matchesSearch;
  });

  const getMemberSince = () => {
    if (!business.created_at) return "Active Seller";
    try {
      const date = new Date(business.created_at);
      return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    } catch (e) {
      return "Active Seller";
    }
  };

  const whatsappNumber = business.whatsapp_number || extraSettings.whatsapp_number || '';
  const whatsappCountryCode = business.whatsapp_country_code || extraSettings.whatsapp_country_code || '91';
  const instaFollowers = extraSettings.insta_followers || '';

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-24 relative overflow-x-hidden">
      {/* Top Header */}
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="fixed top-0 w-full z-50 flex items-center justify-between px-4 h-16 bg-white border-b border-slate-100 shadow-sm"
      >
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
      </motion.header>

      {/* Curved Hero */}
      <motion.div
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className={`absolute top-0 w-full h-[220px] ${getHeroGradient()} rounded-b-[40px] shadow-inner`}
        style={{ clipPath: 'ellipse(120% 100% at 50% 0%)' }}
      ></motion.div>

      <div className="max-w-md mx-auto relative pt-[120px] px-4">
        {/* Profile Card */}
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
          className="bg-white rounded-3xl p-5 shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col items-center text-center relative mt-12"
        >
          {/* Avatar floating up */}
          <div className="absolute -top-12 w-24 h-24 rounded-full p-1 bg-white shadow-md">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="w-full h-full rounded-full overflow-hidden bg-slate-100 border border-slate-100 relative"
            >
              {business.profile_image ? (
                <img src={business.profile_image} alt={business.business_name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-slate-100 text-[#111111] font-extrabold text-3xl">
                  {business.business_name?.charAt(0)}
                </div>
              )}
            </motion.div>
            {/* Verified Badge */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1 border border-slate-100 whitespace-nowrap">
              <BadgeCheck className="w-3 h-3 text-green-500" />
              <span className="text-[9px] font-extrabold text-green-600">Verified Seller</span>
            </div>
          </div>

          <div className="mt-12 w-full">
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">{business.business_name}</h2>
            <p className="text-xs font-medium text-slate-500 mt-1 px-4">{business.business_description || "Quality products, trusted by customers"}</p>
            
            <div className="flex items-center justify-center gap-1 mt-2 text-sm">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-extrabold text-slate-900">5.0</span>
              <span className="text-slate-400 font-medium">(0 reviews)</span>
            </div>

            {/* Insta & Location Badges */}
            <div className="flex items-center justify-center gap-2 mt-4">
              {instaFollowers && (
                <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-full shadow-sm">
                  <svg className="w-3.5 h-3.5 text-pink-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                  <span className="text-[10px] font-extrabold text-slate-700 uppercase tracking-tight">{instaFollowers}</span>
                </div>
              )}
              {business.city && (
                <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-full shadow-sm">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-[10px] font-extrabold text-slate-700 uppercase tracking-tight">{business.city}</span>
                </div>
              )}
            </div>

            {/* Stats Row */}
            <div className="flex justify-between items-center px-4 mt-6 bg-slate-50/60 p-3 rounded-2xl border border-slate-50 w-full">
              <div className="flex flex-col items-center">
                <span className="font-extrabold text-lg text-slate-900">{products.length}</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Products</span>
              </div>
              <div className="w-px h-6 bg-slate-200/60"></div>
              <div className="flex flex-col items-center">
                <span className="font-extrabold text-lg text-slate-900">{stats?.views ?? '120+'}</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Views</span>
              </div>
              <div className="w-px h-6 bg-slate-200/60"></div>
              <div className="flex flex-col items-center">
                <span className="font-extrabold text-lg text-green-600">{stats?.orders ?? '0'}</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Orders</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2.5 mt-5 w-full">
              {whatsappNumber && (
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    const message = encodeURIComponent(`Hi ${business.business_name}, I'm interested in your products!`);
                    window.open(`https://wa.me/${whatsappCountryCode}${whatsappNumber}?text=${message}`, '_blank');
                  }}
                  className="w-full py-3.5 rounded-2xl bg-green-500 text-white font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-green-500/10 hover:bg-green-600 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" /> Chat with Seller
                </motion.button>
              )}

              {business.instagram_handle && (
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    const handle = business.instagram_handle.replace('@', '').trim();
                    window.open(`https://instagram.com/${handle}`, '_blank');
                  }}
                  className="w-full py-3.5 rounded-2xl bg-white text-slate-900 border border-slate-200 font-extrabold flex items-center justify-center gap-2 shadow-md hover:bg-slate-50 transition-colors"
                >
                  <svg className="w-4 h-4 text-pink-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                  <span>Visit Instagram</span>
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex items-center justify-between px-2 mt-8 border-b border-slate-200">
          {["Products", "About", "Reviews"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-sm font-extrabold transition-all relative px-2 ${activeTab === tab ? "text-slate-900" : "text-slate-400"}`}
            >
              {tab}
              {activeTab === tab && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className={`absolute bottom-0 left-0 w-full h-0.5 rounded-t-full ${activeTabColor}`}
                />
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="mt-6 min-h-[300px]">
          <AnimatePresence mode="wait">
            {activeTab === "Products" && (
              <motion.div
                key="products-tab"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2 }}
              >
                {/* Search Bar */}
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search products..."
                      className="w-full h-12 pl-10 pr-4 bg-white border border-slate-200 rounded-2xl text-sm font-medium outline-none focus:border-[#111111] focus:ring-1 focus:ring-[#111111]/20 shadow-sm"
                    />
                  </div>
                </div>

                {/* Categories */}
                <div className="flex gap-2 overflow-x-auto no-scrollbar mt-4 pb-2">
                  <div className="flex flex-col items-center gap-1 shrink-0">
                    <button
                      onClick={() => setSelectedCategory('All')}
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-200 ${selectedCategory === 'All' ? `${primaryColor} text-white shadow-lg` : 'bg-white border border-slate-100 text-slate-400 shadow-sm'}`}
                    >
                      <LayoutGrid className="w-6 h-6" />
                    </button>
                    <span className={`text-[10px] font-bold ${selectedCategory === 'All' ? 'text-slate-900' : 'text-slate-400'}`}>Category</span>
                  </div>

                  {Array.from(new Set(products.map(p => p.category).filter(Boolean))).map((cat, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-1 shrink-0">
                      <button
                        onClick={() => setSelectedCategory(cat as string)}
                        className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-200 ${selectedCategory === cat ? `${primaryColor} text-white shadow-lg` : 'bg-white border border-slate-100 text-[#111111] shadow-sm font-extrabold text-lg'}`}
                      >
                        {String(cat).charAt(0).toUpperCase()}
                      </button>
                      <span className={`text-[10px] font-bold ${selectedCategory === cat ? 'text-slate-900' : 'text-slate-400'} max-w-[70px] truncate`}>{cat as string}</span>
                    </div>
                  ))}
                </div>

                {/* Product Grid */}
                <motion.div layout className="grid grid-cols-2 gap-3 mt-4">
                  {filteredProducts.length === 0 ? (
                    <div className="col-span-2 text-center py-12 bg-white rounded-3xl border border-slate-100 shadow-sm">
                      <h3 className="font-extrabold text-lg text-slate-900">No products found</h3>
                      <p className="text-sm text-slate-500 mt-1">Try another search or category</p>
                    </div>
                  ) : (
                    filteredProducts.map((product, idx) => (
                      <motion.div
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: Math.min(idx * 0.05, 0.3) }}
                        key={product.id}
                      >
                        <Link href={`/${business.username}/${product.slug}`} className="block group bg-white rounded-3xl border border-slate-100 shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 relative pb-3 h-full">
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              toggleSave(product.id);
                            }}
                            className={`absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center z-10 transition-all shadow-sm ${savedItems.includes(product.id) ? 'text-red-500 scale-110' : 'text-slate-300 hover:text-[#111111]'}`}
                          >
                            <Heart className={`w-4 h-4 ${savedItems.includes(product.id) ? 'fill-current' : ''}`} />
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
                            <h3 className="font-extrabold text-sm text-slate-900 leading-tight mb-2 line-clamp-2 min-h-[2.5rem] group-hover:text-black transition-colors">{product.name}</h3>
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
                      </motion.div>
                    ))
                  )}
                </motion.div>
              </motion.div>
            )}

            {activeTab === "About" && (
              <motion.div
                key="about-tab"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="bg-white rounded-3xl p-6 border border-slate-100 shadow-md space-y-6"
              >
                <h3 className="font-extrabold text-lg text-slate-900 mb-4">About Store</h3>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 shrink-0">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Member Since</div>
                      <div className="font-extrabold text-slate-900 text-sm">{getMemberSince()}</div>
                    </div>
                  </div>
                  {business.address && (
                    <div className="flex gap-3">
                      <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 shrink-0">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Location</div>
                        <div className="font-extrabold text-slate-900 text-sm">{business.address}</div>
                      </div>
                    </div>
                  )}
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

                <h3 className="font-extrabold text-lg text-slate-900 mb-4 pt-4 border-t border-slate-100">Our Commitment</h3>
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
                </div>
              </motion.div>
            )}

            {activeTab === "Reviews" && (
              <motion.div
                key="reviews-tab"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
              >
                <ReviewSystem businessId={business.id} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <StoreBottomNav username={business.username} />
    </div>
  );
}
