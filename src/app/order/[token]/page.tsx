import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import { Package, CheckCircle2, Clock, MapPin, Phone, RefreshCw } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function OrderTrackingPage({ params }: { params: { token: string } }) {
  const { data: order } = await supabase
    .from('orders')
    .select('*, businesses(*), products(*)')
    .eq('tracking_token', params.token)
    .single();

  if (!order) notFound();
  
  const statusOrder = ['pending', 'shipped', 'delivered'];
  // mapping custom older fields or handling standard order statuses perfectly
  const currentStatus = order.status === 'new' ? 'pending' : (order.status === 'completed' ? 'delivered' : order.status);
  const currentIndex = statusOrder.indexOf(currentStatus);

  return (
    <div className="min-h-screen bg-zyp-bg font-sans flex flex-col items-center">
      <header className="bg-white w-full h-14 flex items-center justify-between px-4 sticky top-0 z-50 border-b border-zyp-border max-w-lg shadow-sm">
        <Link href={`/${order.businesses.username}`} className="text-sm font-bold text-[#0F172A]">
          ← Back to Store
        </Link>
        <div className="text-xs font-bold text-slate-400 bg-slate-50 px-3 py-1.5 rounded-full uppercase tracking-wider">
          ORD-{order.tracking_token}
        </div>
      </header>

      <main className="flex-1 w-full max-w-lg p-4 space-y-6 pt-6 pb-20">
        
        {/* Status Header */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-zyp-border text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-blue-100">
            <Package className="w-8 h-8 text-[#111111]" />
          </div>
          <h1 className="text-2xl font-extrabold text-[#0F172A] mb-1">
            {currentStatus === 'pending' ? 'Order Pending' :
             currentStatus === 'shipped' ? 'Order Shipped' :
             'Order Delivered!'}
          </h1>
          <p className="text-sm font-medium text-slate-500">
            From <Link href={`/${order.businesses.username}`} className="font-bold text-[#111111] hover:underline">{order.businesses.business_name}</Link>
          </p>

          <div className="mt-6 flex items-center justify-center gap-2 border-t border-slate-100 pt-6">
            <div className="w-12 h-12 bg-slate-100 rounded-xl overflow-hidden shadow-sm shrink-0">
               {order.products.image && <img src={order.products.image} className="w-full h-full object-cover" />}
            </div>
            <div className="text-left">
              <div className="font-extrabold text-[#0F172A] text-sm">{order.products.name}</div>
              <div className="text-xs font-bold text-[#111111] mt-0.5">₹{order.products.price}</div>
            </div>
          </div>
        </div>

        {/* Message from Seller (Mock) */}
        {currentStatus === 'delivered' && (
          <div className="bg-green-50 p-4 rounded-2xl rounded-tl-none border border-green-200 relative ml-4 shadow-sm">
            <div className="absolute -left-3 -top-3 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-xs border-2 border-white shadow-sm font-bold">
              {order.businesses.business_name.charAt(0)}
            </div>
            <p className="text-sm font-medium text-green-900 leading-relaxed ml-2">
              "Hi {order.customer_name.split(' ')[0]}, your order has been delivered! Thank you for shopping with us. 🥰"
            </p>
          </div>
        )}

        {/* Tracking info if available */}
        {(order.carrier_name || order.tracking_number) && (
          <div className="bg-blue-50 p-5 rounded-3xl border border-blue-100 shadow-sm space-y-2">
            <h4 className="text-xs font-bold text-blue-500 uppercase tracking-wider">Shipment Reference</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {order.carrier_name && (
                <div>
                  <span className="text-slate-400 font-medium text-xs block">Carrier</span>
                  <span className="font-extrabold text-[#0F172A]">{order.carrier_name}</span>
                </div>
              )}
              {order.tracking_number && (
                <div>
                  <span className="text-slate-400 font-medium text-xs block">Tracking ID</span>
                  <span className="font-extrabold text-[#0F172A] font-mono">{order.tracking_number}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Timeline */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-zyp-border">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">Order Status Timeline</h2>
          
          <div className="relative pl-6 space-y-8">
            {/* Connecting Line */}
            <div className="absolute left-3 top-2 bottom-4 w-0.5 bg-slate-100">
               <div className="w-full bg-[#111111] transition-all duration-1000" style={{height: `${(currentIndex / 2) * 100}%`}}></div>
            </div>

            {[
              { id: 'pending', title: 'Order Pending', desc: 'Sent to seller for review and approval', icon: CheckCircle2 },
              { id: 'shipped', title: 'Order Shipped', desc: 'Package is handed over to the courier partner', icon: RefreshCw },
              { id: 'delivered', title: 'Order Delivered', desc: 'Package delivered successfully to your address', icon: Package },
            ].map((step, index) => {
              const isCompleted = currentIndex > index;
              const isCurrent = currentIndex === index;
              const isPending = currentIndex < index;
              const Icon = step.icon;

              return (
                <div key={step.id} className={`relative ${isPending ? 'opacity-40' : ''}`}>
                  <div className={`absolute -left-10 w-8 h-8 rounded-full flex items-center justify-center border-4 border-white shadow-sm transition-colors ${
                    isCompleted ? 'bg-[#111111] text-white' : 
                    isCurrent ? 'bg-slate-200 text-[#111111] border-blue-50 ring-4 ring-blue-50' : 
                    'bg-slate-200 text-slate-400'
                  }`}>
                    {isCurrent && !isCompleted && step.id === 'shipped' ? (
                       <RefreshCw className="w-3 h-3 animate-spin" />
                    ) : (
                       <Icon className="w-3.5 h-3.5" />
                    )}
                  </div>
                  <div>
                    <h3 className={`font-extrabold text-sm ${isCurrent ? 'text-[#111111]' : 'text-[#0F172A]'}`}>{step.title}</h3>
                    <p className="text-xs font-medium text-slate-500 mt-0.5">{step.desc}</p>
                    {isCurrent && (
                      <div className="text-[10px] font-bold text-slate-400 mt-2 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Updated {new Date(order.updated_at || order.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Support Section */}
        <div className="bg-slate-50 rounded-3xl p-5 border border-slate-200 text-center">
          <p className="text-xs font-bold text-slate-500 mb-3 uppercase tracking-wider">Need Help?</p>
          <a href={`https://wa.me/${order.businesses.whatsapp_country_code}${order.businesses.whatsapp_number}?text=Hi, regarding my order ORD-${order.tracking_token}`} target="_blank">
            <Button variant="secondary" className="w-full h-12 bg-white rounded-xl shadow-sm border border-slate-200 font-bold text-[#0F172A] hover:bg-slate-100">
              <Phone className="w-4 h-4 mr-2 text-slate-400" /> Contact Seller Support
            </Button>
          </a>
        </div>
      </main>
    </div>
  );
}
