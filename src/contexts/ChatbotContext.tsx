import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { 
  ChatMessage, 
  ChatConversation, 
  ChatbotContext as ChatbotContextType,
  ChatbotConfig,
  ChatbotSuggestion 
} from '@/types/chatbot';

interface ChatbotState {
  currentConversation: ChatConversation | null;
  conversations: ChatConversation[];
  isLoading: boolean;
  error: string | null;
  config: ChatbotConfig;
}

type ChatbotAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'CREATE_CONVERSATION'; payload: { id: string; title: string } }
  | { type: 'SET_CURRENT_CONVERSATION'; payload: ChatConversation | null }
  | { type: 'ADD_MESSAGE'; payload: { conversationId: string; message: ChatMessage } }
  | { type: 'UPDATE_CONVERSATION_TITLE'; payload: { conversationId: string; title: string } }
  | { type: 'DELETE_CONVERSATION'; payload: string }
  | { type: 'CLEAR_CONVERSATION'; payload: string }
  | { type: 'UPDATE_CONFIG'; payload: Partial<ChatbotConfig> }
  | { type: 'LOAD_CONVERSATIONS'; payload: ChatConversation[] };

const initialState: ChatbotState = {
  currentConversation: null,
  conversations: [],
  isLoading: false,
  error: null,
  config: {
    model: 'gemini',
    temperature: 0.7,
    maxTokens: 500,
    systemPrompt: 'You are an expert Oracle database migration assistant for a specific Sybase to Oracle migration project. PROJECT CONTEXT: This is a Sybase to Oracle migration project using React/TypeScript frontend with Vite, Netlify Functions backend, Supabase database, Google Gemini and OpenRouter APIs, custom conversion utilities for stored procedures, and SQL file uploads. RESPONSE GUIDELINES: Provide natural, conversational responses without robotic phrases like "Okay, based on the project context...". Prioritize project-specific answers when questions relate to this codebase. Use generic Oracle migration guidance only when questions aren\'t project-related. Be concise, practical, and direct. Start responses naturally without repetitive introductions.'
  }
};

function chatbotReducer(state: ChatbotState, action: ChatbotAction): ChatbotState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    
    case 'CREATE_CONVERSATION':
      const newConversation: ChatConversation = {
        id: action.payload.id,
        title: action.payload.title,
        messages: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true
      };
      return {
        ...state,
        conversations: [newConversation, ...state.conversations],
        currentConversation: newConversation
      };
    
    case 'SET_CURRENT_CONVERSATION':
      return { ...state, currentConversation: action.payload };
    
    case 'ADD_MESSAGE':
      return {
        ...state,
        conversations: state.conversations.map(conv => {
          if (conv.id === action.payload.conversationId) {
            return {
              ...conv,
              messages: [...conv.messages, action.payload.message],
              updatedAt: new Date()
            };
          }
          return conv;
        }),
        currentConversation: state.currentConversation?.id === action.payload.conversationId
          ? {
              ...state.currentConversation,
              messages: [...state.currentConversation.messages, action.payload.message],
              updatedAt: new Date()
            }
          : state.currentConversation
      };
    
    case 'UPDATE_CONVERSATION_TITLE':
      return {
        ...state,
        conversations: state.conversations.map(conv => 
          conv.id === action.payload.conversationId
            ? { ...conv, title: action.payload.title }
            : conv
        )
      };
    
    case 'DELETE_CONVERSATION':
      return {
        ...state,
        conversations: state.conversations.filter(conv => conv.id !== action.payload),
        currentConversation: state.currentConversation?.id === action.payload ? null : state.currentConversation
      };
    
    case 'CLEAR_CONVERSATION':
      return {
        ...state,
        conversations: state.conversations.map(conv => 
          conv.id === action.payload
            ? { ...conv, messages: [], updatedAt: new Date() }
            : conv
        ),
        currentConversation: state.currentConversation?.id === action.payload
          ? { ...state.currentConversation, messages: [], updatedAt: new Date() }
          : state.currentConversation
      };
    
    case 'UPDATE_CONFIG':
      return {
        ...state,
        config: { ...state.config, ...action.payload }
      };
    
    case 'LOAD_CONVERSATIONS':
      return {
        ...state,
        conversations: action.payload
      };
    
    default:
      return state;
  }
}

const ChatbotContext = createContext<ChatbotContextType | undefined>(undefined);

export const useChatbot = () => {
  const context = useContext(ChatbotContext);
  if (context === undefined) {
    throw new Error('useChatbot must be used within a ChatbotProvider');
  }
  return context;
};

interface ChatbotProviderProps {
  children: ReactNode;
}

export const ChatbotProvider: React.FC<ChatbotProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(chatbotReducer, initialState);

  const createConversation = (title: string): string => {
    const conversationId = uuidv4();
    dispatch({ type: 'CREATE_CONVERSATION', payload: { id: conversationId, title } });
    return conversationId;
  };

  const setCurrentConversation = (conversation: ChatConversation | null) => {
    dispatch({ type: 'SET_CURRENT_CONVERSATION', payload: conversation });
  };

  const addMessage = (conversationId: string, message: ChatMessage) => {
    dispatch({ type: 'ADD_MESSAGE', payload: { conversationId, message } });
  };

  const updateConversationTitle = (conversationId: string, title: string) => {
    dispatch({ type: 'UPDATE_CONVERSATION_TITLE', payload: { conversationId, title } });
  };

  const deleteConversation = (conversationId: string) => {
    dispatch({ type: 'DELETE_CONVERSATION', payload: conversationId });
  };

  const clearConversation = (conversationId: string) => {
    dispatch({ type: 'CLEAR_CONVERSATION', payload: conversationId });
  };

  const updateConfig = (config: Partial<ChatbotConfig>) => {
    dispatch({ type: 'UPDATE_CONFIG', payload: config });
  };

  const setLoading = (loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  };

  const setError = (error: string | null) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  };

  const value: ChatbotContextType = {
    currentConversation: state.currentConversation,
    conversations: state.conversations,
    isLoading: state.isLoading,
    error: state.error,
    config: state.config,
    createConversation,
    setCurrentConversation,
    addMessage,
    updateConversationTitle,
    deleteConversation,
    clearConversation,
    updateConfig,
    setLoading,
    setError
  };

  return (
    <ChatbotContext.Provider value={value}>
      {children}
    </ChatbotContext.Provider>
  );
}; 