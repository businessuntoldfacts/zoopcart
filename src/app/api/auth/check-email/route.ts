import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required', exists: false }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Initialize Supabase with Service Role Key
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!serviceKey) {
      console.error('CRITICAL: SUPABASE_SERVICE_ROLE_KEY is missing in environment variables');
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      serviceKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        auth: { autoRefreshToken: false, persistSession: false }
      }
    );

    // 1. Try finding user in auth.users FIRST (Most reliable for accounts)
    if (serviceKey && serviceKey !== 'undefined') {
      try {
        const { data: userData, error: uError } = await supabaseAdmin.auth.admin.getUserByEmail(cleanEmail);
        if (userData?.user) {
          // Find if they have a business already
          const { data: bus } = await supabaseAdmin
            .from('businesses')
            .select('id, business_name, username')
            .eq('user_id', userData.user.id)
            .maybeSingle();

          return NextResponse.json({
            exists: true,
            userId: userData.user.id,
            businessName: bus?.business_name || null,
            username: bus?.username || null,
            provider: userData.user.app_metadata?.provider || 'email',
            source: 'auth'
          });
        }
      } catch (authErr) {
        console.error('Auth admin check failed (likely missing permissions):', authErr);
      }
    }

    // 2. Fallback: Try checking businesses table directly
    const { data: business, error: bError } = await supabaseAdmin
      .from('businesses')
      .select('id, user_id, business_name, username')
      .eq('email', cleanEmail)
      .maybeSingle();

    if (business) {
      // Try to get provider for this specific user_id if possible
      let provider = 'email';
      try {
        const { data: u } = await supabaseAdmin.auth.admin.getUserById(business.user_id);
        provider = u.user?.app_metadata?.provider || 'email';
      } catch (e) {}

      return NextResponse.json({
        exists: true,
        userId: business.user_id,
        businessName: business.business_name,
        username: business.username,
        provider,
        source: 'database'
      });
    }

    // 3. Last resort: Try finding by user_id if we have a match in auth.users by some other way?
    // Not possible here without more info.

    return NextResponse.json({
      exists: false,
      warning: !serviceKey ? 'SUPABASE_SERVICE_ROLE_KEY is missing. Validation may be incomplete.' : null
    });

    return NextResponse.json({ exists: false });
  } catch (err: any) {
    console.error('Check email error:', err);
    return NextResponse.json({
      error: 'Internal Server Error',
      details: err.message,
      exists: false
    }, { status: 500 });
  }
}
