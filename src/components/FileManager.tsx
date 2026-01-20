import { useState, useMemo } from 'react';
import { Loader2 } from 'lucide-react';
import { useFiles } from '@/hooks/useFiles';
import { ViewMode } from '@/types/file';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { UploadZone } from './UploadZone';
import { FileCard } from './FileCard';
import { EmptyState } from './EmptyState';
import { cn } from '@/lib/utils';

export function FileManager() {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const {
    files,
    loading,
    uploading,
    uploadProgress,
    uploadFiles,
    downloadFile,
    deleteFile,
    getPublicUrl,
    refreshFiles,
  } = useFiles();

  const filteredFiles = useMemo(() => {
    if (!searchQuery.trim()) return files;
    const query = searchQuery.toLowerCase();
    return files.filter((file) => file.name.toLowerCase().includes(query));
  }, [files, searchQuery]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshFiles();
    setRefreshing(false);
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar totalFiles={files.length} />

      <main className="flex-1 flex flex-col overflow-hidden">
        <Header
          viewMode={viewMode}
          setViewMode={setViewMode}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onRefresh={handleRefresh}
          refreshing={refreshing}
        />

        <div className="flex-1 overflow-y-auto scrollbar-thin p-6">
          <div className="max-w-5xl mx-auto space-y-8">
            <UploadZone
              onUpload={uploadFiles}
              uploading={uploading}
              uploadProgress={uploadProgress}
            />

            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">
                  {searchQuery ? `Search results` : 'Your Files'}
                </h2>
                {searchQuery && (
                  <p className="text-sm text-muted-foreground">
                    {filteredFiles.length} file{filteredFiles.length !== 1 ? 's' : ''} found
                  </p>
                )}
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="h-8 w-8 text-primary animate-spin" />
                </div>
              ) : filteredFiles.length === 0 ? (
                <EmptyState />
              ) : (
                <div
                  className={cn(
                    viewMode === 'grid'
                      ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4'
                      : 'space-y-2'
                  )}
                >
                  {filteredFiles.map((file) => (
                    <FileCard
                      key={file.id}
                      file={file}
                      viewMode={viewMode}
                      onDownload={downloadFile}
                      onDelete={deleteFile}
                      getPublicUrl={getPublicUrl}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
