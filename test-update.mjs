import { createClient } from "@supabase/supabase-js";
const supabase = createClient("https://gpdfigstjjmqfxftjevg.supabase.co", "sb_publishable_YY0bQZufo8Jr0NVD2GARXA_UJUcuk8x");
async function test() {
  const { data: b } = await supabase.from("businesses").select("*").limit(1);
  if (b && b.length > 0) {
     const { data: u, error } = await supabase.from("businesses").update({ business_name: b[0].business_name }).eq("id", b[0].id).select();
     console.log("Business update:", error ? error.message : "Success");
  } else {
     console.log("No business found. Cannot test.");
  }
}
test();
