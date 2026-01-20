import { Download, Trash2, Link, MoreVertical } from 'lucide-react';
import { FileItem, ViewMode } from '@/types/file';
import { FileIcon } from './FileIcon';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface FileCardProps {
  file: FileItem;
  viewMode: ViewMode;
  onDownload: (file: FileItem) => void;
  onDelete: (file: FileItem) => void;
  getPublicUrl: (file: FileItem) => string;
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function FileCard({ file, viewMode, onDownload, onDelete, getPublicUrl }: FileCardProps) {
  const handleCopyLink = () => {
    const url = getPublicUrl(file);
    navigator.clipboard.writeText(url);
    toast.success('Link copied to clipboard');
  };

  if (viewMode === 'list') {
    return (
      <div className="group flex items-center gap-4 p-3 rounded-lg bg-card border border-border hover:border-primary/30 hover:bg-muted/30 transition-all duration-200 animate-fade-in">
        <FileIcon type={file.type} size="sm" />
        
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{file.name}</p>
        </div>
        
        <div className="hidden sm:block text-xs text-muted-foreground w-20">
          {formatFileSize(file.size)}
        </div>
        
        <div className="hidden md:block text-xs text-muted-foreground w-28">
          {formatDate(file.created_at)}
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onDownload(file)}
          >
            <Download className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleCopyLink}
          >
            <Link className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:text-destructive"
            onClick={() => onDelete(file)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative flex flex-col items-center p-4 rounded-xl bg-card border border-border hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-200 animate-scale-in">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuItem onClick={() => onDownload(file)}>
            <Download className="h-4 w-4 mr-2" />
            Download
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleCopyLink}>
            <Link className="h-4 w-4 mr-2" />
            Copy Link
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onDelete(file)}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="w-full flex items-center justify-center h-20 mb-3">
        <FileIcon type={file.type} size="lg" />
      </div>

      <div className="w-full text-center">
        <p className="text-sm font-medium truncate px-1" title={file.name}>
          {file.name}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {formatFileSize(file.size)}
        </p>
      </div>
    </div>
  );
}
