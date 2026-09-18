process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
import { createClient } from '@supabase/supabase-js';
const supabase = createClient('https://gpdfigstjjmqfxftjevg.supabase.co', 'sb_publishable_YY0bQZufo8Jr0NVD2GARXA_UJUcuk8x');
async function testQuery() {
  const { data, error } = await supabase.from('orders').insert({
    business_id: 'f94a381b-b29b-4963-9e38-68cf4f4d1a0e',
    product_id: '69a66486-b169-4c75-b45e-3da40fe603ba',
    customer_name: 'Test',
    customer_phone: '1234567890',
    delivery_location: 'Test location',
    quantity: 1,
    notes: 'Total Amount: 20',
    status: 'pending'
  });
  console.log("Error:", error);
}
testQuery();
