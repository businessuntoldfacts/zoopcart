import { createClient } from "@supabase/supabase-js";
const supabase = createClient("https://gpdfigstjjmqfxftjevg.supabase.co", "sb_publishable_YY0bQZufo8Jr0NVD2GARXA_UJUcuk8x");
async function test() {
  const { data, error } = await supabase.from("reviews").insert([{}]).select();
  console.log("Reviews insert test:", error ? error.message : "Success");
}
test();
