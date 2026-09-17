"use client";
import { useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";

export default function ClientTracker({ businessId, productId, type }: { businessId: string, productId?: string, type: 'store_view' | 'product_view' }) {
  const tracked = useRef(false);

  useEffect(() => {
    if (tracked.current) return;
    tracked.current = true;
    
    // Fire and forget
    supabase.from('orders').insert([{
      business_id: businessId,
      product_id: productId || null,
      status: type,
      customer_name: "Anonymous Viewer",
      customer_phone: "0000000000",
      address: "View",
      total_amount: 0
    }]).then(() => {});
  }, [businessId, productId, type]);

  return null;
}
