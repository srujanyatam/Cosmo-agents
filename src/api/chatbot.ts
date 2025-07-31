import { ChatMessage, ChatbotResponse } from '@/types/chatbot';

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '/.netlify/functions' 
  : 'http://localhost:8888/.netlify/functions';

export interface ChatbotRequest {
  message: string;
  conversationHistory: ChatMessage[];
  model?: 'qwen' | 'gemini';
}

export interface ChatbotAPIResponse {
  message: string;
  intent: string;
  suggestions: string[];
  timestamp: string;
}

export const sendChatMessage = async (request: ChatbotRequest): Promise<ChatbotResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/chatbot`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ChatbotAPIResponse = await response.json();

    const assistantMessage: ChatMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      content: data.message,
      role: 'assistant',
      timestamp: new Date(data.timestamp),
      type: 'text',
      metadata: {
        suggestions: data.suggestions,
      },
    };

    return {
      message: assistantMessage,
      suggestions: data.suggestions,
    };
  } catch (error) {
    console.error('Chatbot API error:', error);
    throw new Error('Failed to send message to chatbot');
  }
};

export const analyzeCodeWithChatbot = async (
  code: string,
  language: string = 'sql',
  context?: string
): Promise<ChatbotResponse> => {
  const message = context 
    ? `${context}\n\nCode:\n\`\`\`${language}\n${code}\n\`\`\``
    : `Please analyze this ${language} code:\n\`\`\`${language}\n${code}\n\`\`\``;

  return sendChatMessage({
    message,
    conversationHistory: [],
    model: 'qwen',
  });
};

export const getMigrationHelp = async (topic: string): Promise<ChatbotResponse> => {
  const message = `I need help with ${topic} in my Sybase to Oracle migration. Can you provide guidance and best practices?`;

  return sendChatMessage({
    message,
    conversationHistory: [],
    model: 'qwen',
  });
}; 