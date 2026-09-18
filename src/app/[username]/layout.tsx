import { supabase } from "@/lib/supabase";
import StoreThemeWrapper from "@/components/StoreThemeWrapper";
import { notFound } from "next/navigation";

export default async function StoreLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { username: string };
}) {
  const { data: business } = await supabase
    .from('businesses')
    .select('instagram_profile_url')
    .eq('username', params.username.toLowerCase())
    .single();

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

  return (
    <StoreThemeWrapper theme={theme}>
      {children}
    </StoreThemeWrapper>
  );
}
