import { useState, useCallback } from 'react';
import { Upload, Cloud, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { UploadProgress } from '@/types/file';

interface UploadZoneProps {
  onUpload: (files: FileList) => void;
  uploading: boolean;
  uploadProgress: UploadProgress[];
}

export function UploadZone({ onUpload, uploading, uploadProgress }: UploadZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);
      if (e.dataTransfer.files.length > 0) {
        onUpload(e.dataTransfer.files);
      }
    },
    [onUpload]
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onUpload(e.target.files);
    }
  };

  return (
    <div className="relative">
      <label
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          'flex flex-col items-center justify-center w-full h-48 rounded-xl border-2 border-dashed cursor-pointer transition-all duration-300',
          'bg-muted/30 hover:bg-muted/50',
          isDragOver && 'border-primary bg-primary/5 scale-[1.02] shadow-glow',
          uploading && 'pointer-events-none opacity-70',
          !isDragOver && 'border-border hover:border-primary/50'
        )}
      >
        <input
          type="file"
          multiple
          className="hidden"
          onChange={handleFileInput}
          disabled={uploading}
        />
        
        <div className="flex flex-col items-center gap-3">
          {uploading ? (
            <>
              <div className="relative">
                <Loader2 className="h-10 w-10 text-primary animate-spin" />
              </div>
              <p className="text-sm font-medium text-foreground">Uploading files...</p>
            </>
          ) : (
            <>
              <div className={cn(
                'p-4 rounded-full transition-all duration-300',
                isDragOver ? 'bg-primary/20' : 'bg-primary/10'
              )}>
                {isDragOver ? (
                  <Cloud className="h-8 w-8 text-primary" />
                ) : (
                  <Upload className="h-8 w-8 text-primary" />
                )}
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-foreground">
                  {isDragOver ? 'Drop files here' : 'Drag & drop files here'}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  or click to browse
                </p>
              </div>
            </>
          )}
        </div>
      </label>

      {/* Upload Progress */}
      {uploadProgress.length > 0 && (
        <div className="absolute -bottom-2 left-0 right-0 transform translate-y-full pt-4">
          <div className="space-y-2 max-h-32 overflow-y-auto scrollbar-thin">
            {uploadProgress.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 bg-card rounded-lg p-2 border border-border animate-fade-in"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">{item.fileName}</p>
                  <div className="h-1 bg-muted rounded-full mt-1 overflow-hidden">
                    <div
                      className={cn(
                        'h-full transition-all duration-300 rounded-full',
                        item.status === 'completed' && 'bg-success',
                        item.status === 'uploading' && 'bg-primary',
                        item.status === 'error' && 'bg-destructive'
                      )}
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
