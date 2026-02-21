'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function SettingsPage() {
  const { data: session } = useSession();
  const subscriptionStatus = (session?.user as any)?.subscriptionStatus || 'free';

  const handleManageSubscription = async () => {
    try {
      const response = await fetch('/api/stripe/portal', {
        method: 'POST',
      });

      if (!response.ok) {
        toast.error('Failed to access billing portal');
        return;
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      toast.error('Something went wrong');
      console.error(error);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your account and subscription
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

      {/* Subscription */}
      <Card className={`p-6 border-primary/20 ${subscriptionStatus === 'active' ? 'bg-primary/5' : ''}`}>
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              Subscription Plan
            </h2>
          </div>
          {subscriptionStatus === 'active' && (
            <span className="bg-primary text-primary-foreground px-3 py-1 rounded-lg text-sm font-semibold">
              ⭐ Pro
            </span>
          )}
        </div>

        <div className="space-y-6">
          <div>
            <label className="text-sm font-medium text-muted-foreground block mb-2">
              Current Plan
            </label>
            <p className="text-lg font-bold text-foreground capitalize">
              {subscriptionStatus === 'active' ? 'Pro Membership' : 'Free Plan'}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {subscriptionStatus === 'active'
                ? 'Unlimited analyses • Full history • Priority support'
                : 'Limited to 5 analyses per day'}
            </p>
          </div>

          <div className="h-px bg-border" />

          <div>
            <label className="text-sm font-medium text-muted-foreground block mb-2">
              Status
            </label>
            <p className="text-lg text-foreground font-medium capitalize">
              {subscriptionStatus === 'active' ? '✅ Active' : '○ Free Tier'}
            </p>
          </div>

          {subscriptionStatus === 'active' && (
            <div className="pt-4 border-t border-border">
              <Button
                onClick={handleManageSubscription}
                variant="outline"
                className="w-full sm:w-auto"
              >
                Manage Subscription
              </Button>
            </div>
          )}

          {subscriptionStatus !== 'active' && (
            <div className="pt-4 border-t border-border">
              <Link href="/pricing">
                <Button className="w-full sm:w-auto">
                  Upgrade to Pro
                </Button>
              </Link>
            </div>
          )}
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
