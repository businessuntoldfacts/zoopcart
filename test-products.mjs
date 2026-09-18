process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
import { createClient } from '@supabase/supabase-js';
const supabase = createClient('https://gpdfigstjjmqfxftjevg.supabase.co', 'sb_publishable_YY0bQZufo8Jr0NVD2GARXA_UJUcuk8x');
async function testQuery() {
  const { data, error } = await supabase.from('products').select('id').limit(1);
  console.log("Products:", data, error);
}
testQuery();
