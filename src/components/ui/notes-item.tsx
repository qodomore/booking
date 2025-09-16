import React, { useState } from "react";
import { 
  StickyNote, 
  User, 
  Clock, 
  Star, 
  Edit3, 
  Trash2, 
  Pin, 
  PinOff,
  MoreHorizontal,
  Tag,
  AlertTriangle
} from "lucide-react";
import { Button } from "./button";
import { Badge } from "./badge";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./dropdown-menu";
import { Textarea } from "./textarea";
import { Card, CardContent } from "./card";

interface NotesItemProps {
  note: {
    id: string;
    content: string;
    author: string;
    authorAvatar?: string;
    timestamp: string;
    isImportant?: boolean;
    isPinned?: boolean;
    tags?: string[];
    type?: 'note' | 'warning' | 'reminder' | 'medical';
  };
  onEdit?: (noteId: string, content: string) => void;
  onDelete?: (noteId: string) => void;
  onPin?: (noteId: string, pinned: boolean) => void;
  onMarkImportant?: (noteId: string, important: boolean) => void;
  onAddTag?: (noteId: string, tag: string) => void;
  onRemoveTag?: (noteId: string, tag: string) => void;
  variant?: 'default' | 'compact' | 'detailed';
  editable?: boolean;
  className?: string;
}

const noteTypeStyles = {
  note: {
    bg: 'bg-background',
    border: 'border-border',
    icon: StickyNote,
    iconColor: 'text-blue-600'
  },
  warning: {
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    icon: AlertTriangle,
    iconColor: 'text-orange-600'
  },
  reminder: {
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    icon: Clock,
    iconColor: 'text-purple-600'
  },
  medical: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    icon: AlertTriangle,
    iconColor: 'text-red-600'
  }
};

const formatTimestamp = (timestamp: string) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInHours = Math.abs(now.getTime() - date.getTime()) / (1000 * 60 * 60);
  
  if (diffInHours < 24) {
    return date.toLocaleTimeString('ru-RU', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  } else if (diffInHours < 24 * 7) {
    return date.toLocaleDateString('ru-RU', { 
      weekday: 'short',
      hour: '2-digit', 
      minute: '2-digit'
    });
  } else {
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  }
};

const getAuthorInitials = (name: string) => {
  return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
};

export function NotesItem({
  note,
  onEdit,
  onDelete,
  onPin,
  onMarkImportant,
  onAddTag,
  onRemoveTag,
  variant = 'default',
  editable = true,
  className = ''
}: NotesItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(note.content);
  const [showDropdown, setShowDropdown] = useState(false);

  const noteTypeConfig = noteTypeStyles[note.type || 'note'];
  const TypeIcon = noteTypeConfig.icon;

  const handleSaveEdit = () => {
    if (onEdit && editContent.trim() !== note.content) {
      onEdit(note.id, editContent.trim());
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditContent(note.content);
    setIsEditing(false);
  };

  if (variant === 'compact') {
    return (
      <div className={`flex items-start gap-3 p-2 hover:bg-muted/20 rounded-lg transition-colors ${className}`}>
        <TypeIcon className={`h-4 w-4 ${noteTypeConfig.iconColor} mt-0.5 flex-shrink-0`} />
        <div className="flex-1 min-w-0">
          <div className="text-sm line-clamp-2">{note.content}</div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-muted-foreground">{note.author}</span>
            <span className="text-xs text-muted-foreground">•</span>
            <span className="text-xs text-muted-foreground">{formatTimestamp(note.timestamp)}</span>
            {note.isImportant && (
              <Star className="h-3 w-3 text-orange-500 fill-orange-500" />
            )}
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'detailed') {
    return (
      <Card className={`${noteTypeConfig.bg} ${noteTypeConfig.border} border ${className}`}>
        <CardContent className="p-4">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={note.authorAvatar} />
                <AvatarFallback className="text-xs">
                  {getAuthorInitials(note.author)}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium text-sm">{note.author}</div>
                <div className="text-xs text-muted-foreground">
                  {formatTimestamp(note.timestamp)}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-1">
              {note.isPinned && (
                <Pin className="h-4 w-4 text-orange-500" />
              )}
              {note.isImportant && (
                <Star className="h-4 w-4 text-orange-500 fill-orange-500" />
              )}
              <TypeIcon className={`h-4 w-4 ${noteTypeConfig.iconColor}`} />
              {editable && (
                <DropdownMenu open={showDropdown} onOpenChange={setShowDropdown}>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setIsEditing(true)}>
                      <Edit3 className="h-4 w-4 mr-2" />
                      Редактировать
                    </DropdownMenuItem>
                    {onPin && (
                      <DropdownMenuItem onClick={() => onPin(note.id, !note.isPinned)}>
                        {note.isPinned ? (
                          <>
                            <PinOff className="h-4 w-4 mr-2" />
                            Открепить
                          </>
                        ) : (
                          <>
                            <Pin className="h-4 w-4 mr-2" />
                            Закрепить
                          </>
                        )}
                      </DropdownMenuItem>
                    )}
                    {onMarkImportant && (
                      <DropdownMenuItem onClick={() => onMarkImportant(note.id, !note.isImportant)}>
                        <Star className={`h-4 w-4 mr-2 ${note.isImportant ? 'fill-orange-500 text-orange-500' : ''}`} />
                        {note.isImportant ? 'Убрать важность' : 'Отметить важным'}
                      </DropdownMenuItem>
                    )}
                    {onDelete && (
                      <DropdownMenuItem 
                        onClick={() => onDelete(note.id)}
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
          </div>

          {/* Content */}
          {isEditing ? (
            <div className="space-y-3">
              <Textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="min-h-[80px] resize-none"
                autoFocus
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={handleSaveEdit}>
                  Сохранить
                </Button>
                <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                  Отмена
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {note.content}
              </p>
              
              {/* Tags */}
              {note.tags && note.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {note.tags.map(tag => (
                    <Badge 
                      key={tag}
                      variant="outline" 
                      className="text-xs cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors"
                      onClick={() => onRemoveTag?.(note.id, tag)}
                    >
                      <Tag className="h-3 w-3 mr-1" />
                      {tag} ×
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  // Default variant
  return (
    <div className={`p-3 rounded-lg ${noteTypeConfig.bg} ${noteTypeConfig.border} border-l-4 ${
      note.isImportant ? 'border-l-orange-500' : noteTypeConfig.border
    } ${className}`}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="font-medium text-xs">{note.author}</span>
          {note.isPinned && (
            <Pin className="h-3 w-3 text-orange-500" />
          )}
          {note.isImportant && (
            <Star className="h-3 w-3 text-orange-500 fill-orange-500" />
          )}
        </div>
        
        <div className="flex items-center gap-1">
          <span className="text-xs text-muted-foreground">
            {formatTimestamp(note.timestamp)}
          </span>
          {editable && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <MoreHorizontal className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setIsEditing(true)}>
                  <Edit3 className="h-4 w-4 mr-2" />
                  Редактировать
                </DropdownMenuItem>
                {onDelete && (
                  <DropdownMenuItem 
                    onClick={() => onDelete(note.id)}
                    className="text-red-600"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Удалить
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
      
      {isEditing ? (
        <div className="space-y-2">
          <Textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="min-h-[60px] text-sm resize-none"
            autoFocus
          />
          <div className="flex gap-1">
            <Button size="sm" onClick={handleSaveEdit}>
              Сохранить
            </Button>
            <Button size="sm" variant="outline" onClick={handleCancelEdit}>
              Отмена
            </Button>
          </div>
        </div>
      ) : (
        <p className="text-sm leading-relaxed whitespace-pre-wrap">
          {note.content}
        </p>
      )}
      
      {/* Tags */}
      {note.tags && note.tags.length > 0 && !isEditing && (
        <div className="flex flex-wrap gap-1 mt-2">
          {note.tags.map(tag => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}

// Компонент списка заметок
interface NotesListProps {
  notes: NotesItemProps['note'][];
  onEdit?: (noteId: string, content: string) => void;
  onDelete?: (noteId: string) => void;
  onPin?: (noteId: string, pinned: boolean) => void;
  onMarkImportant?: (noteId: string, important: boolean) => void;
  variant?: 'default' | 'compact' | 'detailed';
  maxHeight?: number;
  emptyMessage?: string;
  editable?: boolean;
  className?: string;
}

export function NotesList({
  notes,
  onEdit,
  onDelete,
  onPin,
  onMarkImportant,
  variant = 'default',
  maxHeight,
  emptyMessage = 'Заметок пока нет',
  editable = true,
  className = ''
}: NotesListProps) {
  // Sort notes: pinned first, then by timestamp (newest first)
  const sortedNotes = [...notes].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });

  if (notes.length === 0) {
    return (
      <div className={`text-center py-8 text-muted-foreground ${className}`}>
        <StickyNote className="h-8 w-8 mx-auto mb-2 opacity-50" />
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div 
      className={`space-y-3 ${className}`}
      style={maxHeight ? { maxHeight: `${maxHeight}px`, overflowY: 'auto' } : {}}
    >
      {sortedNotes.map((note) => (
        <NotesItem
          key={note.id}
          note={note}
          onEdit={onEdit}
          onDelete={onDelete}
          onPin={onPin}
          onMarkImportant={onMarkImportant}
          variant={variant}
          editable={editable}
        />
      ))}
    </div>
  );
}