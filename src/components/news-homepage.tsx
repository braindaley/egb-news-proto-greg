'use client';

import { useState, useEffect, useCallback } from 'react';
import { NewsArticle, NewsTopic } from '@/lib/types';
import { newsAPI } from '@/lib/news-api';
import { TopicNavigation } from '@/components/topic-navigation';
import { MobileNavigation } from '@/components/mobile-navigation';
import { NewsCard } from '@/components/news-card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { QuotaDisplay } from '@/components/quota-display';
import { decodeHtmlEntities } from '@/lib/html-utils';
import Image from 'next/image';
import { Newspaper, Loader2 } from 'lucide-react';

export default function NewsHomepage() {
  const [activeTopic, setActiveTopic] = useState<NewsTopic>('general');
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<NewsArticle[]>([]);
  const [loadingRelated, setLoadingRelated] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const fetchArticles = useCallback(async (topic: NewsTopic) => {
    setLoading(true);
    try {
      const fetchedArticles = await newsAPI.getNewsByTopic(topic, 20);
      setArticles(fetchedArticles);
    } catch (error) {
      console.error('Error fetching articles:', error);
      setArticles([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchRelatedArticles = useCallback(async (title: string, currentArticleId: string) => {
    setLoadingRelated(true);
    try {
      const related = await newsAPI.getRelatedArticles(title, 6); // Get more to filter out current
      // Filter out the current article
      const filtered = related.filter(article => article.id !== currentArticleId).slice(0, 4);
      setRelatedArticles(filtered);
    } catch (error) {
      console.error('Error fetching related articles:', error);
      setRelatedArticles([]);
    } finally {
      setLoadingRelated(false);
    }
  }, []);

  const handleTopicChange = useCallback((topic: NewsTopic) => {
    setActiveTopic(topic);
    fetchArticles(topic);
  }, [fetchArticles]);

  const handleArticleClick = useCallback((article: NewsArticle) => {
    setSelectedArticle(article);
    fetchRelatedArticles(article.title, article.id);
  }, [fetchRelatedArticles]);

  const handleDialogClose = useCallback(() => {
    setSelectedArticle(null);
    setRelatedArticles([]);
  }, []);

  useEffect(() => {
    fetchArticles('general');
  }, [fetchArticles]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Newspaper className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold tracking-tight">US News Hub</h1>
            </div>
            <MobileNavigation
              activeTopic={activeTopic}
              onTopicChange={handleTopicChange}
              open={mobileNavOpen}
              onOpenChange={setMobileNavOpen}
            />
          </div>
        </div>
      </header>

      {/* Topic Navigation */}
      <div className="sticky top-16 z-40 hidden md:block">
        <TopicNavigation
          activeTopic={activeTopic}
          onTopicChange={handleTopicChange}
        />
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-lg">Loading news articles...</span>
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-12">
            <Newspaper className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-muted-foreground">No articles found</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Try selecting a different topic or check back later.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <NewsCard
                key={article.id}
                article={article}
                onClick={() => handleArticleClick(article)}
                className="h-full"
              />
            ))}
          </div>
        )}
      </main>

      {/* Article Detail Dialog */}
      <Dialog open={!!selectedArticle} onOpenChange={handleDialogClose}>
        <DialogContent className="!max-w-6xl w-[95vw] max-h-[90vh] sm:!max-w-6xl">
          {selectedArticle && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl font-bold leading-tight pr-8">
                  {decodeHtmlEntities(selectedArticle.title)}
                </DialogTitle>
                <DialogDescription className="sr-only">
                  Full article view with content and related articles
                </DialogDescription>
              </DialogHeader>
              <ScrollArea className="max-h-[calc(90vh-8rem)]">
                <div className="space-y-6">
                  {selectedArticle.image && (
                    <div className="w-full rounded-lg overflow-hidden">
                      <Image
                        src={selectedArticle.image}
                        alt={selectedArticle.title}
                        width={800}
                        height={400}
                        className="w-full h-auto object-cover"
                        unoptimized
                      />
                    </div>
                  )}

                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    {selectedArticle.summary && (
                      <p className="text-lg font-medium text-muted-foreground leading-relaxed">
                        {decodeHtmlEntities(selectedArticle.summary)}
                      </p>
                    )}
                    {selectedArticle.text && (
                      <div className="mt-4 whitespace-pre-wrap leading-relaxed">
                        {decodeHtmlEntities(selectedArticle.text)}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-4 pt-4 border-t text-sm text-muted-foreground">
                    {selectedArticle.authors && selectedArticle.authors.length > 0 && (
                      <span>By {selectedArticle.authors.join(', ')}</span>
                    )}
                    <span>
                      {new Date(selectedArticle.publish_date).toLocaleDateString()}
                    </span>
                    <a
                      href={selectedArticle.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Read full article →
                    </a>
                  </div>

                  {/* Related Articles */}
                  {(loadingRelated || relatedArticles.length > 0) && (
                    <div className="pt-6 border-t">
                      <h3 className="text-lg font-semibold mb-4">Related Articles</h3>
                      {loadingRelated ? (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Loading related articles...</span>
                        </div>
                      ) : (
                        <div className="grid gap-3">
                          {relatedArticles.map((article) => (
                            <NewsCard
                              key={article.id}
                              article={article}
                              onClick={() => handleArticleClick(article)}
                              compact
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </ScrollArea>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Quota Display */}
      <QuotaDisplay />
    </div>
  );
}