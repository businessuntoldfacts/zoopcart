import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import ClientTracker from "@/components/ClientTracker";
import StorefrontClient from "@/components/StorefrontClient";

export const revalidate = 0; // Dynamic route

export default async function StorefrontPage({ params }: { params: { username: string } }) {
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
    <>
      <ClientTracker businessId={business.id} type="store_view" />
      <StorefrontClient business={business} products={products} />
    </>
  );
}
