import React from "react";
import { 
  File, 
  FileImage, 
  FileText, 
  FileVideo, 
  FileAudio,
  Download, 
  Eye, 
  Trash2,
  MoreHorizontal,
  Upload,
  Calendar,
  User
} from "lucide-react";
import { Button } from "./button";
import { Badge } from "./badge";
import { Card, CardContent } from "./card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./dropdown-menu";

interface FilesItemProps {
  file: {
    id: string;
    name: string;
    size: number;
    type: string;
    url?: string;
    thumbnail?: string;
    uploadedBy: string;
    uploadedAt: string;
    category?: 'document' | 'image' | 'video' | 'audio' | 'other';
  };
  onDownload?: (fileId: string) => void;
  onPreview?: (fileId: string) => void;
  onDelete?: (fileId: string) => void;
  variant?: 'list' | 'grid' | 'compact';
  showActions?: boolean;
  className?: string;
}

const getFileIcon = (type: string, category?: string) => {
  if (category) {
    switch (category) {
      case 'image': return FileImage;
      case 'video': return FileVideo;
      case 'audio': return FileAudio;
      case 'document': return FileText;
      default: return File;
    }
  }
  
  // Fallback to type-based detection
  if (type.startsWith('image/')) return FileImage;
  if (type.startsWith('video/')) return FileVideo;
  if (type.startsWith('audio/')) return FileAudio;
  if (['application/pdf', 'text/', 'application/msword', 'application/vnd.openxmlformats-officedocument'].some(t => type.includes(t))) {
    return FileText;
  }
  
  return File;
};

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const formatUploadDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.abs(now.getTime() - date.getTime()) / (1000 * 60 * 60);
  
  if (diffInHours < 24) {
    return 'Сегодня';
  } else if (diffInHours < 24 * 7) {
    return date.toLocaleDateString('ru-RU', { weekday: 'short' });
  } else {
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short'
    });
  }
};

const getFileTypeColor = (category?: string) => {
  switch (category) {
    case 'image': return 'text-green-600';
    case 'video': return 'text-blue-600';
    case 'audio': return 'text-purple-600';
    case 'document': return 'text-orange-600';
    default: return 'text-muted-foreground';
  }
};

export function FilesItem({
  file,
  onDownload,
  onPreview,
  onDelete,
  variant = 'list',
  showActions = true,
  className = ''
}: FilesItemProps) {
  const FileIcon = getFileIcon(file.type, file.category);
  const iconColor = getFileTypeColor(file.category);

  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-3 p-2 hover:bg-muted/20 rounded-lg transition-colors ${className}`}>
        <FileIcon className={`h-4 w-4 ${iconColor} flex-shrink-0`} />
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm truncate">{file.name}</div>
          <div className="text-xs text-muted-foreground">
            {formatFileSize(file.size)} • {formatUploadDate(file.uploadedAt)}
          </div>
        </div>
        {showActions && (
          <div className="flex gap-1 flex-shrink-0">
            {onPreview && file.category === 'image' && (
              <Button variant="ghost" size="sm" onClick={() => onPreview(file.id)}>
                <Eye className="h-3 w-3" />
              </Button>
            )}
            {onDownload && (
              <Button variant="ghost" size="sm" onClick={() => onDownload(file.id)}>
                <Download className="h-3 w-3" />
              </Button>
            )}
          </div>
        )}
      </div>
    );
  }

  if (variant === 'grid') {
    return (
      <Card className={`glass-card overflow-hidden ${className}`}>
        <CardContent className="p-0">
          {/* Preview/Thumbnail */}
          <div className="aspect-square bg-muted/30 flex items-center justify-center relative">
            {file.thumbnail ? (
              <img 
                src={file.thumbnail} 
                alt={file.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <FileIcon className={`h-8 w-8 ${iconColor}`} />
            )}
            
            {/* Overlay Actions */}
            {showActions && (
              <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                {onPreview && (
                  <Button variant="secondary" size="sm" onClick={() => onPreview(file.id)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                )}
                {onDownload && (
                  <Button variant="secondary" size="sm" onClick={() => onDownload(file.id)}>
                    <Download className="h-4 w-4" />
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="p-3">
            <div className="font-medium text-sm truncate mb-1" title={file.name}>
              {file.name}
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{formatFileSize(file.size)}</span>
              <span>{formatUploadDate(file.uploadedAt)}</span>
            </div>
            {showActions && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="w-full mt-2">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center">
                  {onPreview && (
                    <DropdownMenuItem onClick={() => onPreview(file.id)}>
                      <Eye className="h-4 w-4 mr-2" />
                      Просмотр
                    </DropdownMenuItem>
                  )}
                  {onDownload && (
                    <DropdownMenuItem onClick={() => onDownload(file.id)}>
                      <Download className="h-4 w-4 mr-2" />
                      Скачать
                    </DropdownMenuItem>
                  )}
                  {onDelete && (
                    <DropdownMenuItem 
                      onClick={() => onDelete(file.id)}
                      className="text-red-600 focus:text-red-600"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Удалить
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  // List variant (default)
  return (
    <div className={`flex items-center gap-4 p-3 hover:bg-muted/20 rounded-lg transition-colors ${className}`}>
      {/* File Icon/Thumbnail */}
      <div className="flex-shrink-0">
        {file.thumbnail ? (
          <div className="w-10 h-10 rounded-lg overflow-hidden">
            <img 
              src={file.thumbnail} 
              alt={file.name}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-10 h-10 bg-muted/30 rounded-lg flex items-center justify-center">
            <FileIcon className={`h-5 w-5 ${iconColor}`} />
          </div>
        )}
      </div>

      {/* File Info */}
      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm truncate" title={file.name}>
          {file.name}
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
          <span>{formatFileSize(file.size)}</span>
          <span>•</span>
          <div className="flex items-center gap-1">
            <User className="h-3 w-3" />
            <span>{file.uploadedBy}</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{formatUploadDate(file.uploadedAt)}</span>
          </div>
        </div>
      </div>

      {/* File Type Badge */}
      <Badge variant="outline" className="text-xs">
        {file.type.split('/')[1]?.toUpperCase() || 'FILE'}
      </Badge>

      {/* Actions */}
      {showActions && (
        <div className="flex items-center gap-1 flex-shrink-0">
          {onPreview && (file.category === 'image' || file.category === 'document') && (
            <Button variant="ghost" size="sm" onClick={() => onPreview(file.id)}>
              <Eye className="h-4 w-4" />
            </Button>
          )}
          {onDownload && (
            <Button variant="ghost" size="sm" onClick={() => onDownload(file.id)}>
              <Download className="h-4 w-4" />
            </Button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onPreview && (
                <DropdownMenuItem onClick={() => onPreview(file.id)}>
                  <Eye className="h-4 w-4 mr-2" />
                  Просмотр
                </DropdownMenuItem>
              )}
              {onDownload && (
                <DropdownMenuItem onClick={() => onDownload(file.id)}>
                  <Download className="h-4 w-4 mr-2" />
                  Скачать
                </DropdownMenuItem>
              )}
              {onDelete && (
                <DropdownMenuItem 
                  onClick={() => onDelete(file.id)}
                  className="text-red-600 focus:text-red-600"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Удалить
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </div>
  );
}

// Компонент списка файлов
interface FilesListProps {
  files: FilesItemProps['file'][];
  onDownload?: (fileId: string) => void;
  onPreview?: (fileId: string) => void;
  onDelete?: (fileId: string) => void;
  onUpload?: () => void;
  variant?: 'list' | 'grid' | 'compact';
  maxHeight?: number;
  emptyMessage?: string;
  allowUpload?: boolean;
  className?: string;
}

export function FilesList({
  files,
  onDownload,
  onPreview,
  onDelete,
  onUpload,
  variant = 'list',
  maxHeight,
  emptyMessage = 'Файлов пока нет',
  allowUpload = true,
  className = ''
}: FilesListProps) {
  if (files.length === 0) {
    return (
      <div className={`text-center py-8 text-muted-foreground ${className}`}>
        <File className="h-8 w-8 mx-auto mb-2 opacity-50" />
        <p className="mb-3">{emptyMessage}</p>
        {allowUpload && onUpload && (
          <Button onClick={onUpload} variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Загрузить файл
          </Button>
        )}
      </div>
    );
  }

  const containerClass = variant === 'grid' 
    ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'
    : 'space-y-2';

  return (
    <div 
      className={`${containerClass} ${className}`}
      style={maxHeight ? { maxHeight: `${maxHeight}px`, overflowY: 'auto' } : {}}
    >
      {files.map((file) => (
        <FilesItem
          key={file.id}
          file={file}
          onDownload={onDownload}
          onPreview={onPreview}
          onDelete={onDelete}
          variant={variant}
        />
      ))}
    </div>
  );
}

// Компонент загрузки файлов
interface FileUploaderProps {
  onUpload: (files: FileList) => void;
  acceptedTypes?: string;
  maxSize?: number; // in bytes
  multiple?: boolean;
  className?: string;
}

export function FileUploader({
  onUpload,
  acceptedTypes = "*/*",
  maxSize = 10 * 1024 * 1024, // 10MB
  multiple = true,
  className = ''
}: FileUploaderProps) {
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      onUpload(files);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files && files.length > 0) {
      onUpload(files);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  return (
    <div
      className={`border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-primary/50 transition-colors ${className}`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
      <p className="text-sm text-muted-foreground mb-3">
        Перетащите файлы сюда или нажмите для выбора
      </p>
      <input
        type="file"
        accept={acceptedTypes}
        multiple={multiple}
        onChange={handleFileSelect}
        className="hidden"
        id="file-upload"
      />
      <label htmlFor="file-upload">
        <Button variant="outline" size="sm" asChild>
          <span>Выбрать файлы</span>
        </Button>
      </label>
      <p className="text-xs text-muted-foreground mt-2">
        Максимальный размер: {formatFileSize(maxSize)}
      </p>
    </div>
  );
}