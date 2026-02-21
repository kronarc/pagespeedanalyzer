import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.error('Webhook signature verification failed', error);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.subscription && session.customer) {
          const customerId = typeof session.customer === 'string'
            ? session.customer
            : session.customer.id;

          const user = await prisma.user.findUnique({
            where: { stripeCustomerId: customerId },
          });

          if (user) {
            await prisma.user.update({
              where: { id: user.id },
              data: {
                stripeSubscriptionId: session.subscription as string,
                subscriptionStatus: 'active',
              },
            });
          }
        }
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as any;
        if (invoice.subscription) {
          const user = await prisma.user.findUnique({
            where: { stripeSubscriptionId: invoice.subscription as string },
          });

          if (user) {
            await prisma.user.update({
              where: { id: user.id },
              data: { subscriptionStatus: 'active' },
            });
          }
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as any;
        if (invoice.subscription) {
          const user = await prisma.user.findUnique({
            where: { stripeSubscriptionId: invoice.subscription as string },
          });

          if (user) {
            await prisma.user.update({
              where: { id: user.id },
              data: { subscriptionStatus: 'past_due' },
            });
          }
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const user = await prisma.user.findUnique({
          where: { stripeSubscriptionId: subscription.id },
        });

        if (user) {
          await prisma.user.update({
            where: { id: user.id },
            data: {
              subscriptionStatus: 'canceled',
              stripeSubscriptionId: null,
            },
          });
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook processing error', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
