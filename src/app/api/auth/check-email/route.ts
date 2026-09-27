import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required', exists: false }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();

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

    // Get id and user_id to help the frontend distinguish between "Already exists for ME" vs "Taken by someone else"
    const { data, error } = await supabaseAdmin
      .from('businesses')
      .select('id, user_id, business_name')
      .eq('email', cleanEmail)
      .maybeSingle();

    if (error) {
      console.error('Supabase query error in check-email:', error);
      throw error;
    }

    if (!data) {
      return NextResponse.json({ exists: false });
    }

    return NextResponse.json({
      exists: true,
      userId: data.user_id,
      businessName: data.business_name
    });
  } catch (err: any) {
    console.error('Check email error:', err);
    return NextResponse.json({ error: 'Internal Server Error', exists: false }, { status: 500 });
  }
}
