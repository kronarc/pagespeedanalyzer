'use client';

import { useSession } from 'next-auth/react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function SettingsPage() {
  const { data: session } = useSession();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your account settings
        </p>
      </div>

      {/* Account Information */}
      <Card className="p-6">
        <h2 className="text-2xl font-bold text-foreground mb-6">
          Account Information
        </h2>
        <div className="space-y-6">
          <div>
            <label className="text-sm font-medium text-muted-foreground block mb-2">
              Email Address
            </label>
            <p className="text-lg text-foreground font-medium">
              {session?.user?.email}
            </p>
          </div>
          <div className="h-px bg-border" />
          <div>
            <label className="text-sm font-medium text-muted-foreground block mb-2">
              Display Name
            </label>
            <p className="text-lg text-foreground font-medium">
              {session?.user?.name || '—'}
            </p>
          </div>
        </div>
      </Card>

      {/* Danger Zone */}
      <Card className="p-6 border-destructive/20 bg-destructive/5">
        <h2 className="text-2xl font-bold text-destructive mb-4">
          ⚠️ Danger Zone
        </h2>
        <p className="text-muted-foreground mb-6">
          These actions are permanent and cannot be undone.
        </p>
        <Button variant="destructive" disabled className="opacity-50 cursor-not-allowed">
          Delete Account
        </Button>
        <p className="text-xs text-muted-foreground mt-3">
          Account deletion is disabled for safety. Contact support if you need help.
        </p>
      </Card>
    </div>
  );
}
