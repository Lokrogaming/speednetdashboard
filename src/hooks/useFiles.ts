import { useState, useEffect, useCallback } from 'react';
import { supabase, STORAGE_BUCKET } from '@/lib/supabase';
import { FileItem, UploadProgress } from '@/types/file';
import { toast } from 'sonner';

export function useFiles() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([]);

  const fetchFiles = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.storage
        .from(STORAGE_BUCKET)
        .list('', {
          limit: 100,
          sortBy: { column: 'created_at', order: 'desc' },
        });

      if (error) throw error;

      const fileItems: FileItem[] = (data || [])
        .filter(item => item.name !== '.emptyFolderPlaceholder')
        .map(item => ({
          id: item.id,
          name: item.name,
          size: item.metadata?.size || 0,
          type: item.metadata?.mimetype || getFileType(item.name),
          created_at: item.created_at,
          updated_at: item.updated_at,
          path: item.name,
        }));

      setFiles(fileItems);
    } catch (error: any) {
      console.error('Error fetching files:', error);
      toast.error('Failed to load files');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  const uploadFiles = async (fileList: FileList | File[]) => {
    const filesArray = Array.from(fileList);
    if (filesArray.length === 0) return;

    setUploading(true);
    const progressItems: UploadProgress[] = filesArray.map(f => ({
      fileName: f.name,
      progress: 0,
      status: 'uploading',
    }));
    setUploadProgress(progressItems);

    try {
      for (let i = 0; i < filesArray.length; i++) {
        const file = filesArray[i];
        const fileName = `${Date.now()}-${file.name}`;

        setUploadProgress(prev =>
          prev.map((p, idx) =>
            idx === i ? { ...p, progress: 50 } : p
          )
        );

        const { error } = await supabase.storage
          .from(STORAGE_BUCKET)
          .upload(fileName, file);

        if (error) {
          setUploadProgress(prev =>
            prev.map((p, idx) =>
              idx === i ? { ...p, status: 'error', progress: 0 } : p
            )
          );
          toast.error(`Failed to upload ${file.name}`);
        } else {
          setUploadProgress(prev =>
            prev.map((p, idx) =>
              idx === i ? { ...p, status: 'completed', progress: 100 } : p
            )
          );
        }
      }

      toast.success('Files uploaded successfully');
      await fetchFiles();
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error('Upload failed');
    } finally {
      setUploading(false);
      setTimeout(() => setUploadProgress([]), 2000);
    }
  };

  const downloadFile = async (file: FileItem) => {
    try {
      const { data, error } = await supabase.storage
        .from(STORAGE_BUCKET)
        .download(file.path);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success(`Downloaded ${file.name}`);
    } catch (error: any) {
      console.error('Download error:', error);
      toast.error('Download failed');
    }
  };

  const deleteFile = async (file: FileItem) => {
    try {
      const { error } = await supabase.storage
        .from(STORAGE_BUCKET)
        .remove([file.path]);

      if (error) throw error;

      toast.success(`Deleted ${file.name}`);
      await fetchFiles();
    } catch (error: any) {
      console.error('Delete error:', error);
      toast.error('Delete failed');
    }
  };

  const getPublicUrl = (file: FileItem): string => {
    const { data } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(file.path);
    return data.publicUrl;
  };

  return {
    files,
    loading,
    uploading,
    uploadProgress,
    uploadFiles,
    downloadFile,
    deleteFile,
    getPublicUrl,
    refreshFiles: fetchFiles,
  };
}

function getFileType(fileName: string): string {
  const ext = fileName.split('.').pop()?.toLowerCase() || '';
  const typeMap: Record<string, string> = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    webp: 'image/webp',
    svg: 'image/svg+xml',
    pdf: 'application/pdf',
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    xls: 'application/vnd.ms-excel',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ppt: 'application/vnd.ms-powerpoint',
    pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    zip: 'application/zip',
    rar: 'application/x-rar-compressed',
    mp3: 'audio/mpeg',
    mp4: 'video/mp4',
    txt: 'text/plain',
    json: 'application/json',
    html: 'text/html',
    css: 'text/css',
    js: 'application/javascript',
  };
  return typeMap[ext] || 'application/octet-stream';
}
