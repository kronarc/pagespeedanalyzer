import Link from 'next/link';
import { DashboardHeader } from '@/components/DashboardHeader';
import { Search, Zap, GitCompare, Lightbulb } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navItems = [
    { href: '/dashboard/analyze', label: 'Analyze', icon: Search },
    { href: '/dashboard/compare', label: 'Compare', icon: GitCompare },
    { href: '/dashboard/optimize', label: 'Optimization Tips', icon: Lightbulb },
  ];

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

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
                <span className="text-primary">✨</span> Public Version
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-border text-center">
            <p className="text-xs text-muted-foreground">
              Version 1.1.0 (No DB)
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
