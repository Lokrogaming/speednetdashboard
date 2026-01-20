import {
  FileText,
  Image,
  FileVideo,
  FileAudio,
  FileCode,
  FileSpreadsheet,
  FileArchive,
  File,
  FileType,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileIconProps {
  type: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function FileIcon({ type, className, size = 'md' }: FileIconProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  const getIconConfig = () => {
    if (type.startsWith('image/')) {
      return { icon: Image, color: 'text-pink-500' };
    }
    if (type.startsWith('video/')) {
      return { icon: FileVideo, color: 'text-purple-500' };
    }
    if (type.startsWith('audio/')) {
      return { icon: FileAudio, color: 'text-green-500' };
    }
    if (type.includes('pdf')) {
      return { icon: FileType, color: 'text-red-500' };
    }
    if (type.includes('spreadsheet') || type.includes('excel') || type.includes('csv')) {
      return { icon: FileSpreadsheet, color: 'text-emerald-500' };
    }
    if (type.includes('zip') || type.includes('rar') || type.includes('archive')) {
      return { icon: FileArchive, color: 'text-amber-500' };
    }
    if (type.includes('javascript') || type.includes('json') || type.includes('html') || type.includes('css') || type.includes('xml')) {
      return { icon: FileCode, color: 'text-blue-500' };
    }
    if (type.includes('text') || type.includes('document') || type.includes('word')) {
      return { icon: FileText, color: 'text-sky-500' };
    }
    return { icon: File, color: 'text-muted-foreground' };
  };

  const { icon: Icon, color } = getIconConfig();

  return <Icon className={cn(sizeClasses[size], color, className)} />;
}
