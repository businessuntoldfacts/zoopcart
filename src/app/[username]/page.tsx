import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import ClientTracker from "@/components/ClientTracker";
import StorefrontClient from "@/components/StorefrontClient";

export const revalidate = 0; // Dynamic route

export default async function StorefrontPage({ params }: { params: { username: string } }) {
  // 1. Fetch business and products
  const { data: business } = await supabase
    .from('businesses')
    .select('*, products(*)')
    .eq('username', params.username.toLowerCase())
    .single();

  if (!business) {
    notFound();
  }

  // 2. Fetch real analytics data
  const { count: storeViews } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })
    .eq('business_id', business.id)
    .eq('status', 'store_view');

  const { count: totalOrders } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })
    .eq('business_id', business.id)
    .not('status', 'in', '("store_view","product_view","review","platform_review")');

  const products = business.products || [];

  return (
    <>
      <ClientTracker businessId={business.id} type="store_view" />
      <StorefrontClient
        business={business}
        products={products}
        stats={{
          views: (storeViews || 0) + 120, // Adding some base views for "social proof"
          orders: totalOrders || 0
        }}
      />
    </>
  );
}
