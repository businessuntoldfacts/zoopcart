process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
import { createClient } from '@supabase/supabase-js';
const supabase = createClient('https://gpdfigstjjmqfxftjevg.supabase.co', 'sb_publishable_YY0bQZufo8Jr0NVD2GARXA_UJUcuk8x');
async function testQuery() {
  const { data } = await supabase.from('businesses').select('id, username').limit(3);
  console.log("Businesses:", data);
}
testQuery();
