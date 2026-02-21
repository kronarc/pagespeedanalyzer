'use client';

import { useSession } from 'next-auth/react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import Link from 'next/link';

export default function PricingPage() {
  const { data: session } = useSession();
  const subscriptionStatus = (session?.user as any)?.subscriptionStatus || 'free';

  const handleCheckout = async () => {
    if (!session) {
      // Redirect to login
      window.location.href = '/login';
      return;
    }

    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
      });

      if (!response.ok) {
        toast.error('Failed to start checkout');
        return;
      }

      const { sessionId } = await response.json();

      // Redirect to Stripe Checkout using the standard checkout URL
      window.location.href = `https://checkout.stripe.com/pay/${sessionId}`;
    } catch (error) {
      toast.error('Something went wrong');
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900 dark:to-black">
      {/* Header */}
      <header className="border-b border-zinc-200 dark:border-zinc-800">
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-zinc-900 dark:text-white">
            PageSpeedAnalyzer
          </Link>
          <div className="flex gap-4">
            {session ? (
              <>
                <Link href="/dashboard">
                  <Button variant="outline">Dashboard</Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="outline">Sign In</Button>
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold tracking-tight text-zinc-900 dark:text-white mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-zinc-600 dark:text-zinc-400">
            Choose the perfect plan for your needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Plan */}
          <Card className="p-8 relative">
            {subscriptionStatus === 'free' && (
              <Badge className="absolute top-6 right-6" variant="outline">
                Current Plan
              </Badge>
            )}
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
                Free
              </h3>
              <div className="text-3xl font-bold text-zinc-900 dark:text-white">
                $0
              </div>
              <p className="text-zinc-600 dark:text-zinc-400 text-sm mt-1">
                Perfect for getting started
              </p>
            </div>

            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3">
                <span className="text-green-600 dark:text-green-400">✓</span>
                <span className="text-zinc-700 dark:text-zinc-300">
                  5 analyses per day
                </span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-green-600 dark:text-green-400">✓</span>
                <span className="text-zinc-700 dark:text-zinc-300">
                  Core Web Vitals tracking
                </span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-green-600 dark:text-green-400">✓</span>
                <span className="text-zinc-700 dark:text-zinc-300">
                  Lighthouse scores
                </span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-zinc-400 dark:text-zinc-600">✗</span>
                <span className="text-zinc-500 dark:text-zinc-500">
                  Performance history
                </span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-zinc-400 dark:text-zinc-600">✗</span>
                <span className="text-zinc-500 dark:text-zinc-500">
                  Detailed reports
                </span>
              </li>
            </ul>

            {subscriptionStatus === 'free' ? (
              <Button disabled className="w-full">
                Current Plan
              </Button>
            ) : (
              <Link href="/dashboard">
                <Button variant="outline" className="w-full">
                  Go to Dashboard
                </Button>
              </Link>
            )}
          </Card>

          {/* Pro Plan */}
          <Card className="p-8 relative border-blue-600 dark:border-blue-400 border-2">
            {subscriptionStatus === 'active' && (
              <Badge className="absolute top-6 right-6">
                Current Plan
              </Badge>
            )}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <Badge>Recommended</Badge>
            </div>
            <div className="mb-6 mt-4">
              <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
                Pro
              </h3>
              <div className="text-3xl font-bold text-zinc-900 dark:text-white">
                $9
              </div>
              <p className="text-zinc-600 dark:text-zinc-400 text-sm mt-1">
                Per month, billed monthly
              </p>
            </div>

            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3">
                <span className="text-green-600 dark:text-green-400">✓</span>
                <span className="text-zinc-700 dark:text-zinc-300 font-medium">
                  Unlimited analyses
                </span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-green-600 dark:text-green-400">✓</span>
                <span className="text-zinc-700 dark:text-zinc-300">
                  Core Web Vitals tracking
                </span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-green-600 dark:text-green-400">✓</span>
                <span className="text-zinc-700 dark:text-zinc-300">
                  Lighthouse scores
                </span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-green-600 dark:text-green-400">✓</span>
                <span className="text-zinc-700 dark:text-zinc-300 font-medium">
                  Full performance history
                </span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-green-600 dark:text-green-400">✓</span>
                <span className="text-zinc-700 dark:text-zinc-300 font-medium">
                  Detailed reports & exports
                </span>
              </li>
            </ul>

            {subscriptionStatus === 'active' ? (
              <Button disabled className="w-full bg-blue-600 dark:bg-blue-500">
                Current Plan
              </Button>
            ) : (
              <Button
                onClick={handleCheckout}
                className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
              >
                Upgrade to Pro
              </Button>
            )}
          </Card>
        </div>

        {/* FAQs */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <Card className="p-6">
              <h4 className="font-semibold text-zinc-900 dark:text-white mb-2">
                Can I change my plan anytime?
              </h4>
              <p className="text-zinc-600 dark:text-zinc-400">
                Yes! You can upgrade or downgrade your plan at any time. Changes take effect on your next billing cycle.
              </p>
            </Card>
            <Card className="p-6">
              <h4 className="font-semibold text-zinc-900 dark:text-white mb-2">
                What payment methods do you accept?
              </h4>
              <p className="text-zinc-600 dark:text-zinc-400">
                We accept all major credit cards through Stripe. Your payment information is secure and never stored on our servers.
              </p>
            </Card>
            <Card className="p-6">
              <h4 className="font-semibold text-zinc-900 dark:text-white mb-2">
                Is there a free trial for Pro?
              </h4>
              <p className="text-zinc-600 dark:text-zinc-400">
                Start with the Free plan to test our service. Upgrade to Pro whenever you're ready!
              </p>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
