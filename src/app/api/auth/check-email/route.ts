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

    // 1. Try checking businesses table directly (for records where email is saved)
    let { data: business, error: bError } = await supabaseAdmin
      .from('businesses')
      .select('id, user_id, business_name')
      .eq('email', cleanEmail)
      .maybeSingle();

    if (business) {
      return NextResponse.json({
        exists: true,
        userId: business.user_id,
        businessName: business.business_name
      });
    }

    // 2. Try finding user in auth.users by email to handle cases where email isn't in businesses table
    const { data: userData, error: uError } = await supabaseAdmin.auth.admin.getUserByEmail(cleanEmail);

    if (userData?.user) {
      return NextResponse.json({
        exists: true,
        userId: userData.user.id,
        businessName: null
      });
    }

    return NextResponse.json({ exists: false });
  } catch (err: any) {
    console.error('Check email error:', err);
    return NextResponse.json({ error: 'Internal Server Error', exists: false }, { status: 500 });
  }
}
