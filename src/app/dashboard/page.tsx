"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, ShoppingBag, CheckCircle2, Clock } from "lucide-react";

export default function DashboardOverview() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-zyp-textMuted">New Requests</CardTitle>
            <Package className="w-4 h-4 text-zyp-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-display text-white">0</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-zyp-textMuted">Accepted</CardTitle>
            <CheckCircle2 className="w-4 h-4 text-zyp-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-display text-white">0</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-zyp-textMuted">In Progress</CardTitle>
            <Clock className="w-4 h-4 text-zyp-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-display text-white">0</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-zyp-textMuted">Completed</CardTitle>
            <ShoppingBag className="w-4 h-4 text-white" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-display text-white">0</div>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-white mb-4">Recent Orders</h2>
        <Card>
          <div className="p-12 text-center flex flex-col items-center justify-center text-zyp-textMuted">
            <ShoppingBag className="w-12 h-12 mb-4 opacity-20" />
            <p className="text-lg font-medium text-white mb-1">No orders yet</p>
            <p className="text-sm">When customers place orders, they will appear here.</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
