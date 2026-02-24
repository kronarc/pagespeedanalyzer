# Page Speed Analyzer (Stateless)

A full-stack Next.js application for analyzing website performance using the Google PageSpeed Insights API. This version is **100% stateless**—it requires no database, no authentication, and no account.

## Tech Stack

- **Framework**: Next.js 15+ (App Router, TypeScript)
- **Speed Data**: Google PageSpeed Insights API v5
- **UI**: Tailwind CSS + shadcn/ui + Recharts
- **Deployment**: Vercel

## Features

- **Unlimited Analyses**: Instant performance audits for any URL.
- **Core Web Vitals**: Track LCP, CLS, INP, FCP, and TTFB.
- **Lighthouse Scores**: Performance, Accessibility, Best Practices, and SEO.
- **Side-by-Side Comparison**: Compare two websites instantly.
- **Optimization Tips**: Actionable advice to improve your scores.
- **Privacy First**: No data is saved. No cookies, no trackers, no database.

## Getting Started

### Prerequisites
- Node.js 18+
- Google Cloud Project with PageSpeed Insights API enabled

### Local Development

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
Create a `.env.local` file:
```env
GOOGLE_PSI_API_KEY=your_api_key_here
```

3. Start development server:
```bash
npm run dev
```

4. Open http://localhost:3000

## Deployment to Vercel

1. Push to GitHub
2. Import repository to Vercel
3. Set `GOOGLE_PSI_API_KEY` in Vercel dashboard
4. Deploy

## Key Implementation Details

### Analysis Workflow
1. User enters URL and device type
2. API route calls Google PageSpeed Insights API
3. Results are returned directly to the client
4. No data is stored or logged

## License

MIT
