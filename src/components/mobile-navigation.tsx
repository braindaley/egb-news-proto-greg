'use client';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Menu } from 'lucide-react';
import { NEWS_TOPICS } from '@/lib/constants';
import { NewsTopic } from '@/lib/types';
import { cn } from '@/lib/utils';

interface MobileNavigationProps {
  activeTopic: NewsTopic;
  onTopicChange: (topic: NewsTopic) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function MobileNavigation({
  activeTopic,
  onTopicChange,
  open,
  onOpenChange
}: MobileNavigationProps) {
  const handleTopicSelect = (topic: NewsTopic) => {
    onTopicChange(topic);
    onOpenChange?.(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Open navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle>News Topics</SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-8rem)] mt-6">
          <div className="flex flex-col space-y-1 p-1">
            {NEWS_TOPICS.map((topic) => (
              <Button
                key={topic.id}
                variant={activeTopic === topic.id ? 'default' : 'ghost'}
                className={cn(
                  'justify-start h-12 px-4 text-left',
                  activeTopic === topic.id && 'bg-primary text-primary-foreground'
                )}
                onClick={() => handleTopicSelect(topic.id)}
              >
                <span className="truncate">{topic.label}</span>
              </Button>
            ))}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}