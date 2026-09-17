import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";

export default async function PublicStore({ params }: { params: { username: string } }) {
  const { username } = params;

  // Fetch business details
  const { data: business } = await supabase
    .from("BUSINESSES")
    .select("*")
    .eq("username", username)
    .single();

  if (!business) {
    notFound();
  }

  // Fetch products
  const { data: products } = await supabase
    .from("PRODUCTS")
    .select("*")
    .eq("business_id", business.id);

  return (
    <div className="min-h-screen bg-zyp-lightSurface text-zyp-bg">
      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* Store Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="w-24 h-24 rounded-full bg-white/10 mb-4 overflow-hidden relative shadow-md">
            {business.profile_image ? (
              <img src={business.profile_image} alt={business.business_name} className="object-cover w-full h-full" />
            ) : (
              <div className="w-full h-full bg-zyp-surface/10 flex items-center justify-center text-2xl font-bold">
                {business.business_name?.charAt(0)}
              </div>
            )}
          </div>
          
          <h1 className="font-display text-4xl font-bold mb-2">{business.business_name}</h1>
          <p className="text-zyp-bg/70 max-w-lg mb-6">{business.description || "Welcome to my store!"}</p>
          
          <div className="flex gap-4">
            {business.instagram_handle && (
              <a href={business.instagram_profile_url || `https://instagram.com/${business.instagram_handle}`} target="_blank" rel="noopener noreferrer">
                <Button variant="secondary" className="border-zyp-bg/20 text-zyp-bg hover:bg-black/5">Instagram</Button>
              </a>
            )}
            {business.whatsapp_number && (
              <a href={`https://wa.me/${business.whatsapp_country_code?.replace('+', '')}${business.whatsapp_number}`} target="_blank" rel="noopener noreferrer">
                <Button className="bg-[#25D366] text-white hover:bg-[#20b858]">WhatsApp</Button>
              </a>
            )}
          </div>
        </div>

        {/* Products Grid */}
        <div>
          <h2 className="font-display text-2xl font-bold mb-6">Products</h2>
          
          {!products || products.length === 0 ? (
            <div className="text-center py-16 text-zyp-bg/50">
              <PackageIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>This store hasn't added any products yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <Card key={product.id} className="bg-white border-black/5 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow">
                  <div className="aspect-square bg-black/5 relative">
                    {product.image ? (
                      <img src={product.image} alt={product.name} className="object-cover w-full h-full" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-black/20">No Image</div>
                    )}
                  </div>
                  <CardContent className="p-4 flex flex-col flex-1">
                    <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
                    <p className="text-sm text-black/60 line-clamp-2 mb-4">{product.short_description}</p>
                    <div className="mt-auto flex items-center justify-between">
                      <span className="font-display font-bold">
                        {product.currency_symbol || '₹'}{product.price}
                      </span>
                      <Link href={`/${username}/${product.slug}`}>
                        <Button size="sm">View</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function PackageIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m7.5 4.27 9 5.15" />
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5" />
      <path d="M12 22V12" />
    </svg>
  );
}
