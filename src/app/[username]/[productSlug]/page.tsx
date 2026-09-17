import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Heart, ShoppingCart, ArrowLeft, ShieldCheck, Zap, FileText, ShoppingBag, Truck, Share2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ClientTracker from "@/components/ClientTracker";
import ReviewSystem from "@/components/ReviewSystem";

export default async function ProductDetailPage({ params }: { params: { username: string, productSlug: string } }) {
  const { data: business } = await supabase
    .from('businesses')
    .select('*')
    .eq('username', params.username.toLowerCase())
    .single();

  if (!business) notFound();

  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('business_id', business.id)
    .eq('slug', params.productSlug)
    .single();

  if (!product) notFound();

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-32">
      <ClientTracker businessId={business.id} productId={product.id} type="product_view" />
      
      {/* Top Header */}
      <header className="bg-white px-4 h-16 flex items-center justify-between sticky top-0 z-50 border-b border-slate-100 shadow-sm">
        <div className="flex items-center gap-3">
          <Link href={`/${business.username}`} className="w-10 h-10 flex items-center justify-center -ml-2 text-slate-900">
             <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
            {business.profile_image ? (
              <img src={business.profile_image} alt={business.business_name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-pink-50 text-pink-600 font-bold text-sm">
                {business.business_name?.charAt(0)}
              </div>
            )}
          </div>
          <h1 className="font-extrabold text-lg text-slate-900 tracking-tight">{business.business_name}</h1>
        </div>
        <div className="flex items-center gap-4">
          <Link href={`/${business.username}/saved`} className="text-slate-600 hover:text-pink-600 transition-colors"><Heart className="w-6 h-6" /></Link>
          <Link href={`/${business.username}/cart`} className="w-10 h-10 bg-pink-600 hover:bg-pink-700 text-white rounded-xl flex items-center justify-center shadow-md transition-colors relative"><ShoppingCart className="w-5 h-5 fill-current" /><span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-slate-900 text-white text-[9px] font-bold flex items-center justify-center rounded-full border-2 border-white">0</span></Link>
        </div>
      </header>

      <div className="max-w-md mx-auto bg-white min-h-screen relative shadow-sm border-x border-slate-100 pb-8">
        
        {/* Breadcrumbs */}
        <div className="px-4 py-4 flex items-center gap-2 text-sm font-bold text-slate-500 border-b border-slate-50 mb-2">
          <Link href={`/${business.username}`} className="hover:text-pink-600">Store</Link>
          <span className="text-slate-300">/</span>
          <Link href={`/${business.username}`} className="hover:text-pink-600">{product.category || "General"}</Link>
          <span className="text-slate-300">/</span>
          <span className="text-slate-800 truncate">{product.name}</span>
        </div>

        {/* Product Image */}
        <div className="w-full aspect-[4/5] sm:aspect-square bg-slate-100 relative">
          {product.image ? (
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400 font-medium bg-slate-50">
               No Image
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="px-5 pt-8 pb-4">
          
          <div className="text-[10px] font-extrabold text-pink-500 uppercase tracking-widest mb-2">
             {product.category || "General"}
          </div>

          <h1 className="text-3xl font-extrabold text-slate-900 mb-4 leading-tight">{product.name}</h1>
          
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl font-extrabold text-slate-900">₹{product.price}</span>
            {product.sale_price && (
               <>
                 <span className="text-lg font-bold line-through text-slate-400">₹{product.sale_price}</span>
                 <span className="px-2 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wider bg-pink-50 text-pink-700">Sale</span>
               </>
            )}
          </div>
          
          <div className="flex items-center gap-1.5 text-sm font-bold text-green-600 mb-8 border-b border-slate-100 pb-8">
             <div className="w-2 h-2 rounded-full bg-green-600"></div>
             In stock · ships soon
          </div>

          <div className="mb-8">
             <h3 className="text-lg font-extrabold mb-3 text-slate-900">About this product</h3>
             <p className="text-sm leading-relaxed font-medium text-slate-600 whitespace-pre-line">
               {product.description || product.short_description || "No description provided."}
             </p>
          </div>
          
          {/* Action buttons inside content for desktop fallback */}
          <div className="flex gap-3 mt-8">
             <Button className="flex-1 h-14 rounded-2xl bg-pink-600 hover:bg-pink-700 text-white text-base font-extrabold shadow-md">
                Add to Cart <ArrowRight className="w-5 h-5 ml-2" />
             </Button>
             <a href={`https://wa.me/${business.whatsapp_country_code}${business.whatsapp_number}?text=Hi, I am interested in ${product.name}`} target="_blank" className="w-14 h-14 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center hover:bg-green-100 transition-colors">
                <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current" xmlns="http://www.w3.org/2000/svg">
                   <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
                </svg>
             </a>
          </div>
        </div>

        <div className="px-5 pb-8 bg-white"><ReviewSystem businessId={business.id} productId={product.id} /></div>
        {/* Footer inside detail page */}
        <div className="px-5 pb-8">
           <div className="flex items-center gap-2 mb-6 mt-12">
              <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center font-bold text-white text-sm">
                 {business.business_name?.charAt(0)}
              </div>
              <span className="font-extrabold text-lg text-slate-900">{business.business_name}</span>
           </div>
           <div className="text-xs font-bold text-slate-500 flex flex-col gap-2">
             <p>© 2026 {business.business_name}. All rights reserved.</p>
           </div>
        </div>
      </div>

      {/* Sticky Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 p-4 pb-safe shadow-[0_-10px_20px_rgba(0,0,0,0.03)] z-50 md:hidden">
        <div className="max-w-md mx-auto flex gap-3">
          <Link href={`/${business.username}/${product.slug}/request`} className="flex-1">
            <Button className="w-full h-14 rounded-2xl text-lg font-bold shadow-lg shadow-pink-600/20 bg-pink-600 hover:bg-pink-700 text-white border-none">
              Request Product
            </Button>
          </Link>
          <a href={`https://wa.me/${business.whatsapp_country_code}${business.whatsapp_number}?text=Hi, I am interested in ${product.name}`} target="_blank" className="w-14 h-14 shrink-0 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center hover:bg-green-100 transition-colors">
             <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
             </svg>
          </a>
        </div>
      </div>
    </div>
  );
}


