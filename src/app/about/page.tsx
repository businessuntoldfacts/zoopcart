
import HeaderMenu from "@/components/HeaderMenu";

export const metadata = {
  title: "About Us | Zoopcart",
};

export default function Page() {
  return (
    <main className="min-h-screen bg-slate-50 flex flex-col pt-24">
      <HeaderMenu />
      <div className="flex-1 container mx-auto px-6 max-w-4xl py-12">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-8">About Us</h1>
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100 prose prose-slate max-w-none">
          <p className="text-lg text-slate-600 mb-4">Zoopcart is the easiest way to turn your social media followers into paying customers. We empower creators and small businesses to launch their own digital storefronts in minutes, entirely for free.</p>
        </div>
      </div>
    </main>
  );
}
