# Page Speed Analyzer

A full-stack Next.js application for analyzing website performance using the Google PageSpeed Insights API. Features unlimited analyses for all users, full history tracking, and detailed reports.

## Tech Stack

- **Framework**: Next.js 15+ (App Router, TypeScript)
- **Database**: PostgreSQL + Prisma ORM
- **Authentication**: NextAuth.js v5 (Google + GitHub OAuth)
- **Speed Data**: Google PageSpeed Insights API v5
- **UI**: Tailwind CSS + shadcn/ui + Recharts
- **Deployment**: Vercel

## Features

- **Unlimited Analyses**: No daily limits for authenticated users.
- **Core Web Vitals**: Track LCP, CLS, INP, FCP, and TTFB.
- **Lighthouse Scores**: Performance, Accessibility, Best Practices, and SEO.
- **Full History**: Keep track of all your past analyses.
- **Detailed Reports**: Comprehensive Lighthouse audits with recommendations.

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Google Cloud Project with PageSpeed Insights API enabled
- GitHub and Google OAuth applications

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

## Deployment to Vercel

1. Push to GitHub
2. Import repository to Vercel
3. Set all environment variables in Vercel dashboard
4. Deploy (Vercel runs: `prisma generate && prisma migrate deploy && next build`)

## Project Structure

```
src/
├── app/
│   ├── layout.tsx                   # Root layout with SessionProvider
│   ├── page.tsx                     # Landing page
│   ├── login/page.tsx               # OAuth login
│   ├── (dashboard)/
│   │   ├── layout.tsx               # Dashboard shell
│   │   ├── page.tsx                 # Main dashboard
│   │   ├── analyze/page.tsx         # Analyze page
│   │   ├── history/page.tsx         # History
│   │   └── settings/page.tsx        # Account settings
│   └── api/
│       ├── auth/[...nextauth]/route.ts      # OAuth handler
│       ├── analyze/route.ts                 # Analysis endpoint
│       ├── usage/route.ts                   # Usage tracking
│       ├── history/route.ts                 # History endpoint
│       └── cron/reset-usage/route.ts        # Daily reset
├── components/
│   ├── ui/                          # shadcn/ui components
│   └── analyze/                     # Analysis components
├── lib/
│   ├── auth.ts                      # NextAuth configuration
│   ├── prisma.ts                    # Prisma client singleton
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

Key required variables:

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

# App
NEXT_PUBLIC_APP_URL=...
CRON_SECRET=...
```

## Key Implementation Details

### Authentication
- NextAuth.js v5 with Google and GitHub OAuth
- Middleware protects dashboard routes

### Analysis Workflow
1. User enters URL and device type
2. Google PageSpeed Insights API is called
3. Results stored with all Core Web Vitals metrics
4. Full Lighthouse JSON reports saved for all analyses

### Usage Tracking
- Database-backed for reporting
- Per-user for authenticated users
- Per-IP for anonymous users

## Testing Checklist

- [ ] Local dev runs: `npm run dev`
- [ ] Auth works (Google/GitHub OAuth)
- [ ] Unlimited analyses work
- [ ] History page shows all past analyses
- [ ] Deployment to Vercel succeeds
- [ ] Production auth works

## Notes

- **INP not FID**: Uses Interaction to Next Paint (FID was retired in March 2024)
- **Prisma**: Uses pooled connection for runtime, direct for migrations

## License

MIT
