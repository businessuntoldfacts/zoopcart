import { NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function getAdminClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!serviceRoleKey || !url) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY or URL is missing in environment");
  }

  return createClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  });
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const range = searchParams.get('range') || '7d';
    const supabaseAdmin = getAdminClient();

    const now = new Date();
    let startDate = new Date();
    let endDate = new Date();

    // Exact Range Calculation
    if (range === 'today') {
      startDate.setHours(0, 0, 0, 0);
    } else if (range === 'yesterday') {
      startDate.setDate(now.getDate() - 1);
      startDate.setHours(0, 0, 0, 0);
      endDate.setDate(now.getDate() - 1);
      endDate.setHours(23, 59, 59, 999);
    } else if (range === '7d') {
      startDate.setDate(now.getDate() - 7);
      startDate.setHours(0, 0, 0, 0);
    } else if (range === '30d') {
      startDate.setDate(now.getDate() - 30);
      startDate.setHours(0, 0, 0, 0);
    } else if (range === '90d') {
      startDate.setDate(now.getDate() - 90);
      startDate.setHours(0, 0, 0, 0);
    } else if (range === 'lifetime') {
      startDate = new Date(2020, 0, 1);
    }

    // 1. Platform Totals (Always Lifetime)
    const { count: totalStores } = await supabaseAdmin.from('businesses').select('*', { count: 'exact', head: true });
    const { count: activeStores } = await supabaseAdmin.from('businesses').select('*', { count: 'exact', head: true }).neq('status', 'suspended');

    // 2. Orders & Revenue (Filtered by Range)
    // Removed 'total_amount' because it does not exist in the database schema. Using 'budget'.
    let orderQuery = supabaseAdmin
      .from('orders')
      .select('budget, created_at, status, customer_name, businesses(business_name)')
      .not('status', 'in', '("store_view","product_view","review","platform_review")');

    if (range !== 'lifetime') {
      orderQuery = orderQuery.gte('created_at', startDate.toISOString());
      if (range === 'yesterday') {
        orderQuery = orderQuery.lte('created_at', endDate.toISOString());
      }
    }

    const { data: filteredOrders, error: ordersError } = await orderQuery;
    if (ordersError) throw ordersError;

    // 3. Analytics Chart Data
    const chartDays = range === '90d' ? 90 : (range === '30d' ? 30 : 7);
    const timeLabels = [...Array(chartDays)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toDateString();
    }).reverse();

    const dailyData = new Array(chartDays).fill(0);
    let rangeVolume = 0;

    filteredOrders?.forEach(o => {
      const orderVal = o.budget || 0;
      rangeVolume += orderVal;

      const orderDate = new Date(o.created_at).toDateString();
      const dayIndex = timeLabels.indexOf(orderDate);
      if (dayIndex !== -1) {
        dailyData[dayIndex]++;
      }
    });

    // 4. Latest Activity (Always show most recent 10, regardless of filter)
    const { data: latestStores } = await supabaseAdmin
      .from('businesses')
      .select('id, business_name, created_at')
      .order('created_at', { ascending: false })
      .limit(5);

    const { data: latestOrders } = await supabaseAdmin
      .from('orders')
      .select('id, customer_name, created_at, businesses(business_name)')
      .not('status', 'in', '("store_view","product_view","review","platform_review")')
      .order('created_at', { ascending: false })
      .limit(5);

    const activities = [
      ...(latestStores || []).map(b => ({ type: 'business', name: b.business_name, time: b.created_at, id: b.id })),
      ...(latestOrders || []).map(o => ({
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
        orders: filteredOrders?.length || 0,
        volume: rangeVolume,
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
