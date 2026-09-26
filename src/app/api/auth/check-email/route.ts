import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Initialize Supabase with Service Role Key to bypass RLS for this specific check
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    const { data, error } = await supabaseAdmin
      .from('businesses')
      .select('email')
      .eq('email', email.toLowerCase().trim())
      .maybeSingle();

    if (error) throw error;

    return NextResponse.json({ exists: !!data });
  } catch (err: any) {
    console.error('Check email error:', err);
    return NextResponse.json({ error: 'Internal Server Error', exists: false }, { status: 500 });
  }
}
