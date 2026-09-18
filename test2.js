const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = 'https://mdhhmlbbkwlbehoylmtm.supabase.co';
const supabaseKey = 'sb_publishable_uVJPYoSNft9EtASCa6DNTw_FfQ2UsL7';
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data: b } = await supabase.from('businesses').select('*');
  console.log("Businesses:", b);
}
check();
