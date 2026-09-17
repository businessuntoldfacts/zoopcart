import { createClient } from "@supabase/supabase-js";
const supabase = createClient("https://gpdfigstjjmqfxftjevg.supabase.co", "sb_publishable_YY0bQZufo8Jr0NVD2GARXA_UJUcuk8x");
async function test() {
  const { data: o, error } = await supabase.from("orders").insert([{ business_id: "00000000-0000-0000-0000-000000000000" }]).select();
  console.log("Orders insert test:", error ? error.message : "Success");
}
test();
