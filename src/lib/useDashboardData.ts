import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

let cache = {
  user: null as any,
  business: null as any,
  orders: [] as any[],
  products: [] as any[],
  timestamp: 0
};

export function useDashboardData() {
  const [data, setData] = useState(cache);
  // Show loading only if we have no business in cache or cache is empty
  const [loading, setLoading] = useState(!cache.business);

  useEffect(() => {
    // If we have cache, we are already showing it. Just fetch in background to refresh.
    fetchData();

    async function fetchData() {
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user;
      if (!user) { setLoading(false); return; }

      let { data: business } = await supabase.from('businesses').select('*').eq('user_id', user.id).maybeSingle();

      // Fallback: If not found by user_id, check by verified email to support multiple login providers smoothly
      if (!business && user.email && typeof user.email === 'string') {
        const { data: foundByEmail } = await supabase.from('businesses').select('*').eq('email', user.email.trim().toLowerCase()).maybeSingle();
        if (foundByEmail) {
          business = foundByEmail;
          // Silently heal user_id mismatch on the client side too
          try {
            await supabase.from('businesses').update({ user_id: user.id }).eq('id', business.id);
          } catch (e) {}
        }
      }

      if (!business) { setLoading(false); return; }

      const [ordersRes, productsRes] = await Promise.all([
        supabase.from('orders').select('*, products(*)').eq('business_id', business.id).order('created_at', { ascending: false }),
        supabase.from('products').select('*').eq('business_id', business.id).order('created_at', { ascending: false })
      ]);

      const newData = {
        user,
        business,
        orders: ordersRes.data || [],
        products: productsRes.data || [],
        timestamp: Date.now()
      };
      cache = newData;
      setData(newData);
      setLoading(false);
    }
  }, []);

  return { ...data, loading };
}

export function invalidateDashboardCache() {
  cache.timestamp = 0; // Force full load next time if needed
}

