import { FolderOpen, Upload } from 'lucide-react';

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
      <div className="relative">
        <div className="p-6 rounded-full bg-muted/50">
          <FolderOpen className="h-12 w-12 text-muted-foreground" />
        </div>
        <div className="absolute -bottom-1 -right-1 p-2 rounded-full bg-primary/10">
          <Upload className="h-4 w-4 text-primary" />
        </div>
      </div>
      <h3 className="mt-6 text-lg font-semibold">No files yet</h3>
      <p className="mt-2 text-sm text-muted-foreground text-center max-w-sm">
        Upload your first file by dragging and dropping it above, or click the upload area to browse.
      </p>
    </div>
  );
}
