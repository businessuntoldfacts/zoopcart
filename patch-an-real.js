const fs = require('fs');
let code = fs.readFileSync('src/app/dashboard/analytics/page.tsx', 'utf8');

const replacement = `
  const [stats, setStats] = useState({ visitors: 0, views: 0, orders: 0 });
  const [businessSlug, setBusinessSlug] = useState("");

  useEffect(() => {
    if (business) setBusinessSlug(business.username);
    if (cachedOrders) {
      const visitors = cachedOrders.filter(o => o.status === 'store_view').length;
      const views = cachedOrders.filter(o => o.status === 'product_view').length;
      const realOrders = cachedOrders.filter(o => !['store_view', 'product_view', 'review', 'platform_review'].includes(o.status)).length;
      setStats({ visitors, views, orders: realOrders });
    }
  }, [business, cachedOrders]);

  if (loading) return <div className="p-4 text-slate-400 font-medium">Loading analytics...</div>;

  return (
    <div className="space-y-6 pb-20">
      <h2 className="text-2xl font-extrabold text-[#0F172A]">Store Performance</h2>
      
      <div className="space-y-4">
        {/* Visitors */}
        <Card className="bg-white border-slate-100 shadow-sm rounded-2xl p-6 border flex items-center justify-between">
          <div>
            <div className="text-sm font-bold text-slate-500 mb-2">Total Store Visitors</div>
            <div className="text-2xl font-extrabold text-[#0F172A]">{stats.visitors.toLocaleString()}</div>
          </div>
          <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </Card>

        {/* Views */}
        <Card className="bg-white border-slate-100 shadow-sm rounded-2xl p-6 border flex items-center justify-between">
          <div>
            <div className="text-sm font-bold text-slate-500 mb-2">Product Views</div>
            <div className="text-2xl font-extrabold text-[#0F172A]">{stats.views.toLocaleString()}</div>
          </div>
          <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
            <Eye className="w-6 h-6" />
          </div>
        </Card>

        {/* Orders */}
        <Card className="bg-white border-slate-100 shadow-sm rounded-2xl p-6 border flex items-center justify-between">
          <div>
            <div className="text-sm font-bold text-slate-500 mb-2">Orders Received</div>
            <div className="text-2xl font-extrabold text-green-600">{stats.orders}</div>
          </div>
          <div className="w-12 h-12 rounded-full bg-green-50 text-green-600 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
        </Card>

        {/* Conversion */}
        <Card className="bg-white border-slate-100 shadow-sm rounded-2xl p-6 border flex items-center justify-between">
          <div>
            <div className="text-sm font-bold text-slate-500 mb-2">Conversion Rate</div>
            <div className="text-2xl font-extrabold text-[#0F172A]">{stats.visitors === 0 ? '0%' : \`\${((stats.orders / stats.visitors) * 100).toFixed(1)}%\`}</div>
          </div>
          <div className="w-12 h-12 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center">
            <Percent className="w-6 h-6" />
          </div>
        </Card>
      </div>`;

code = code.replace(/const \[stats, setStats\] = useState\(\{ total: 0 \}\);[\s\S]*?<\/div>\s*<\/Card>\s*<\/div>/, replacement);
fs.writeFileSync('src/app/dashboard/analytics/page.tsx', code);
