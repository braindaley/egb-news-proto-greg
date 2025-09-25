'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { NEWS_TOPICS } from '@/lib/constants';
import { NewsTopic } from '@/lib/types';
import { cn } from '@/lib/utils';

interface TopicNavigationProps {
  activeTopic: NewsTopic;
  onTopicChange: (topic: NewsTopic) => void;
  className?: string;
}

export function TopicNavigation({ activeTopic, onTopicChange, className }: TopicNavigationProps) {
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const checkScrollButtons = () => {
    const scrollArea = scrollAreaRef.current;
    if (!scrollArea) return;

    const { scrollLeft, scrollWidth, clientWidth } = scrollArea;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
  };

  const scroll = (direction: 'left' | 'right') => {
    const scrollArea = scrollAreaRef.current;
    if (!scrollArea) return;

    const scrollAmount = 200;
    const newScrollLeft = direction === 'left'
      ? scrollArea.scrollLeft - scrollAmount
      : scrollArea.scrollLeft + scrollAmount;

    scrollArea.scrollTo({ left: newScrollLeft, behavior: 'smooth' });
  };

  useEffect(() => {
    const scrollArea = scrollAreaRef.current;
    if (!scrollArea) return;

    const handleScroll = () => checkScrollButtons();
    scrollArea.addEventListener('scroll', handleScroll);

    // Initial check
    setTimeout(checkScrollButtons, 100);

    return () => scrollArea.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={cn('relative flex items-center bg-background border-b', className)}>
      {/* Left scroll button */}
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          'absolute left-0 z-10 h-12 w-8 rounded-none shadow-lg bg-background/80 backdrop-blur-sm',
          !canScrollLeft && 'opacity-0 pointer-events-none'
        )}
        onClick={() => scroll('left')}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {/* Scrollable navigation */}
      <div
        ref={scrollAreaRef}
        className="flex-1 overflow-x-auto scrollbar-hide px-8"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        <div className="flex space-x-1 py-2 min-w-max">
          {NEWS_TOPICS.map((topic) => (
            <Button
              key={topic.id}
              variant={activeTopic === topic.id ? 'default' : 'ghost'}
              size="sm"
              className={cn(
                'whitespace-nowrap transition-all duration-200 px-4 py-2 flex-shrink-0',
                activeTopic === topic.id && 'bg-primary text-primary-foreground shadow-sm'
              )}
              onClick={() => onTopicChange(topic.id)}
            >
              {topic.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Right scroll button */}
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          'absolute right-0 z-10 h-12 w-8 rounded-none shadow-lg bg-background/80 backdrop-blur-sm',
          !canScrollRight && 'opacity-0 pointer-events-none'
        )}
        onClick={() => scroll('right')}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}