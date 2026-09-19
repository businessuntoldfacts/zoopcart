
import HeaderMenu from "@/components/HeaderMenu";

export const metadata = {
  title: "Privacy Policy | Zoopcart",
};

export default function Page() {
  return (
    <main className="min-h-screen bg-slate-50 flex flex-col pt-24">
      <HeaderMenu />
      <div className="flex-1 container mx-auto px-6 max-w-4xl py-12">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-8">Privacy Policy</h1>
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100 prose prose-slate max-w-none">
          <p className="text-lg text-slate-600 mb-4">Your privacy is important to us. This Privacy Policy outlines how Zoopcart collects, uses, and protects your personal information.</p>
        </div>
      </div>
    </main>
  );
}
