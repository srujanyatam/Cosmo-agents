import React, { useState, useRef, useEffect } from 'react';
import { useChatbot } from '@/contexts/ChatbotContext';
import { sendChatMessage } from '@/api/chatbot';
import { ChatMessage, ChatbotSuggestion } from '@/types/chatbot';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Send, 
  Bot, 
  User, 
  MessageSquare, 
  X, 
  Trash2, 
  Plus,
  Loader2,
  Code,
  Lightbulb,
  BookOpen,
  Settings,
  Minimize2,
  Maximize2
} from 'lucide-react';
import { ChatbotSettings } from './ChatbotSettings';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface ChatbotProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

const quickSuggestions: ChatbotSuggestion[] = [
  {
    id: '1',
    text: 'How do I convert Sybase stored procedures to Oracle?',
    intent: 'migration_help',
    icon: 'Code'
  },
  {
    id: '2',
    text: 'What are the data type mappings between Sybase and Oracle?',
    intent: 'data_type_mapping',
    icon: 'BookOpen'
  },
  {
    id: '3',
    text: 'How can I optimize Oracle performance?',
    intent: 'best_practices',
    icon: 'Lightbulb'
  },
  {
    id: '4',
    text: 'Explain this code and suggest improvements',
    intent: 'code_explanation',
    icon: 'MessageSquare'
  }
];

const MessageBubble: React.FC<{ message: ChatMessage }> = ({ message }) => {
  const isUser = message.role === 'user';
  
  return (
    <div className={cn(
      'flex gap-3 mb-4',
      isUser ? 'justify-end' : 'justify-start'
    )}>
      <div className={cn(
        'flex gap-3 max-w-[80%]',
        isUser ? 'flex-row-reverse' : 'flex-row'
      )}>
        <div className={cn(
          'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
          isUser ? 'bg-primary text-primary-foreground' : 'bg-muted'
        )}>
          {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
        </div>
        
        <div className={cn(
          'rounded-lg px-4 py-2',
          isUser 
            ? 'bg-primary text-primary-foreground' 
            : 'bg-muted'
        )}>
          <div className="text-sm whitespace-pre-wrap">
            {message.content}
          </div>
          {message.metadata?.codeBlock && (
            <div className="mt-2">
              <pre className="bg-background text-foreground p-2 rounded text-xs overflow-x-auto">
                <code>{message.metadata.codeBlock}</code>
              </pre>
            </div>
          )}
          <div className={cn(
            'text-xs mt-1 opacity-70',
            isUser ? 'text-primary-foreground' : 'text-muted-foreground'
          )}>
            {message.timestamp.toLocaleTimeString()}
          </div>
        </div>
      </div>
    </div>
  );
};

const SuggestionButton: React.FC<{ 
  suggestion: ChatbotSuggestion; 
  onClick: (text: string) => void;
  disabled?: boolean;
}> = ({ suggestion, onClick, disabled }) => {
  const getIcon = (iconName?: string) => {
    switch (iconName) {
      case 'Code': return <Code className="w-4 h-4" />;
      case 'BookOpen': return <BookOpen className="w-4 h-4" />;
      case 'Lightbulb': return <Lightbulb className="w-4 h-4" />;
      case 'MessageSquare': return <MessageSquare className="w-4 h-4" />;
      default: return <MessageSquare className="w-4 h-4" />;
    }
  };

  const handleClick = () => {
    if (!disabled) {
      onClick(suggestion.text);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleClick}
      disabled={disabled}
      className="h-auto p-2 text-left whitespace-normal hover:bg-primary hover:text-primary-foreground transition-colors"
    >
      <div className="flex items-start gap-2">
        {getIcon(suggestion.icon)}
        <span className="text-xs leading-relaxed">{suggestion.text}</span>
      </div>
    </Button>
  );
};

export const Chatbot: React.FC<ChatbotProps> = ({ isOpen, onClose, className }) => {
  const { toast } = useToast();
  const {
    currentConversation,
    conversations,
    isLoading,
    error,
    createConversation,
    setCurrentConversation,
    addMessage,
    setLoading,
    setError
  } = useChatbot();

  const [showSettings, setShowSettings] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [size, setSize] = useState({ width: 600, height: 500 });

  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const resizeRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentConversation?.messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Handle resize
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isResizing && resizeRef.current) {
        const rect = resizeRef.current.getBoundingClientRect();
        const newWidth = Math.max(320, Math.min(800, e.clientX - rect.left));
        const newHeight = Math.max(400, Math.min(800, e.clientY - rect.top));
        setSize({ width: newWidth, height: newHeight });
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);





    const handleSendMessage = async (messageText: string) => {
    if (!messageText.trim() || isLoading) return;

    // Create conversation if needed
    if (!currentConversation) {
      const newConversationId = createConversation('New Conversation');
      
      // Create the user message first
      const userMessage: ChatMessage = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        content: messageText,
        role: 'user',
        timestamp: new Date(),
        type: 'text'
      };

      // Add the message to the new conversation immediately
      addMessage(newConversationId, userMessage);
      setInputValue('');
      setLoading(true);
      setError(null);

      try {
        const response = await sendChatMessage({
          message: messageText,
          conversationHistory: [userMessage], // Use the message we just created
          model: 'gemini'
        });

        addMessage(newConversationId, response.message);
        setSuggestions(response.suggestions || []);
      } catch (err) {
        console.error('Chatbot error:', err);
        setError('Failed to send message');
        toast({
          title: 'Error',
          description: 'Failed to send message. Please try again.',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
      return;
    }

    const userMessage: ChatMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      content: messageText,
      role: 'user',
      timestamp: new Date(),
      type: 'text'
    };
    
    addMessage(currentConversation.id, userMessage);
    setInputValue('');
    setLoading(true);
    setError(null);

    try {
             const response = await sendChatMessage({
        message: messageText,
        conversationHistory: currentConversation.messages,
        model: 'gemini'
      });

      addMessage(currentConversation.id, response.message);
      setSuggestions(response.suggestions || []);
    } catch (err) {
      console.error('Chatbot error:', err);
      setError('Failed to send message');
      toast({
        title: 'Error',
        description: 'Failed to send message. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputValue);
    }
  };

  const handleNewConversation = () => {
    createConversation('New Conversation');
    setSuggestions([]);
    setInputValue('');
  };

  const handleToggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  };

  if (!isOpen) return null;

  return (
    <div 
      className={cn(
        'fixed bottom-4 right-4 bg-background border rounded-lg shadow-lg flex flex-col z-50',
        isMinimized ? 'w-80 h-16' : 'min-w-[320px] max-w-[800px] min-h-[400px] max-h-[800px]',
        className
      )}
      style={{
        width: isMinimized ? '320px' : `${size.width}px`,
        height: isMinimized ? '64px' : `${size.height}px`,
        cursor: isResizing ? 'nw-resize' : 'default'
      }}
      ref={resizeRef}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-primary" />
          <h3 className="font-semibold">Migration Assistant</h3>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSettings(true)}
            title="Settings"
          >
            <Settings className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleNewConversation}
            title="New conversation"
          >
            <Plus className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleToggleMinimize}
            title={isMinimized ? "Maximize" : "Minimize"}
          >
            {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            title="Close"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

                           {/* Messages */}
        {!isMinimized && (
          <ScrollArea className="flex-1 p-4">
          {!currentConversation || currentConversation.messages.length === 0 ? (
            <div className="text-center py-8">
              <Bot className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h4 className="font-medium mb-2">Welcome to Migration Assistant</h4>
              <p className="text-sm text-muted-foreground mb-4">
                I'm here to help you with your Sybase to Oracle migration. Ask me anything!
              </p>
            </div>
          ) : (
            <div>
              {currentConversation.messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}
              {isLoading && (
                <div className="flex gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="bg-muted rounded-lg px-4 py-2">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-sm">Thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
          </ScrollArea>
        )}

               {/* Quick Suggestions - Always visible when no conversation or empty conversation */}
        {!isMinimized && (!currentConversation || (currentConversation && currentConversation.messages.length === 0)) && (
         <div className="p-4 border-t">
           <p className="text-xs text-muted-foreground mb-2">Quick Start:</p>
           <div className="grid grid-cols-2 gap-2">
             {quickSuggestions.map((suggestion) => (
               <SuggestionButton
                 key={suggestion.id}
                 suggestion={suggestion}
                 onClick={handleSuggestionClick}
                 disabled={isLoading}
               />
             ))}
           </div>
         </div>
       )}

      {/* Suggestions */}
      {!isMinimized && suggestions.length > 0 && (
        <div className="p-4 border-t">
          <p className="text-xs text-muted-foreground mb-2">Suggestions:</p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => handleSuggestionClick(suggestion)}
                className="text-xs"
              >
                {suggestion}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      {!isMinimized && (
        <div className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about migration, code, or best practices..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            onClick={() => handleSendMessage(inputValue)}
            disabled={!inputValue.trim() || isLoading}
            size="icon"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
      )}

      {/* Resize handle */}
      {!isMinimized && (
        <div
          className="absolute bottom-0 left-0 w-4 h-4 cursor-nw-resize opacity-50 hover:opacity-100 transition-opacity"
          onMouseDown={handleResizeStart}
          style={{ cursor: 'nw-resize' }}
        >
          <div className="w-full h-full flex items-end justify-start">
            <div className="w-2 h-2 border-l-2 border-b-2 border-muted-foreground rounded-bl-sm"></div>
          </div>
        </div>
      )}

      <ChatbotSettings 
        isOpen={showSettings} 
        onClose={() => setShowSettings(false)} 
      />
    </div>
  );
}; 