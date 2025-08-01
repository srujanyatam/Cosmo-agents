import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, X } from 'lucide-react';
import { Chatbot } from './Chatbot';
import { cn } from '@/lib/utils';

interface ChatbotToggleProps {
  className?: string;
  showNotification?: boolean;
}

export const ChatbotToggle: React.FC<ChatbotToggleProps> = ({ 
  className,
  showNotification = false 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Initialize position to bottom-right
  useEffect(() => {
    const defaultX = window.innerWidth - 80; // 56px button + 24px margin
    const defaultY = window.innerHeight - 80;
    setPosition({ x: defaultX, y: defaultY });
  }, []);

  // Handle drag functionality
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && toggleRef.current) {
        const rect = toggleRef.current.getBoundingClientRect();
        const newX = e.clientX - rect.width / 2;
        const newY = e.clientY - rect.height / 2;
        
        // Keep button within viewport bounds with padding
        const maxX = window.innerWidth - rect.width - 16;
        const maxY = window.innerHeight - rect.height - 16;
        
        setPosition({
          x: Math.max(16, Math.min(newX, maxX)),
          y: Math.max(16, Math.min(newY, maxY))
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const handleDragStart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const [lastClickTime, setLastClickTime] = useState(0);

  const handleClick = (e: React.MouseEvent) => {
    if (!isDragging) {
      const currentTime = new Date().getTime();
      const timeDiff = currentTime - lastClickTime;
      
      if (timeDiff < 300 && timeDiff > 0) {
        // Double click - reset position
        const defaultX = window.innerWidth - 80;
        const defaultY = window.innerHeight - 80;
        setPosition({ x: defaultX, y: defaultY });
        setLastClickTime(0);
      } else {
        // Single click - open chatbot
        setIsOpen(true);
        setLastClickTime(currentTime);
      }
    }
  };

  return (
    <>
      <Button
        ref={toggleRef}
        onClick={handleClick}
        onMouseDown={handleDragStart}
        className={cn(
          'fixed w-14 h-14 rounded-full shadow-lg z-40 transition-all duration-200',
          'bg-primary hover:bg-primary/90 text-primary-foreground',
          isDragging ? 'shadow-2xl scale-110 rotate-12' : 'shadow-lg',
          isDragging ? 'cursor-grabbing' : 'cursor-grab',
          className
        )}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
        }}
        size="icon"
      >
        <MessageSquare className="w-6 h-6" />
        {showNotification && (
          <Badge 
            className="absolute -top-1 -right-1 w-5 h-5 rounded-full p-0 text-xs"
            variant="destructive"
          >
            1
          </Badge>
        )}
        {/* Drag indicator dots */}
        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-1">
          <div className="w-1 h-1 bg-white/60 rounded-full"></div>
          <div className="w-1 h-1 bg-white/60 rounded-full"></div>
          <div className="w-1 h-1 bg-white/60 rounded-full"></div>
        </div>
      </Button>

      <Chatbot 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
      />
    </>
  );
}; 