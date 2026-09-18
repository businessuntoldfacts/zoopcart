const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://mdhhmlbbkwlbehoylmtm.supabase.co';
const supabaseKey = 'sb_publishable_uVJPYoSNft9EtASCa6DNTw_FfQ2UsL7';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDb() {
  console.log("Checking businesses table...");
  const { data, error } = await supabase.from('businesses').select('*').limit(1);
  if (error) {
    console.error("Error:", error.message);
  } else {
    console.log("Table exists! Data:", data);
  }
}

checkDb();
