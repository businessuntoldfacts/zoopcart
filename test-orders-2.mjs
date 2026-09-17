import { createClient } from "@supabase/supabase-js";
const supabase = createClient("https://gpdfigstjjmqfxftjevg.supabase.co", "sb_publishable_YY0bQZufo8Jr0NVD2GARXA_UJUcuk8x");
async function test() {
  const { data: b } = await supabase.from("businesses").select("*").limit(1).single();
  const res = await supabase.from("orders").insert([{ 
    business_id: b.id, 
    status: 'test_view' 
  }]).select();
  console.log("Orders insert test view:", res.error ? res.error.message : "Success");
}
test();
