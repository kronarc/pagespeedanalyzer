'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface AnalyzeFormProps {
  onAnalyze?: (result: any) => void;
}

export function AnalyzeForm({ onAnalyze }: AnalyzeFormProps) {
  const [url, setUrl] = useState('');
  const [deviceType, setDeviceType] = useState<'mobile' | 'desktop'>('mobile');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!url.trim()) {
      toast.error('Please enter a URL');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, deviceType }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 429) {
          toast.error(data.message || 'Daily limit exceeded. Please try again later.');
        } else {
          toast.error(data.error || 'Failed to analyze page');
        }
        return;
      }

      toast.success('Analysis complete!');
      onAnalyze?.(data.data);
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="url" className="text-base font-semibold text-foreground">
            Website URL
          </Label>
          <p className="text-sm text-muted-foreground mb-3">
            Enter the URL of the website you want to analyze
          </p>
          <Input
            id="url"
            type="text"
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={loading}
            className="h-12 text-base"
          />
        </div>

        <div>
          <Label className="text-base font-semibold text-foreground">Device Type</Label>
          <p className="text-sm text-muted-foreground mb-3">
            Choose which device to analyze
          </p>
          <div className="flex gap-3">
            {(['mobile', 'desktop'] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setDeviceType(type)}
                disabled={loading}
                className={`flex-1 py-3 px-4 rounded-lg border-2 font-medium transition-all ${
                  deviceType === type
                    ? 'border-primary bg-primary/10 text-primary dark:bg-primary/20'
                    : 'border-input/50 text-muted-foreground hover:border-primary/40 hover:text-foreground dark:border-input/50'
                }`}
              >
                {type === 'mobile' ? '📱' : '🖥️'} {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full h-12 text-base font-semibold"
        >
          {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {loading ? 'Analyzing...' : 'Analyze Website'}
        </Button>
      </form>
    </Card>
  );
}
