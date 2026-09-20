"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function Logo({ className = "", darkText = false }: { className?: string, darkText?: boolean }) {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <Link href={user ? "/dashboard" : "/"} className={`flex items-center hover:opacity-90 transition-opacity ${className}`}>
      <img 
        src="/logo-black.jpg?v=1" 
        alt="Zoopcart" 
        className="h-14 md:h-16 w-auto object-contain" 
        style={{ mixBlendMode: 'multiply' }}
      />
    </Link>
  );
}
