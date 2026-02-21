# Page Speed Analyzer

A full-stack Next.js application for analyzing website performance using the Google PageSpeed Insights API. Features a free tier with 5 analyses per day, and a pro subscription for unlimited analyses and full history tracking.

## Tech Stack

- **Framework**: Next.js 14+ (App Router, TypeScript)
- **Database**: Vercel Postgres + Prisma ORM
- **Authentication**: NextAuth.js v5 (Google + GitHub OAuth)
- **Payments**: Stripe (subscription)
- **Speed Data**: Google PageSpeed Insights API v5
- **UI**: Tailwind CSS + shadcn/ui + Recharts
- **Deployment**: Vercel

## Features

### Free Tier
- 5 analyses per day
- Core Web Vitals (LCP, CLS, INP, FCP, TTFB)
- Lighthouse scores (Performance, Accessibility, Best Practices, SEO)
- Real-time analysis results

### Pro Tier ($9/month)
- Unlimited analyses
- Full analysis history with pagination
- Detailed Lighthouse reports
- Performance tracking over time
- Stripe subscription management

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database (Vercel Postgres recommended)
- Google Cloud Project with PageSpeed Insights API enabled
- GitHub and Google OAuth applications
- Stripe account

### Local Development

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env.local
```

Fill in all required values in `.env.local`

3. Initialize database:
```bash
npx prisma migrate dev
```

4. Start development server:
```bash
npm run dev
```

5. Open http://localhost:3000

### Local Stripe Testing

In another terminal:
```bash
stripe listen --forward-to localhost:3000/api/stripe/webhooks
```

Use test card `4242 4242 4242 4242` for checkout testing.

## Deployment to Vercel

1. Push to GitHub
2. Import repository to Vercel
3. Set all environment variables in Vercel dashboard
4. Deploy (Vercel runs: `prisma generate && prisma migrate deploy && next build`)
5. Configure Stripe webhook endpoint in Stripe Dashboard

## Project Structure

```
src/
├── app/
│   ├── layout.tsx                   # Root layout with SessionProvider
│   ├── page.tsx                     # Landing page
│   ├── login/page.tsx               # OAuth login
│   ├── pricing/page.tsx             # Pricing page
│   ├── (dashboard)/
│   │   ├── layout.tsx               # Dashboard shell
│   │   ├── page.tsx                 # Main dashboard
│   │   ├── analyze/page.tsx         # Analyze page
│   │   ├── history/page.tsx         # History (paid only)
│   │   └── settings/page.tsx        # Account settings
│   └── api/
│       ├── auth/[...nextauth]/route.ts      # OAuth handler
│       ├── analyze/route.ts                 # Analysis endpoint
│       ├── usage/route.ts                   # Usage tracking
│       ├── history/route.ts                 # History endpoint
│       ├── stripe/checkout/route.ts         # Checkout session
│       ├── stripe/portal/route.ts           # Billing portal
│       ├── stripe/webhooks/route.ts         # Webhook handler
│       └── cron/reset-usage/route.ts        # Daily reset
├── components/
│   ├── ui/                          # shadcn/ui components
│   └── analyze/                     # Analysis components
├── lib/
│   ├── auth.ts                      # NextAuth configuration
│   ├── prisma.ts                    # Prisma client singleton
│   ├── stripe.ts                    # Stripe client
│   ├── pagespeed.ts                 # PSI API wrapper
│   └── usage.ts                     # Usage tracking
├── constants/
│   └── metrics.ts                   # CWV thresholds and colors
├── types/
│   └── next-auth.d.ts               # NextAuth types
├── middleware.ts                    # Auth middleware
└── prisma/
    └── schema.prisma                # Database schema
```

## Environment Variables

See `.env.example` for all required variables. Key ones:

```env
# Database
POSTGRES_PRISMA_URL=...
POSTGRES_URL_NON_POOLING=...

# NextAuth
NEXTAUTH_URL=...
NEXTAUTH_SECRET=...

# OAuth
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GITHUB_ID=...
GITHUB_SECRET=...

# Google PSI
GOOGLE_PSI_API_KEY=...

# Stripe
STRIPE_SECRET_KEY=...
STRIPE_WEBHOOK_SECRET=...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=...
NEXT_PUBLIC_STRIPE_PRO_PRICE_ID=...

# App
NEXT_PUBLIC_APP_URL=...
CRON_SECRET=...
```

## Key Implementation Details

### Authentication
- NextAuth.js v5 with Google and GitHub OAuth
- User session includes `userId` and `subscriptionStatus`
- Middleware protects dashboard routes

### Analysis Workflow
1. User enters URL and device type
2. `/api/analyze` checks usage limits
3. Google PageSpeed Insights API is called
4. Results stored with all Core Web Vitals metrics
5. Results returned with remaining daily quota

### Usage Tracking
- Database-backed for reliability
- Per-user for authenticated users
- Per-IP for anonymous users
- Daily reset via Vercel cron job

### Subscription Management
- Stripe Checkout for new subscriptions
- Webhooks handle payment events
- Users gain unlimited analyses when subscriptionStatus = "active"

## Testing Checklist

- [ ] Local dev runs: `npm run dev`
- [ ] Auth works (Google/GitHub OAuth)
- [ ] Can run 5 free analyses
- [ ] 6th analysis returns 429 error
- [ ] Stripe checkout works
- [ ] Webhooks update subscription
- [ ] Paid users have unlimited analyses
- [ ] History page is paid-only
- [ ] Deployment to Vercel succeeds
- [ ] Production auth works

## Notes

- **INP not FID**: Uses Interaction to Next Paint (FID was retired in March 2024)
- **Stripe Testing**: Use test credentials with test cards
- **Webhook Signature**: Raw request body required for Stripe verification
- **Prisma**: Uses pooled connection for runtime, direct for migrations

## License

MIT
