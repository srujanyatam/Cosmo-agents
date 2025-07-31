import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageCircle, 
  X, 
  Send, 
  RefreshCw,
  Plus,
  Bot, 
  User,
  Sparkles,
  Clock,
  Star,
  Zap,
  Minimize2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';


// Simulated responses for when the AI service is unavailable
const getSimulatedResponse = (userMessage: string): string => {
  const message = userMessage.toLowerCase();
  
  // React questions
  if (message.includes('react')) {
    if (message.includes('hook') || message.includes('use')) {
      return `React Hooks are functions that allow you to use state and other React features in functional components. The most common hooks are:

• **useState** - Manages component state
• **useEffect** - Handles side effects and lifecycle
• **useContext** - Accesses React context
• **useRef** - Creates mutable references

Example:
\`\`\`jsx
const [count, setCount] = useState(0);
useEffect(() => {
  document.title = \`Count: \${count}\`;
}, [count]);
\`\`\`

In your Cosmo Agents project, we use hooks extensively for state management, authentication, and UI interactions.`;
    }
    return `React.js is a JavaScript library for building user interfaces. In your Cosmo Agents project, we use React 18.3.1 with TypeScript for:

• **Component Architecture** - Reusable UI components
• **State Management** - Managing application state
• **Routing** - Navigation with React Router DOM
• **Forms** - Form handling with React Hook Form

Key features used in your project:
- Functional components with hooks
- TypeScript for type safety
- Tailwind CSS for styling
- shadcn/ui component library`;
  }
  
  // TypeScript questions
  if (message.includes('typescript')) {
    return `TypeScript is a superset of JavaScript that adds static typing. In your Cosmo Agents project, we use TypeScript 5.8.3 for:

• **Type Safety** - Catch errors at compile time
• **Better IDE Support** - IntelliSense and autocomplete
• **Interface Definitions** - Define data structures
• **Generic Types** - Reusable type definitions

Example from your project:
\`\`\`typescript
interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}
\`\`\`

Benefits in your project:
- Prevents runtime errors
- Better code documentation
- Enhanced developer experience
- Safer refactoring`;
  }
  
  // Supabase questions
  if (message.includes('supabase')) {
    return `Supabase is an open-source Firebase alternative that provides:

• **Database** - PostgreSQL database with real-time subscriptions
• **Authentication** - User auth with multiple providers
• **Real-time** - Live data updates across clients
• **Storage** - File storage and management

In your Cosmo Agents project, Supabase is used for:
- User authentication (sign up/login)
- Database storage for conversion logs
- Real-time updates for deployment status
- File management and storage

Configuration:
- Project URL: \`VITE_SUPABASE_URL\`
- Anonymous Key: \`VITE_SUPABASE_ANON_KEY\`
- Real-time subscriptions for live updates`;
  }

  // AI/ML questions
  if (message.includes('ai') || message.includes('machine learning') || message.includes('langchain')) {
    return `AI and Machine Learning technologies in your Cosmo Agents project:

• **Google Generative AI** - Powers the chatbot and code analysis
• **LangChain** - Framework for building AI applications
• **OpenRouter** - Provides access to multiple AI models
• **Code Analysis** - AI-powered code explanation and rewriting

**How it works:**
- Chatbot uses Gemini 1.5 Flash for conversations
- AI Rewrite uses Qwen Coder for code conversion
- AI Explain uses Qwen Coder for code explanation
- All AI functions are deployed as Netlify serverless functions

**API Keys Required:**
- \`CHATBOT_GEMINI_API_KEY\` for chatbot
- \`OPENROUTER_API_KEY\` for code analysis and rewriting`;
  }

  // Database questions
  if (message.includes('oracle') || message.includes('sybase') || message.includes('database')) {
    return `Database technologies supported in Cosmo Agents:

• **Oracle Database** - Enterprise database with PL/SQL
• **Sybase Database** - Legacy database system
• **PostgreSQL** - Modern relational database (via Supabase)
• **SQL** - Standard query language

**Migration Features:**
- Convert Oracle PL/SQL to other languages
- Migrate Sybase procedures to modern databases
- Code analysis and optimization
- Batch processing for multiple files

**Supported Conversions:**
- Oracle → TypeScript/JavaScript
- Sybase → TypeScript/JavaScript
- SQL → TypeScript/JavaScript
- Any language ↔ Any language`;
  }

  // Code conversion questions
  if (message.includes('convert') || message.includes('migration') || message.includes('rewrite')) {
    return `**🔄 Code Conversion & Migration Features in Cosmo Agents:**

**✨ AI-Powered Features:**
• **AI Rewrite** - Convert code between any programming languages
• **AI Explain** - Get detailed explanations of complex code
• **Batch Processing** - Handle multiple files simultaneously
• **Performance Analysis** - Optimize code efficiency

**🎯 How to Use:**
1. **Upload Files** - Drag & drop or select your code files
2. **Choose Target** - Select the language/framework you want to convert to
3. **AI Processing** - Let AI analyze and convert your code
4. **Review & Download** - Check results and download converted code

**📋 Supported Conversions:**
• **Oracle PL/SQL** → **TypeScript/JavaScript**
• **Sybase Procedures** → **Modern SQL/PL/SQL**
• **Any Language** ↔ **Any Language**
• **Framework Migration** - React, Vue, Angular, etc.

**🔧 Advanced Features:**
• **Code Analysis** - Understand complex logic
• **Performance Metrics** - Measure conversion improvements
• **Error Detection** - Identify potential issues
• **Best Practices** - Apply modern coding standards

**💡 Pro Tips:**
- Use batch processing for large projects
- Review AI explanations for better understanding
- Check performance metrics for optimization
- Download both original and converted code for comparison`;
  }

  // Vite questions
  if (message.includes('vite')) {
    return `Vite is a modern build tool used in your Cosmo Agents project:

• **Fast Development** - Instant hot module replacement
• **Optimized Builds** - Efficient production builds
• **TypeScript Support** - Native TypeScript compilation
• **Plugin System** - Extensible with plugins

**Configuration in your project:**
- Development server with hot reload
- Build optimization for production
- Asset handling and bundling
- Environment variable support

**Benefits:**
- Faster development experience
- Smaller bundle sizes
- Better developer experience
- Modern ES modules support`;
  }

  // Tailwind CSS questions
  if (message.includes('tailwind') || message.includes('css')) {
    return `**🎨 Tailwind CSS in Cosmo Agents:**

**✨ Key Features:**
• **Utility-First** - Rapid UI development with pre-built classes
• **Responsive Design** - Mobile-first approach with breakpoints
• **Custom Configuration** - Tailored to project needs
• **Component Integration** - Works seamlessly with shadcn/ui

**🔧 Usage in Your Project:**
- **Modern UI** - Clean, professional interface
- **Responsive Layout** - Works on all devices
- **Consistent Design** - Unified design system
- **Fast Development** - Rapid prototyping and iteration

  **📱 Responsive Breakpoints:**
  - sm: - Small devices (640px+)
  - md: - Medium devices (768px+)
  - lg: - Large devices (1024px+)
  - xl: - Extra large (1280px+)

**🎯 Benefits:**
- No custom CSS needed for most components
- Consistent spacing and typography
- Easy dark mode implementation
- Optimized for production builds`;
  }

  // Comments feature questions
  if (message.includes('comment') || message.includes('note')) {
    return `**💬 Comments Feature in Cosmo Agents:**

**✨ What You Can Do:**
• **Add Comments** - Write notes about your code conversions
• **Edit Comments** - Update your notes anytime
• **View Comments** - See all comments in history
• **Delete Comments** - Remove unwanted notes

**🎯 How to Use:**
1. **In Dev Review Mode:**
   - Look for the comment input box above action buttons
   - Type your notes and click "Save Comment"
   - Comments are automatically linked to the file

2. **In History Page:**
   - Click the small comment button (💬) next to file names
   - View, edit, or delete your comments
   - See comment count and timestamps

**💡 Pro Tips:**
- Add comments during code review for future reference
- Use comments to track important decisions
- Comments help team collaboration
- All comments are private to your account

**🔒 Privacy:**
- Comments are stored securely in your main Supabase database
- Only you can see your comments
- Comments are linked to specific file conversions`;
  }
  
  // Default response
  return `I'm Cosmo Agents, your AI assistant for all technologies used in this platform! 🚀

**🛠️ Technologies I can help you with:**

**Frontend Development:**
• React.js (v18.3.1) - Components, hooks, state management
• TypeScript (v5.8.3) - Type safety, interfaces, generics
• Vite (v5.4.1) - Build tool, development server, optimization
• Tailwind CSS (v3.4.11) - Utility-first CSS, responsive design
• shadcn/ui - Component library, accessible UI components

**Backend & Database:**
• Supabase (v2.50.2) - PostgreSQL database, authentication, real-time
• Netlify Functions - Serverless backend, API endpoints
• PostgreSQL - Database engine, SQL queries, performance

**AI & Machine Learning:**
• Google Generative AI - Gemini models, AI-powered features
• LangChain (v0.3.66) - AI/ML integration, prompt engineering
• OpenRouter - Multiple AI model access

**Development Tools:**
• Git & GitHub - Version control, collaboration
• Docker - Containerization, deployment
• ESLint - Code quality, linting
• React Query - Server state management

**Database Technologies:**
• Oracle Database - Enterprise database, PL/SQL
• Sybase Database - Legacy database system
• SQL - Standard query language

**Ask me about:**
- How to use React hooks and components
- TypeScript type safety and interfaces
- Supabase authentication and database setup
- Code conversion and migration strategies
- Any programming language or framework
- Best practices and optimization techniques

What would you like to know about? 💡`;
};

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

const CosmoChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isButtonAnimating, setIsButtonAnimating] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Initialize with welcome message on component mount - fresh start every time
  useEffect(() => {
    const welcomeMessage: Message = {
      id: Date.now().toString(),
      role: 'assistant',
      content: `👋 **Welcome to Cosmo Agents!** 

I'm your AI assistant specializing in all the technologies used in this website. I can help you with:

**🛠️ Technologies I know:**
• React.js, TypeScript, Vite, Tailwind CSS
• Supabase, PostgreSQL, Netlify Functions
• Google Generative AI, LangChain
• Git, GitHub, Oracle, Sybase, Python
• And much more!

**💡 What I can do:**
• Answer questions about any technology
• Explain code concepts and best practices
• Help with debugging and troubleshooting
• Provide guidance on features and implementation

Just ask me anything! 🚀`,
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
  }, []); // Empty dependency array means this runs only once on mount

  // Remove localStorage persistence - no longer needed for fresh start
  // useEffect(() => {
  //   const savedHistory = localStorage.getItem('cosmo-chatbot-history');
  //   if (savedHistory) {
  //     try {
  //       const parsedHistory = JSON.parse(savedHistory);
  //       setMessages(parsedHistory);
  //     } catch (error) {
  //       console.error('Error loading chat history:', error);
  //     }
  //   }
  // }, []);

  // Remove localStorage saving - no longer needed
  // useEffect(() => {
  //   if (messages.length > 0) {
  //     localStorage.setItem('cosmo-chatbot-history', JSON.stringify(messages));
  //   }
  // }, [messages]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      console.log('Sending message to chatbot:', userMessage.content);
      
      // Call the chatbot API
      const response = await fetch('/.netlify/functions/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.content
        }),
      });

      console.log('Chatbot response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Chatbot error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
      }

      const data = await response.json();
      console.log('Chatbot response data:', data);
      
      if (data.error) {
        console.error('Chatbot returned error:', data.error);
        throw new Error(data.error);
      }

      if (!data.response || data.response.trim().length === 0) {
        console.error('Chatbot returned empty response');
        throw new Error('AI returned empty response');
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error in chatbot:', error);
      
      // Always use simulated response for any error
      const fallbackContent = getSimulatedResponse(userMessage.content);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: fallbackContent,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const startNewChat = () => {
    const welcomeMessage: Message = {
      id: Date.now().toString(),
      role: 'assistant',
      content: `👋 **Welcome to Cosmo Agents!** 

I'm your AI assistant specializing in all the technologies used in this website. I can help you with:

**🛠️ Technologies I know:**
• React.js, TypeScript, Vite, Tailwind CSS
• Supabase, PostgreSQL, Netlify Functions
• Google Generative AI, LangChain
• Git, GitHub, Oracle, Sybase, Python
• And much more!

**💡 What I can do:**
• Answer questions about any technology
• Explain code concepts and best practices
• Help with debugging and troubleshooting
• Provide guidance on features and implementation

Just ask me anything! 🚀`,
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
    toast({
      title: 'New Chat Started',
      description: 'A fresh conversation has begun.',
    });
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const closeChat = () => {
    setIsOpen(false);
  };

  const handleButtonClick = () => {
    setIsButtonAnimating(true);
    setTimeout(() => {
      setIsOpen(!isOpen);
      setIsButtonAnimating(false);
    }, 200);
  };

  // Add a function to clear chat history (refresh)
  const refreshChat = () => {
    const welcomeMessage: Message = {
      id: Date.now().toString(),
      role: 'assistant',
      content: `👋 **Welcome to Cosmo Agents!** 

I'm your AI assistant specializing in all the technologies used in this website. I can help you with:

**🛠️ Technologies I know:**
• React.js, TypeScript, Vite, Tailwind CSS
• Supabase, PostgreSQL, Netlify Functions
• Google Generative AI, LangChain
• Git, GitHub, Oracle, Sybase, Python
• And much more!

**💡 What I can do:**
• Answer questions about any technology
• Explain code concepts and best practices
• Help with debugging and troubleshooting
• Provide guidance on features and implementation

Just ask me anything! 🚀`,
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
    toast({
      title: 'Chat Refreshed',
      description: 'Chat history has been cleared.',
    });
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  // Add a function to start a new migration
  const startNewMigration = () => {
    setMessages([
      {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'Migration started! Please provide details about your new migration task.',
        timestamp: new Date(),
      },
    ]);
    toast({
      title: 'New Migration',
      description: 'A new migration session has started.',
    });
    setTimeout(() => inputRef.current?.focus(), 100);
  };



  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
      {/* Animated Chat Toggle Button */}
      <div className="pointer-events-auto">
        <Button
          onClick={handleButtonClick}
          size="lg"
          className={`rounded-full w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 shadow-2xl bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 hover:from-blue-700 hover:via-blue-800 hover:to-blue-900 text-white border-4 border-white/30 transition-all duration-500 transform ${
            isButtonAnimating ? 'scale-110 rotate-12' : 'scale-100 rotate-0'
          } ${isOpen ? 'animate-pulse' : 'hover:scale-105'}`}
          style={{
            animationDuration: isOpen ? '2s' : '0.5s'
          }}
        >
          {isOpen ? (
            <X className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 transition-transform duration-300" />
          ) : (
            <div className="relative">
              <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 transition-transform duration-300" />
              <Sparkles className="h-2 w-2 sm:h-3 sm:w-3 md:h-4 md:w-4 absolute -top-1 -right-1 text-yellow-300 animate-pulse" />
            </div>
          )}
        </Button>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="pointer-events-auto mt-2 w-[95vw] max-w-[380px] sm:max-w-[420px] md:max-w-[450px] lg:max-w-[480px] xl:max-w-[500px] rounded-2xl border-2 border-blue-700 shadow-2xl bg-white overflow-hidden flex flex-col" style={{minHeight: '480px', maxHeight: '80vh'}}>
          {/* Header */}
          <div className="relative bg-gradient-to-r from-blue-700 via-blue-800 to-blue-900 border-b-2 border-blue-700 shadow-md">
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Bot className="h-6 w-6 text-white" />
                  <Sparkles className="h-2 w-2 absolute -top-1 -right-1 text-yellow-300 animate-pulse" />
                </div>
                <div className="flex flex-col">
                  <h3 className="text-lg font-bold tracking-wide text-white">Cosmo Agents</h3>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-xs text-blue-100 font-medium">Online & Ready</span>
                  </div>
                </div>
              </div>
              {/* Header Actions */}
              <div className="flex items-center gap-1">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={refreshChat}
                  className="h-8 w-8 p-0 text-white hover:bg-white/20 rounded-full"
                  title="Refresh Chat"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={handleButtonClick}
                  className="h-8 w-8 p-0 text-white hover:bg-white/20 rounded-full"
                  title={isOpen ? "Minimize" : "Expand"}
                >
                  <Minimize2 className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={closeChat}
                  className="h-8 w-8 p-0 text-white hover:bg-white/20 rounded-full"
                  title="Close"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="h-1 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-700 opacity-60"></div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 h-[250px] sm:h-[320px] md:h-[360px] lg:h-[380px] xl:h-[400px] overflow-y-auto p-2 sm:p-3 md:p-4 bg-white">
            {/* Quick Actions */}
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-2">
                <Button
                  onClick={startNewChat}
                  variant="ghost"
                  size="sm"
                  className="text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-100 h-6 px-2"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  New Chat
                </Button>
                                 <Button
                   onClick={startNewMigration}
                   variant="ghost"
                   size="sm"
                   className="text-xs text-green-600 hover:text-green-700 hover:bg-green-100 h-6 px-2"
                 >
                   <Zap className="h-3 w-3 mr-1" />
                   Start New Migration
                 </Button>
              </div>
              <div className="text-xs text-gray-500">
                {messages.length} messages
              </div>
            </div>
            {messages.length === 0 ? (
              // Enhanced Welcome Message
              <div className="text-center py-6 sm:py-8">
                <div className="relative mb-6">
                  <div className="relative">
                    <Bot className="h-16 w-16 sm:h-20 sm:w-20 mx-auto text-blue-600 mb-4" />
                    <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 absolute top-2 right-1/3 text-yellow-500 animate-pulse" />
                    <Zap className="h-2 w-2 sm:h-3 sm:w-3 absolute bottom-2 left-1/3 text-blue-500 animate-pulse" />
                  </div>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3">Welcome to Cosmo Agents</h3>
                <p className="text-sm text-gray-600 mb-6 max-w-xs mx-auto">
                  Cosmo Agents is your comprehensive AI assistant for ALL technologies used in this platform!<br />
                  Ask questions about any programming language, framework, library, or technology.
                </p>
                {/* Feature Cards */}
                <div className="grid grid-cols-1 gap-1.5 sm:gap-2 md:gap-3 mb-3 sm:mb-4 md:mb-6">
                  <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 p-1.5 sm:p-2 md:p-3 bg-blue-50 rounded-xl border border-blue-200">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 md:w-3 md:h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-xs sm:text-sm font-medium text-gray-700">React, TypeScript & Vite</span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 p-1.5 sm:p-2 md:p-3 bg-blue-50 rounded-xl border border-blue-200">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 md:w-3 md:h-3 bg-blue-600 rounded-full"></div>
                    <span className="text-xs sm:text-sm font-medium text-gray-700">Tailwind CSS & shadcn/ui</span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 p-1.5 sm:p-2 md:p-3 bg-blue-50 rounded-xl border border-blue-200">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 md:w-3 md:h-3 bg-blue-700 rounded-full"></div>
                    <span className="text-xs sm:text-sm font-medium text-gray-700">Oracle & Sybase Databases</span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 p-1.5 sm:p-2 md:p-3 bg-blue-50 rounded-xl border border-blue-200">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 md:w-3 md:h-3 bg-blue-800 rounded-full"></div>
                    <span className="text-xs sm:text-sm font-medium text-gray-700">Supabase & PostgreSQL</span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 p-1.5 sm:p-2 md:p-3 bg-blue-50 rounded-xl border border-blue-200">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 md:w-3 md:h-3 bg-blue-900 rounded-full"></div>
                    <span className="text-xs sm:text-sm font-medium text-gray-700">AI/ML & LangChain</span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 p-1.5 sm:p-2 md:p-3 bg-green-50 rounded-xl border border-green-200">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 md:w-3 md:h-3 bg-green-500 rounded-full"></div>
                    <span className="text-xs sm:text-sm font-medium text-gray-700">Git, GitHub & Netlify</span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 p-1.5 sm:p-2 md:p-3 bg-green-50 rounded-xl border border-green-200">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 md:w-3 md:h-3 bg-green-600 rounded-full"></div>
                    <span className="text-xs sm:text-sm font-medium text-gray-700">React Query & State Management</span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 p-1.5 sm:p-2 md:p-3 bg-green-50 rounded-xl border border-green-200">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 md:w-3 md:h-3 bg-green-700 rounded-full"></div>
                    <span className="text-xs sm:text-sm font-medium text-gray-700">Monaco Editor & Code Analysis</span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 p-1.5 sm:p-2 md:p-3 bg-purple-50 rounded-xl border border-purple-200">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 md:w-3 md:h-3 bg-purple-500 rounded-full"></div>
                    <span className="text-xs sm:text-sm font-medium text-gray-700">Any Programming Language</span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 p-1.5 sm:p-2 md:p-3 bg-purple-50 rounded-xl border border-purple-200">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 md:w-3 md:h-3 bg-purple-600 rounded-full"></div>
                    <span className="text-xs sm:text-sm font-medium text-gray-700">Any Framework or Library</span>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-2 sm:gap-3 md:gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span className="hidden sm:inline">Always Available</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3" />
                    <span className="hidden sm:inline">Expert Knowledge</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-2 sm:space-y-3 md:space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-2 py-1.5 sm:px-3 sm:py-2 md:px-4 md:py-3 ${
                        message.role === 'user'
                          ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white'
                          : 'bg-white text-gray-800 border-2 border-blue-200 shadow-sm'
                      }`}
                    >
                      {message.content}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="max-w-[85%] rounded-2xl px-2 py-1.5 sm:px-3 sm:py-2 md:px-4 md:py-3 bg-white text-gray-800 border-2 border-blue-200 shadow-sm">
                      <p>Thinking...</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-2 sm:p-3 md:p-4 bg-white border-t-2 border-blue-700">
            <div className="flex items-center gap-2">
              <Input
                ref={inputRef}
                placeholder="Type your message..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
              />
              <Button
                onClick={sendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 p-0 text-white bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-blue-100"
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CosmoChatbot; 