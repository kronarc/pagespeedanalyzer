import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { signOut } from '@/lib/auth';
import { Home, Search, BarChart3, Settings, Zap, GitCompare, Lightbulb } from 'lucide-react';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/dashboard/analyze', label: 'Analyze', icon: Search },
    { href: '/dashboard/compare', label: 'Compare', icon: GitCompare },
    { href: '/dashboard/optimize', label: 'Optimization Tips', icon: Lightbulb },
    { href: '/dashboard/history', label: 'History', icon: BarChart3 },
    { href: '/dashboard/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-40 shadow-sm">
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-primary flex items-center gap-2">
            <Zap className="w-6 h-6" />
            PageSpeedAnalyzer
          </Link>
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">
              {session.user?.email}
            </div>
            <div className="w-px h-6 bg-border" />
            <form
              action={async () => {
                'use server';
                await signOut({ redirectTo: '/' });
              }}
            >
              <Button type="submit" variant="ghost" size="sm">
                Sign Out
              </Button>
            </form>
          </div>
        </nav>
      </header>

      {/* Sidebar + Content */}
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-card border-r border-border min-h-[calc(100vh-64px)] flex flex-col">
          <div className="flex-1 p-6 space-y-6 overflow-y-auto">
            {/* Navigation */}
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all text-muted-foreground hover:text-foreground hover:bg-muted group relative"
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Divider */}
            <div className="h-px bg-border" />

            <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg p-4 border border-primary/20">
              <p className="text-xs text-muted-foreground flex items-center gap-2">
                <span className="text-primary">✨</span> Free Version
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-border text-center">
            <p className="text-xs text-muted-foreground">
              Version 1.0.0
            </p>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-auto">
          <div className="p-6 sm:p-8 max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
