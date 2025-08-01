import React, { useState } from 'react';
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

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className={cn(
          'fixed bottom-4 right-4 w-14 h-14 rounded-full shadow-lg z-40',
          'bg-primary hover:bg-primary/90 text-primary-foreground',
          className
        )}
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
      </Button>

      <Chatbot 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
      />
    </>
  );
}; 