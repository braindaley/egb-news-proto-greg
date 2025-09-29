'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { NewsArticle } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';
import Image from 'next/image';
import { Clock, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { decodeHtmlEntities } from '@/lib/html-utils';

interface NewsCardProps {
  article: NewsArticle;
  onClick?: () => void;
  className?: string;
  compact?: boolean;
}

export function NewsCard({ article, onClick, className, compact = false }: NewsCardProps) {
  const publishDate = new Date(article.publish_date);
  const now = new Date();

  // Handle future dates or invalid dates
  const timeAgo = publishDate > now || isNaN(publishDate.getTime())
    ? 'Recently'
    : formatDistanceToNow(publishDate, { addSuffix: true });

  // Extract source from URL since WorldNewsAPI doesn't provide source field
  const getSourceFromUrl = (url: string): string => {
    try {
      const domain = new URL(url).hostname;
      // Remove www. and common subdomains
      const cleanDomain = domain.replace(/^(www\.|m\.|mobile\.)/, '');

      // Map common domains to readable names
      const sourceMap: Record<string, string> = {
        'cnn.com': 'CNN',
        'foxnews.com': 'Fox News',
        'nytimes.com': 'New York Times',
        'washingtonpost.com': 'Washington Post',
        'reuters.com': 'Reuters',
        'ap.org': 'Associated Press',
        'apnews.com': 'Associated Press',
        'npr.org': 'NPR',
        'usatoday.com': 'USA Today',
        'wsj.com': 'Wall Street Journal',
        'nbcnews.com': 'NBC News',
        'abcnews.go.com': 'ABC News',
        'cbsnews.com': 'CBS News',
        'politico.com': 'Politico',
        'thehill.com': 'The Hill',
        'bloomberg.com': 'Bloomberg',
      };

      return sourceMap[cleanDomain] || cleanDomain.replace('.com', '').replace('.org', '');
    } catch {
      return 'Unknown Source';
    }
  };

  const sourceName = article.source || article.source_name || getSourceFromUrl(article.url);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onClick?.();
  };

  const handleExternalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(article.url, '_blank', 'noopener,noreferrer');
  };

  if (compact) {
    return (
      <Card
        className={cn(
          'cursor-pointer transition-all duration-200 hover:shadow-md border-l-4 border-l-primary/20 hover:border-l-primary',
          className
        )}
        onClick={handleClick}
      >
        <CardContent className="p-4">
          <div className="flex gap-3">
            {article.image && (
              <div className="relative w-16 h-16 flex-shrink-0 rounded overflow-hidden">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="mb-2">
                <h3 className="font-semibold text-sm leading-tight line-clamp-2 mb-1">
                  {decodeHtmlEntities(article.title)}
                </h3>
                {article.authors && article.authors.length > 0 && (
                  <p className="text-muted-foreground text-xs">
                    By {article.authors[0]}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span>{timeAgo}</span>
                {sourceName && (
                  <>
                    <span>•</span>
                    <span className="font-medium">{sourceName}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={cn(
        'cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 group overflow-hidden py-0',
        className
      )}
      onClick={handleClick}
    >
      {article.image && (
        <div className="relative w-full h-48 overflow-hidden">
          <Image
            src={article.image}
            alt={article.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <button
            onClick={handleExternalClick}
            className="absolute top-3 right-3 p-2 bg-black/20 hover:bg-black/40 rounded-full transition-colors"
            aria-label="Open article in new tab"
          >
            <ExternalLink className="w-4 h-4 text-white" />
          </button>
        </div>
      )}
      <CardContent className="p-4">
        <div className="space-y-3">
          <div>
            <h2 className="font-bold text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors mb-1">
              {decodeHtmlEntities(article.title)}
            </h2>
            {article.authors && article.authors.length > 0 && (
              <p className="text-muted-foreground text-sm">
                By {article.authors[0]}
              </p>
            )}
          </div>

          {article.summary && (
            <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
              {decodeHtmlEntities(article.summary)}
            </p>
          )}

          <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2">
            <Clock className="w-3 h-3" />
            <span>{timeAgo}</span>
            {sourceName && (
              <>
                <span>•</span>
                <span className="font-medium">{sourceName}</span>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}