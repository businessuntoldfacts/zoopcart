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
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }

      const { data: business } = await supabase.from('businesses').select('*').eq('user_id', user.id).single();
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

