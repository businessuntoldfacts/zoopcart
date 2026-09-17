"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Eye, TrendingUp, BrainCircuit } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-white">Store Performance</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-zyp-textMuted">Total Store Visitors</CardTitle>
            <Users className="w-4 h-4 text-white" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-display text-white">0</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-zyp-textMuted">Product Views</CardTitle>
            <Eye className="w-4 h-4 text-zyp-accentSecondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-display text-white">0</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-zyp-textMuted">Orders Received</CardTitle>
            <TrendingUp className="w-4 h-4 text-zyp-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-display text-white">0</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-zyp-textMuted">Conversion Rate</CardTitle>
            <TrendingUp className="w-4 h-4 text-zyp-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-display text-white">0%</div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-zyp-accent/20 bg-gradient-to-br from-zyp-surface to-zyp-surface/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <BrainCircuit className="w-5 h-5 text-zyp-accent" />
            AI Store Insight
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-zyp-textPrimary leading-relaxed">
            Not enough data yet. Share your store link and get some visitors to receive actionable insights on how to improve your conversion rate.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
