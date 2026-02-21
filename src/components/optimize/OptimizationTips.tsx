'use client';

import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search } from 'lucide-react';

interface Tip {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  impact: 'high' | 'medium' | 'low';
  implementation: string;
}

const OPTIMIZATION_TIPS: Tip[] = [
  {
    id: '1',
    title: 'Image Optimization',
    description: 'Compress and resize images for web to reduce file sizes without sacrificing quality.',
    difficulty: 'easy',
    category: 'Images',
    impact: 'high',
    implementation: 'Use modern formats like WebP, implement lazy loading, and serve responsive images.',
  },
  {
    id: '2',
    title: 'Lazy Loading',
    description: 'Load resources only when they are needed to improve initial page load time.',
    difficulty: 'easy',
    category: 'Performance',
    impact: 'high',
    implementation: 'Use loading="lazy" on images and dynamic imports for JavaScript code splitting.',
  },
  {
    id: '3',
    title: 'Minify CSS & JavaScript',
    description: 'Remove unnecessary characters from code to reduce file sizes.',
    difficulty: 'easy',
    category: 'Assets',
    impact: 'medium',
    implementation: 'Use build tools like webpack, esbuild, or PostCSS to automatically minify your code.',
  },
  {
    id: '4',
    title: 'Enable Gzip Compression',
    description: 'Compress server responses to reduce bandwidth and improve transfer speeds.',
    difficulty: 'easy',
    category: 'Server',
    impact: 'high',
    implementation: 'Enable gzip in your web server configuration (nginx, Apache, Vercel).',
  },
  {
    id: '5',
    title: 'Implement Caching Strategies',
    description: 'Cache static assets on the browser and server to avoid redundant requests.',
    difficulty: 'medium',
    category: 'Caching',
    impact: 'high',
    implementation: 'Set Cache-Control headers and use service workers for offline support.',
  },
  {
    id: '6',
    title: 'Use Content Delivery Network (CDN)',
    description: 'Distribute content globally to serve users from the nearest location.',
    difficulty: 'medium',
    category: 'Infrastructure',
    impact: 'high',
    implementation: 'Integrate Cloudflare, AWS CloudFront, or Vercel Edge Network.',
  },
  {
    id: '7',
    title: 'Remove Render-Blocking Resources',
    description: 'Defer CSS and JavaScript that block the rendering of above-the-fold content.',
    difficulty: 'medium',
    category: 'Performance',
    impact: 'high',
    implementation: 'Use async/defer on scripts, inline critical CSS, and preload important resources.',
  },
  {
    id: '8',
    title: 'Font Optimization',
    description: 'Optimize web fonts to reduce impact on First Contentful Paint.',
    difficulty: 'medium',
    category: 'Fonts',
    impact: 'medium',
    implementation: 'Use font-display: swap, subset fonts, and consider system fonts.',
  },
  {
    id: '9',
    title: 'Database Query Optimization',
    description: 'Write efficient queries and use indexing to reduce server response times.',
    difficulty: 'hard',
    category: 'Backend',
    impact: 'high',
    implementation: 'Profile queries, add proper indexes, use query caching, and implement pagination.',
  },
  {
    id: '10',
    title: 'Code Splitting & Tree Shaking',
    description: 'Split JavaScript bundles and remove unused code to reduce file sizes.',
    difficulty: 'hard',
    category: 'JavaScript',
    impact: 'medium',
    implementation: 'Use dynamic imports, configure webpack/esbuild properly, and leverage ES6 modules.',
  },
  {
    id: '11',
    title: 'Critical Rendering Path Optimization',
    description: 'Optimize the sequence of operations the browser performs to render the page.',
    difficulty: 'hard',
    category: 'Performance',
    impact: 'high',
    implementation: 'Minimize critical resources, reduce critical bytes, and shorten critical path length.',
  },
  {
    id: '12',
    title: 'Server-Side Rendering (SSR)',
    description: 'Render pages on the server to improve Time to First Byte and SEO.',
    difficulty: 'hard',
    category: 'Architecture',
    impact: 'high',
    implementation: 'Use Next.js, Nuxt, or similar frameworks to implement SSR or static generation.',
  },
];

export function OptimizationTips() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = useMemo(
    () => [...new Set(OPTIMIZATION_TIPS.map((t) => t.category))],
    []
  );

  const filteredTips = useMemo(() => {
    return OPTIMIZATION_TIPS.filter((tip) => {
      const matchesSearch =
        tip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tip.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDifficulty = !selectedDifficulty || tip.difficulty === selectedDifficulty;
      const matchesCategory = !selectedCategory || tip.category === selectedCategory;

      return matchesSearch && matchesDifficulty && matchesCategory;
    });
  }, [searchQuery, selectedDifficulty, selectedCategory]);

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return <Badge variant="good">Easy</Badge>;
      case 'medium':
        return <Badge variant="warning">Medium</Badge>;
      case 'hard':
        return <Badge variant="poor">Hard</Badge>;
      default:
        return null;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'text-[#0cce6b]';
      case 'medium':
        return 'text-[#ffa400]';
      case 'low':
        return 'text-[#ff4e42]';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-8">
      {/* Search & Filters */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search tips by title or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-11"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {/* Difficulty Filter */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">Difficulty:</span>
            {['easy', 'medium', 'hard'].map((difficulty) => (
              <button
                key={difficulty}
                onClick={() => setSelectedDifficulty(selectedDifficulty === difficulty ? null : difficulty)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                  selectedDifficulty === difficulty
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
              </button>
            ))}
          </div>

          {/* Category Filter */}
          {selectedDifficulty && (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">Category:</span>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                    selectedCategory === category
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      <div>
        <p className="text-sm text-muted-foreground mb-4">
          Found {filteredTips.length} {filteredTips.length === 1 ? 'tip' : 'tips'}
        </p>

        {filteredTips.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTips.map((tip) => (
              <Card key={tip.id} className="p-6 hover:shadow-lg hover:border-primary/20 transition-all group">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
                      {tip.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mb-3">
                      {tip.category}
                    </p>
                  </div>
                  {getDifficultyBadge(tip.difficulty)}
                </div>

                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {tip.description}
                </p>

                <div className="space-y-3 pt-3 border-t border-border">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground mb-1">
                      Impact
                    </p>
                    <p className={`text-sm font-bold ${getImpactColor(tip.impact)}`}>
                      {tip.impact.charAt(0).toUpperCase() + tip.impact.slice(1)} Impact
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-muted-foreground mb-1">
                      Implementation
                    </p>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {tip.implementation}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground mb-4">
              {searchQuery
                ? `No tips found for "${searchQuery}"`
                : 'No tips match your filters'}
            </p>
            {(searchQuery || selectedDifficulty || selectedCategory) && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedDifficulty(null);
                  setSelectedCategory(null);
                }}
                className="text-primary hover:underline text-sm font-medium"
              >
                Clear filters
              </button>
            )}
          </Card>
        )}
      </div>
    </div>
  );
}
