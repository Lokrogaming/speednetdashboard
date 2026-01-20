import { Search, LayoutGrid, List, RefreshCw } from 'lucide-react';
import { ViewMode } from '@/types/file';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface HeaderProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onRefresh: () => void;
  refreshing: boolean;
}

export function Header({
  viewMode,
  setViewMode,
  searchQuery,
  setSearchQuery,
  onRefresh,
  refreshing,
}: HeaderProps) {
  return (
    <header className="flex items-center justify-between gap-4 p-4 border-b border-border bg-card/50 glass">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search files..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-background/50 border-border focus:border-primary/50"
        />
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onRefresh}
          disabled={refreshing}
          className="h-9 w-9"
        >
          <RefreshCw className={cn('h-4 w-4', refreshing && 'animate-spin')} />
        </Button>

        <div className="flex items-center bg-muted rounded-lg p-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setViewMode('grid')}
            className={cn(
              'h-8 w-8 rounded-md',
              viewMode === 'grid' && 'bg-background shadow-sm'
            )}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setViewMode('list')}
            className={cn(
              'h-8 w-8 rounded-md',
              viewMode === 'list' && 'bg-background shadow-sm'
            )}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
