import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

export default async function PublicProductPage({ params }: { params: { username: string, productSlug: string } }) {
  const { username, productSlug } = params;

  // Fetch business
  const { data: business } = await supabase
    .from("BUSINESSES")
    .select("*")
    .eq("username", username)
    .single();

  if (!business) {
    notFound();
  }

  // Fetch product
  const { data: product } = await supabase
    .from("PRODUCTS")
    .select("*")
    .eq("business_id", business.id)
    .eq("slug", productSlug)
    .single();

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-zyp-lightSurface text-zyp-bg">
      <header className="border-b border-black/5 bg-white">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href={`/${username}`} className="font-medium text-black/60 hover:text-black flex items-center gap-2">
            ← Back to {business.business_name}
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Image */}
          <div className="aspect-square bg-white rounded-2xl overflow-hidden shadow-sm border border-black/5 relative">
            {product.image ? (
              <img src={product.image} alt={product.name} className="object-cover w-full h-full" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-black/20">No Image</div>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col">
            <h1 className="font-display text-4xl font-bold mb-4">{product.name}</h1>
            <div className="text-2xl font-bold text-zyp-bg mb-6">
              {product.currency_symbol || '₹'}{product.price}
            </div>
            
            <div className="prose prose-sm max-w-none text-black/70 mb-8">
              {product.description || product.short_description}
            </div>

            <div className="mt-auto pt-8 border-t border-black/5">
              <div className="flex items-center gap-4 mb-4 text-sm text-black/60">
                <span className="flex items-center gap-1">
                  <CheckCircle className="w-4 h-4 text-zyp-success" />
                  {product.availability === 'in_stock' ? 'In Stock' : 'Available on order'}
                </span>
              </div>
              <Link href={`/${username}/${product.slug}/request`}>
                <Button size="lg" className="w-full shadow-lg">Request This Product</Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function CheckCircle(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <path d="m9 11 3 3L22 4" />
    </svg>
  );
}
