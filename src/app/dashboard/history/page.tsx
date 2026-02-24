'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { toast } from 'sonner';
import { Search, Loader2 } from 'lucide-react';

interface Analysis {
  id: string;
  url: string;
  deviceType: string;
  performanceScore: number;
  createdAt: string;
}

export default function HistoryPage() {
  const { data: session } = useSession();
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [filteredAnalyses, setFilteredAnalyses] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch('/api/history');
        const data = await response.json();

        if (!response.ok) {
          toast.error('Failed to load history');
          return;
        }

        setAnalyses(data.analyses);
        setFilteredAnalyses(data.analyses);
      } catch (error) {
        toast.error('Something went wrong');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  useEffect(() => {
    const filtered = analyses.filter((analysis) =>
      analysis.url.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredAnalyses(filtered);
  }, [searchQuery, analyses]);

  const getScoreColor = (score: number | null) => {
    if (score === null || score === undefined) return 'text-muted-foreground';
    if (score >= 90) return 'text-[#0cce6b]';
    if (score >= 50) return 'text-[#ffa400]';
    return 'text-[#ff4e42]';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-foreground">History</h1>
        <p className="text-muted-foreground mt-2">
          View and search all your past analyses
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search by URL..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 h-11"
        />
      </div>

      {/* Content */}
      {loading ? (
        <Card className="p-12 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary mb-4" />
          <p className="text-muted-foreground">Loading your history...</p>
        </Card>
      ) : filteredAnalyses.length > 0 ? (
        <div className="space-y-2">
          <div className="text-sm text-muted-foreground mb-4">
            Found {filteredAnalyses.length} {filteredAnalyses.length === 1 ? 'analysis' : 'analyses'}
          </div>
          {filteredAnalyses.map((analysis) => (
            <Card
              key={analysis.id}
              className="p-4 hover:shadow-lg hover:border-primary/20 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-foreground truncate text-sm group-hover:text-primary transition-colors">
                    {analysis.url}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    {analysis.deviceType.charAt(0).toUpperCase() + analysis.deviceType.slice(1)} • {new Date(analysis.createdAt).toLocaleDateString()} at {new Date(analysis.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <div className="flex items-center gap-4 flex-shrink-0">
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${getScoreColor(analysis.performanceScore)}`}>
                      {analysis.performanceScore ?? '—'}
                    </div>
                    <p className="text-xs text-muted-foreground font-medium">
                      Performance
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center">
          {searchQuery ? (
            <>
              <p className="text-muted-foreground mb-4">
                No analyses found matching "{searchQuery}"
              </p>
              <Button
                variant="outline"
                onClick={() => setSearchQuery('')}
              >
                Clear Search
              </Button>
            </>
          ) : (
            <>
              <p className="text-muted-foreground mb-4">
                No analyses yet. Start by analyzing a website!
              </p>
              <Link href="/dashboard/analyze">
                <Button>Analyze a Website</Button>
              </Link>
            </>
          )}
        </Card>
      )}
    </div>
  );
}
