const fs = require('fs');

let code = fs.readFileSync('src/app/dashboard/layout.tsx', 'utf8');

// Insert a business setup check
const checkCode = `
  const { user, business, loading } = useDashboardData();
  const [setupMode, setSetupMode] = useState(false);
  const [newStoreName, setNewStoreName] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [setupLoading, setSetupLoading] = useState(false);
  
  useEffect(() => {
    if (!loading && user && !business) {
      setSetupMode(true);
    }
  }, [user, business, loading]);

  const handleSetupStore = async (e: React.FormEvent) => {
    e.preventDefault();
    setSetupLoading(true);
    try {
      const { error } = await supabase.from('businesses').insert([{
        user_id: user.id,
        business_name: newStoreName,
        username: newUsername.toLowerCase().replace(/[^a-z0-9-]/g, '')
      }]);
      if (error) throw error;
      window.location.reload();
    } catch(err) {
      alert("Error: Username might be taken. Please try another.");
    } finally {
      setSetupLoading(false);
    }
  };

  if (setupMode) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans text-slate-800">
        <div className="bg-white p-8 rounded-[32px] shadow-xl w-full max-w-md border border-slate-100">
          <h2 className="text-2xl font-extrabold mb-2 text-center text-[#111111]">Complete Your Store</h2>
          <p className="text-slate-500 mb-8 text-center text-sm font-medium">Almost there! We just need a name for your store.</p>
          <form onSubmit={handleSetupStore} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-500 mb-1 block ml-1">Store Name</label>
              <input required value={newStoreName} onChange={e => setNewStoreName(e.target.value)} className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 focus:outline-none focus:border-[#111111]" placeholder="My Bakery" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 mb-1 block ml-1">Store URL (zoopcart.com/...)</label>
              <input required value={newUsername} onChange={e => setNewUsername(e.target.value)} className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 focus:outline-none focus:border-[#111111]" placeholder="my-bakery" />
            </div>
            <button type="submit" disabled={setupLoading} className="w-full h-12 bg-[#111111] hover:bg-black text-white rounded-xl font-bold mt-4 transition-colors">
              {setupLoading ? "Creating..." : "Launch Store"}
            </button>
          </form>
        </div>
      </div>
    );
  }
`;

code = code.replace(/const \{ user, business, loading \} = useDashboardData\(\);/, checkCode);

fs.writeFileSync('src/app/dashboard/layout.tsx', code);
console.log("Added missing store setup prompt for OAuth users");
