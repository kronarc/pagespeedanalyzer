'use client';

import Link from 'next/link';
import { Zap } from 'lucide-react';

export function DashboardHeader() {
  return (
    <header className="bg-card border-b border-border sticky top-0 z-40 shadow-sm">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-primary flex items-center gap-2">
          <Zap className="w-6 h-6" />
          PageSpeedAnalyzer
        </Link>
        <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
          Stateless Version
        </div>
      </nav>
    </header>
  );
}
