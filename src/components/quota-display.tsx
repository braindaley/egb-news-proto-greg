'use client';

import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

interface QuotaInfo {
  remaining: number;
  isUsingMockData: boolean;
  lastUpdated: string;
  error?: string;
}

export function QuotaDisplay() {
  const [quotaInfo, setQuotaInfo] = useState<QuotaInfo | null>(null);

  useEffect(() => {
    // Listen for quota updates from API calls
    const handleQuotaUpdate = (event: CustomEvent<QuotaInfo>) => {
      setQuotaInfo(event.detail);
    };

    window.addEventListener('quotaUpdate', handleQuotaUpdate as EventListener);

    return () => {
      window.removeEventListener('quotaUpdate', handleQuotaUpdate as EventListener);
    };
  }, []);

  if (!quotaInfo) return null;

  return (
    <Card className="fixed bottom-4 right-4 z-50 shadow-lg">
      <CardContent className="p-3">
        <div className="flex items-center gap-2 text-sm">
          <Badge
            variant={quotaInfo.isUsingMockData ? "destructive" : "secondary"}
            className="text-xs"
          >
            {quotaInfo.isUsingMockData ? 'Mock Data' : 'Live API'}
          </Badge>
          {!quotaInfo.isUsingMockData && (
            <span className="text-muted-foreground">
              {quotaInfo.remaining} credits left
            </span>
          )}
        </div>
        <div className="text-xs text-muted-foreground mt-1">
          Updated: {new Date(quotaInfo.lastUpdated).toLocaleTimeString()}
          {quotaInfo.error && (
            <div className="text-red-500 mt-1 max-w-48 break-words">
              Error: {quotaInfo.error}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}