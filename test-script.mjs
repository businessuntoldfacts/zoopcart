import { createClient } from "@supabase/supabase-js";
const supabase = createClient("https://gpdfigstjjmqfxftjevg.supabase.co", "sb_publishable_YY0bQZufo8Jr0NVD2GARXA_UJUcuk8x");
async function test() {
  let { data: b } = await supabase.from("businesses").select("*").limit(1);
  console.log("Businesses:", b ? Object.keys(b[0]) : null);
  let { data: p } = await supabase.from("products").select("*").limit(1);
  console.log("Products:", p ? Object.keys(p[0]) : null);
}
test();
