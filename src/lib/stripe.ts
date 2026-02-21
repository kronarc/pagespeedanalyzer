import Stripe from 'stripe';

// Lazy initialize Stripe - prevents errors during build when API key is missing
let stripeInstance: any = null;

function getStripeInstance() {
  if (stripeInstance) {
    return stripeInstance;
  }

  stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy', {
    apiVersion: '2026-01-28.clover' as any,
  });

  return stripeInstance;
}

// Create a proxy that lazy-initializes Stripe
export const stripe = new Proxy({} as any, {
  get(target, prop) {
    const instance = getStripeInstance();
    return Reflect.get(instance, prop);
  },
});
