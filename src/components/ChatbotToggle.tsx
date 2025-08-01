import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bot, X } from 'lucide-react';
import { Chatbot } from './Chatbot';
import { cn } from '@/lib/utils';

interface ChatbotToggleProps {
  className?: string;
  showNotification?: boolean;
  isVisible?: boolean;
  isCollapsed?: boolean;
  variant?: 'floating' | 'header';
}

export const ChatbotToggle: React.FC<ChatbotToggleProps> = ({ 
  className,
  showNotification = false,
  isVisible = true,
  isCollapsed = false,
  variant = 'floating'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Initialize position to bottom-right (only for floating variant)
  useEffect(() => {
    if (variant === 'floating') {
      const updatePosition = () => {
        const buttonWidth = isCollapsed ? 48 : 56; // 12 * 4 = 48px for collapsed, 14 * 4 = 56px for expanded
        const defaultX = window.innerWidth - buttonWidth - 16; // button width + 16px margin
        const defaultY = window.innerHeight - buttonWidth - 16;
        setPosition({ x: defaultX, y: defaultY });
      };

      updatePosition();
      window.addEventListener('resize', updatePosition);
      
      return () => window.removeEventListener('resize', updatePosition);
    }
  }, [isCollapsed, variant]);

  // Handle drag functionality (only for floating variant)
  useEffect(() => {
    if (variant === 'floating') {
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
    }
  }, [isDragging, variant]);

  const handleDragStart = (e: React.MouseEvent) => {
    if (variant === 'floating') {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(true);
    }
  };

  const [lastClickTime, setLastClickTime] = useState(0);

  const handleClick = (e: React.MouseEvent) => {
    if (variant === 'floating' && !isDragging) {
      const currentTime = new Date().getTime();
      const timeDiff = currentTime - lastClickTime;
      
      if (timeDiff < 300 && timeDiff > 0) {
        // Double click - reset position
        const buttonWidth = isCollapsed ? 48 : 56;
        const defaultX = window.innerWidth - buttonWidth - 16;
        const defaultY = window.innerHeight - buttonWidth - 16;
        setPosition({ x: defaultX, y: defaultY });
        setLastClickTime(0);
      } else {
        // Single click - open chatbot
        setIsOpen(true);
        setLastClickTime(currentTime);
      }
          } else if (variant === 'header') {
        // Toggle chatbot for header variant
        setIsOpen(!isOpen);
      }
  };

  // Don't render if not visible
  if (!isVisible) return null;

  return (
    <>
      <Button
        ref={toggleRef}
        onClick={handleClick}
        onMouseDown={handleDragStart}
        className={cn(
          variant === 'floating' ? 'fixed' : 'inline-flex',
          variant === 'floating' ? 'w-14 h-14 rounded-full z-40' : 'w-8 h-8 rounded-md',
          'transition-all duration-200',
          variant === 'floating' 
            ? 'bg-primary hover:bg-primary/90 text-primary-foreground' 
            : 'bg-blue-600 hover:bg-blue-700 text-white border border-blue-600 hover:border-blue-700',
          variant === 'floating' && isDragging ? 'shadow-2xl scale-110 rotate-12' : '',
          variant === 'floating' && isDragging ? 'cursor-grabbing' : variant === 'floating' ? 'cursor-grab' : 'cursor-pointer',
          variant === 'floating' && isCollapsed ? 'w-12 h-12' : variant === 'floating' ? 'w-14 h-14' : 'w-8 h-8',
          className
        )}
        style={variant === 'floating' ? {
          left: `${position.x}px`,
          top: `${position.y}px`,
        } : {}}
        size="icon"
      >
        <Bot className={variant === 'header' ? "w-5 h-5" : isCollapsed ? "w-5 h-5" : "w-6 h-6"} />
        {showNotification && (
          <Badge 
            className="absolute -top-1 -right-1 w-5 h-5 rounded-full p-0 text-xs"
            variant="destructive"
          >
            1
          </Badge>
        )}
        {/* Drag indicator dots - only show when floating and not collapsed */}
        {variant === 'floating' && !isCollapsed && (
          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-1">
            <div className="w-1 h-1 bg-white/60 rounded-full"></div>
            <div className="w-1 h-1 bg-white/60 rounded-full"></div>
            <div className="w-1 h-1 bg-white/60 rounded-full"></div>
          </div>
        )}
      </Button>

      <Chatbot 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
      />
    </>
  );
}; 