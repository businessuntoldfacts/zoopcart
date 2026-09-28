import { NextResponse } from "next/server";

function getAdminClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!serviceRoleKey || !url) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY or URL is missing in environment");
  }

  const { createClient } = require('@supabase/supabase-js');
  return createClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  });
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const range = searchParams.get('range') || '7d';
    const supabaseAdmin = getAdminClient();

    // Calculate start date based on range
    const now = new Date();
    let startDate = new Date();

    if (range === 'today') startDate.setHours(0, 0, 0, 0);
    else if (range === 'yesterday') {
      startDate.setDate(now.getDate() - 1);
      startDate.setHours(0, 0, 0, 0);
      now.setHours(0,0,0,0); // For yesterday, we only want that day's data
    }
    else if (range === '7d') startDate.setDate(now.getDate() - 7);
    else if (range === '30d') startDate.setDate(now.getDate() - 30);
    else if (range === '90d') startDate.setDate(now.getDate() - 90);
    else if (range === 'lifetime') startDate = new Date(2000, 0, 1);

    // 1. Basic Platform Counts (Always Lifetime)
    const { count: totalStores } = await supabaseAdmin.from('businesses').select('*', { count: 'exact', head: true });
    const { count: activeStores } = await supabaseAdmin.from('businesses').select('*', { count: 'exact', head: true }).neq('status', 'suspended');

    // 2. Fetch Orders for specific range
    let query = supabaseAdmin
      .from('orders')
      .select('total_amount, budget, created_at, status, customer_name, businesses(business_name)')
      .not('status', 'in', '("store_view","product_view","review","platform_review")');

    if (range !== 'lifetime') {
      query = query.gte('created_at', startDate.toISOString());
      if (range === 'yesterday') {
        query = query.lt('created_at', now.toISOString());
      }
    }

    const { data: orders, error: ordersError } = await query;
    if (ordersError) throw ordersError;

    // 3. Calculate Metrics
    let volume = 0;
    const today = new Date().toDateString();

    // For Chart (Always show last 7 or 14 points for visual)
    const chartDays = range === '90d' ? 90 : (range === '30d' ? 30 : 7);
    const timeLabels = [...Array(chartDays)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toDateString();
    }).reverse();

    const dailyData = new Array(chartDays).fill(0);

    orders?.forEach(o => {
      const orderVal = o.total_amount || o.budget || 0;
      volume += orderVal;

      const orderDate = new Date(o.created_at).toDateString();
      const dayIndex = timeLabels.indexOf(orderDate);
      if (dayIndex !== -1) {
        dailyData[dayIndex]++;
      }
    });

    // 4. Activity (Always latest)
    const { data: recentStores } = await supabaseAdmin
      .from('businesses')
      .select('id, business_name, created_at')
      .order('created_at', { ascending: false })
      .limit(5);

    const activities = [
      ...(recentStores || []).map(b => ({ type: 'business', name: b.business_name, time: b.created_at, id: b.id })),
      ...(orders || [])
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 5)
        .map(o => ({
          type: 'order',
          name: o.customer_name,
          store: o.businesses?.business_name,
          time: o.created_at,
          id: o.id
        }))
    ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 10);

    return NextResponse.json({
      success: true,
      stats: {
        stores: totalStores || 0,
        orders: orders?.length || 0,
        volume,
        activeStores: activeStores || 0,
        chartData: dailyData,
        chartLabels: timeLabels,
        activities
      }
    });
  } catch (error: any) {
    console.error("Stats API Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
