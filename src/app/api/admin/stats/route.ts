import { NextResponse } from "next/server";

function getAdminClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is missing");
  }
  const { createClient } = require('@supabase/supabase-js');
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    serviceRoleKey,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

export async function GET() {
  try {
    const supabaseAdmin = getAdminClient();

    // 1. Total Businesses
    const { count: totalStores } = await supabaseAdmin
      .from('businesses')
      .select('*', { count: 'exact', head: true });

    const { count: activeStores } = await supabaseAdmin
      .from('businesses')
      .select('*', { count: 'exact', head: true })
      .neq('status', 'suspended');

    // 2. Fetch Orders for Stats (Last 30 days for chart and totals)
    const { data: orders, error: ordersError } = await supabaseAdmin
      .from('orders')
      .select('total_amount, budget, created_at, status, customer_name, businesses(business_name)')
      .not('status', 'in', '("store_view","product_view","review","platform_review")');

    if (ordersError) throw ordersError;

    // 3. Calculate Metrics
    let volume = 0;
    let todayOrders = 0;
    let todayRevenue = 0;
    const today = new Date().toDateString();

    const last7Days = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toDateString();
    }).reverse();

    const dailyData = new Array(7).fill(0);

    orders?.forEach(o => {
      const orderDate = new Date(o.created_at).toDateString();
      const orderVal = o.total_amount || o.budget || 0;

      volume += orderVal;

      if (orderDate === today) {
        todayOrders++;
        todayRevenue += orderVal;
      }

      const dayIndex = last7Days.indexOf(orderDate);
      if (dayIndex !== -1) {
        dailyData[dayIndex]++;
      }
    });

    // 4. Recent Activity
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
    ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 8);

    return NextResponse.json({
      success: true,
      stats: {
        stores: totalStores || 0,
        orders: orders?.length || 0,
        volume,
        activeStores: activeStores || 0,
        todayOrders,
        todayRevenue,
        chartData: dailyData,
        activities
      }
    });
  } catch (error: any) {
    console.error("Stats API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
