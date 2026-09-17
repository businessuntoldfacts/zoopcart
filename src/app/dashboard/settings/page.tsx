"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SettingsPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <h2 className="text-xl font-semibold text-white">Settings</h2>

      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>Update your email and password.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input type="email" placeholder="seller@example.com" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">New Password</label>
            <Input type="password" />
          </div>
          <Button>Save Changes</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Currency & Localization</CardTitle>
          <CardDescription>Set your store's default currency.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Currency</label>
            <select className="flex h-12 w-full rounded-[16px] border border-white/10 bg-zyp-surface px-4 py-2 text-sm text-zyp-textPrimary focus:outline-none focus:ring-2 focus:ring-zyp-accent">
              <option value="INR">INR ₹</option>
              <option value="USD">USD $</option>
              <option value="GBP">GBP £</option>
              <option value="EUR">EUR €</option>
            </select>
          </div>
          <Button>Update Settings</Button>
        </CardContent>
      </Card>

      <Card className="border-zyp-danger/20">
        <CardHeader>
          <CardTitle className="text-zyp-danger">Danger Zone</CardTitle>
          <CardDescription>Permanently delete your account and all data.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="danger">Delete Account</Button>
        </CardContent>
      </Card>
    </div>
  );
}
