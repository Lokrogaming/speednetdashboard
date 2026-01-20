export interface FileItem {
  id: string;
  name: string;
  size: number;
  type: string;
  created_at: string;
  updated_at: string;
  path: string;
}

export interface UploadProgress {
  fileName: string;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
}

export type ViewMode = 'grid' | 'list';
