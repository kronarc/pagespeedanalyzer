'use client';

import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Zap } from 'lucide-react';

interface DashboardHeaderProps {
  userEmail?: string | null;
}

export function DashboardHeader({ userEmail }: DashboardHeaderProps) {
  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  return (
    <header className="bg-card border-b border-border sticky top-0 z-40 shadow-sm">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-primary flex items-center gap-2">
          <Zap className="w-6 h-6" />
          PageSpeedAnalyzer
        </Link>
        <div className="flex items-center gap-4">
          {userEmail && (
            <div className="text-sm text-muted-foreground">
              {userEmail}
            </div>
          )}
          <div className="w-px h-6 bg-border" />
          <Button 
            onClick={handleSignOut} 
            variant="ghost" 
            size="sm"
          >
            Sign Out
          </Button>
        </div>
      </nav>
    </header>
  );
}
