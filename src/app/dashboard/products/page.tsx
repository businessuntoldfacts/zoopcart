"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, PackageSearch } from "lucide-react";

export default function ProductsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Your Products</h2>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      <Card>
        <CardContent className="pt-12 pb-12 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
            <PackageSearch className="w-8 h-8 text-zyp-textMuted" />
          </div>
          <h3 className="text-lg font-medium text-white mb-2">You haven't added any products yet</h3>
          <p className="text-zyp-textMuted max-w-sm mb-6 text-sm">
            Add your first product to start receiving orders.
          </p>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
