export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant' | 'system';
  timestamp: Date;
  type: 'text' | 'code' | 'error' | 'success';
  metadata?: {
    codeBlock?: string;
    language?: string;
    fileId?: string;
    conversionId?: string;
    suggestions?: string[];
  };
}

export interface ChatConversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export interface ChatbotConfig {
  model: 'gemini' | 'openai' | 'qwen';
  temperature: number;
  maxTokens: number;
  systemPrompt: string;
}

export interface ChatbotContext {
  currentConversation: ChatConversation | null;
  conversations: ChatConversation[];
  isLoading: boolean;
  error: string | null;
  config: ChatbotConfig;
}

export interface ChatbotResponse {
  message: ChatMessage;
  suggestions?: string[];
  relatedFiles?: string[];
  codeExamples?: {
    code: string;
    language: string;
    description: string;
  }[];
}

export type ChatbotIntent = 
  | 'code_explanation'
  | 'migration_help'
  | 'data_type_mapping'
  | 'syntax_help'
  | 'error_resolution'
  | 'best_practices'
  | 'general_question'
  | 'file_analysis';

export interface ChatbotSuggestion {
  id: string;
  text: string;
  intent: ChatbotIntent;
  icon?: string;
} 