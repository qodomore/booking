import React from 'react';
import { ImageIcon } from 'lucide-react';

interface MediaThumbProps {
  src?: string;
  alt: string;
  onClick?: () => void;
  isPlaceholder?: boolean;
}

export function MediaThumb({ src, alt, onClick, isPlaceholder = false }: MediaThumbProps) {
  return (
    <button
      onClick={onClick}
      className="relative w-20 h-20 rounded-[12px] overflow-hidden bg-muted flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-transform hover:scale-105 active:scale-95"
      aria-label={alt}
    >
      {src && !isPlaceholder ? (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-muted/50">
          <ImageIcon className="w-8 h-8 text-muted-foreground/40" />
        </div>
      )}
    </button>
  );
}
