import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Circle } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default async function OrderTrackingPage({ params }: { params: { token: string } }) {
  const { data: order } = await supabase
    .from('orders')
    .select(`
      *,
      products ( name ),
      businesses ( business_name )
    `)
    .eq('tracking_token', params.token)
    .single();

  if (!order) {
    notFound();
  }

  const statusMap: Record<string, number> = {
    'new': 0,
    'accepted': 1,
    'in_progress': 2,
    'completed': 3
  };
  
  const currentStatusIndex = statusMap[order.status] || 0;

  const steps = [
    { id: "new", label: "Request Submitted", done: currentStatusIndex >= 0 },
    { id: "accepted", label: "Accepted", done: currentStatusIndex >= 1 },
    { id: "in_progress", label: "In Progress", done: currentStatusIndex >= 2 },
    { id: "completed", label: "Completed", done: currentStatusIndex >= 3 },
  ];

  return (
    <div className="min-h-screen bg-zyp-lightSurface text-zyp-bg py-12 px-4">
      <div className="max-w-xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <img src="/logo.jpg" alt="Zypcart" className="h-10 mx-auto mb-4" />
          <h1 className="font-display text-3xl font-bold text-center">Order Tracking</h1>
        </div>

        <Card className="bg-white border-black/5">
          <CardHeader>
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-sm text-black/60">Token #{params.token.substring(0, 8)}</span>
              <span className="text-sm text-black/60">{new Date(order.created_at).toLocaleDateString()}</span>
            </div>
            <CardTitle className="text-xl">{order.products?.name}</CardTitle>
            <p className="text-sm text-black/60">from {order.businesses?.business_name}</p>
          </CardHeader>
          <CardContent className="space-y-8 pt-4">
            
            {/* Timeline */}
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-[15px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-black/10 before:to-transparent">
              {steps.map((step, idx) => (
                <div key={step.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full border-4 border-white bg-zyp-lightSurface text-black/20 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10">
                    {step.done ? (
                      <CheckCircle2 className="w-5 h-5 text-zyp-success" />
                    ) : (
                      <Circle className="w-4 h-4" />
                    )}
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl bg-black/5 border border-black/5 shadow-sm">
                    <h3 className={`font-semibold ${step.done ? 'text-black' : 'text-black/40'}`}>{step.label}</h3>
                  </div>
                </div>
              ))}
            </div>

            {order.seller_message && (
              <div className="bg-zyp-accent/10 p-4 rounded-xl border border-zyp-accent/20">
                <p className="text-sm font-semibold mb-1 text-black">Message from seller:</p>
                <p className="text-sm text-black/80">"{order.seller_message}"</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
