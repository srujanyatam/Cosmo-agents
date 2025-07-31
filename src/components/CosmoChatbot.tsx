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
  Minimize2,
  Copy,
  Check
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
      return `**React Hooks** are functions for functional components:

• **useState** - Component state
• **useEffect** - Side effects & lifecycle
• **useContext** - React context access
• **useRef** - Mutable references

\`\`\`jsx
const [count, setCount] = useState(0);
useEffect(() => {
  document.title = \`Count: \${count}\`;
}, [count]);
\`\`\`

Used extensively in your project for state management and UI interactions.`;
    }
    return `**React.js** - JavaScript library for building UIs.

**Key Features in Your Project:**
• Component architecture with TypeScript
• State management with hooks
• Routing with React Router DOM
• Styling with Tailwind CSS + shadcn/ui

**Project Setup:**
- React 18.3.1 with TypeScript
- Functional components with hooks
- Type-safe development`;
  }
  
  // TypeScript questions
  if (message.includes('typescript')) {
    return `**TypeScript** - JavaScript with static typing.

**Benefits in Your Project:**
• Type safety at compile time
• Better IDE support & IntelliSense
• Interface definitions for data structures
• Safer refactoring

\`\`\`typescript
interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}
\`\`\`

**Version:** TypeScript 5.8.3`;
  }
  
  // Supabase questions
  if (message.includes('supabase')) {
    return `**Supabase** - Open-source Firebase alternative.

**Core Features:**
• PostgreSQL database with real-time
• Authentication with multiple providers
• File storage and management
• Row-level security (RLS)

**In Your Project:**
- User authentication (sign up/login)
- Database for conversion logs
- Real-time deployment updates
- File management

**Configuration:**
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

  // Git and GitHub questions
  if (message.includes('git') || message.includes('github')) {
    if (message.includes('difference') || message.includes('vs') || message.includes('compare')) {
      return `**Git vs GitHub Comparison:**

| Feature | Git | GitHub |
|---------|-----|--------|
| **Type** | Version control system | Web-based hosting platform |
| **Purpose** | Local code version management | Remote repository hosting |
| **Functionality** | Tracks changes, creates branches, merges code | Provides Git hosting with collaboration features |
| **Location** | Installed on your computer | Cloud-based service |
| **Features** | Commit, branch, merge, log | Issues, pull requests, wikis, actions |
| **Collaboration** | Basic merging capabilities | Advanced team collaboration tools |
| **Cost** | Free and open source | Free for public repos, paid for private |

**In Cosmo Agents:**
- **Git** is used for local version control
- **GitHub** hosts the project repository
- Both work together for seamless development workflow`;
    }
    
    if (message.includes('git')) {
      return `**Git - Version Control System:**

**🎯 What is Git?**
Git is a distributed version control system that tracks changes in your code files. It's essential for modern software development.

**✨ Key Features:**
• **Version Tracking** - Keep history of all code changes
• **Branching** - Work on features without affecting main code
• **Merging** - Combine changes from different branches
• **Collaboration** - Multiple developers can work together
• **Backup** - Your code is safely stored with full history

**🔧 Basic Git Commands:**
\`\`\`bash
git init          # Start a new repository
git add .         # Stage files for commit
git commit -m "message"  # Save changes with message
git push          # Upload changes to remote repository
git pull          # Download changes from remote
git branch        # List all branches
git checkout -b feature  # Create and switch to new branch
\`\`\`

**💡 In Cosmo Agents Project:**
- Git tracks all your code changes
- Each feature is developed in separate branches
- Changes are committed with descriptive messages
- Code is pushed to GitHub for backup and collaboration

**🚀 Benefits:**
- Never lose your work
- Work on multiple features simultaneously
- Collaborate with team members
- Roll back to previous versions if needed`;
    }
    
    if (message.includes('github')) {
      return `**GitHub - Code Hosting Platform:**

**🎯 What is GitHub?**
GitHub is a web-based platform that hosts Git repositories and provides collaboration tools for developers.

**✨ Key Features:**
• **Repository Hosting** - Store your code in the cloud
• **Collaboration Tools** - Work with teams effectively
• **Issue Tracking** - Manage bugs and feature requests
• **Pull Requests** - Review code before merging
• **GitHub Actions** - Automate workflows and deployments
• **Wikis & Documentation** - Project documentation

**🔧 GitHub Workflow:**
1. **Create Repository** - Start a new project
2. **Clone Repository** - Download to your computer
3. **Make Changes** - Edit code locally
4. **Commit & Push** - Upload changes to GitHub
5. **Create Pull Request** - Request code review
6. **Merge Changes** - Integrate approved code

**💡 In Cosmo Agents Project:**
- Repository: \`https://github.com/srujanyatam/Cosmo-agents\`
- Used for version control and collaboration
- GitHub Actions for automated deployment
- Issues for bug tracking and feature requests

**🚀 Benefits:**
- Free hosting for public repositories
- Excellent collaboration tools
- Integration with CI/CD pipelines
- Large developer community`;
    }
  }

  // Python questions
  if (message.includes('python')) {
    return `**Python in Cosmo Agents:**

**🎯 What is Python?**
Python is a high-level, interpreted programming language known for its simplicity and readability.

**✨ Key Features:**
• **Easy to Learn** - Simple syntax and clear structure
• **Versatile** - Web development, data science, automation
• **Rich Ecosystem** - Extensive libraries and frameworks
• **Cross-platform** - Runs on Windows, macOS, Linux

**🔧 In Cosmo Agents Project:**
- **AI Integration** - Python scripts for AI model processing
- **Data Processing** - Handle large datasets and conversions
- **Automation** - Automated testing and deployment scripts
- **Backend Services** - API development and data analysis

**💡 Common Use Cases:**
- Data analysis and visualization
- Web development with Django/Flask
- Machine learning and AI
- Automation and scripting
- API development

**🚀 Benefits:**
- Rapid development and prototyping
- Excellent for beginners
- Strong community support
- Extensive library ecosystem`;
  }

  // SQL questions
  if (message.includes('sql')) {
    return `**SQL - Structured Query Language:**

**🎯 What is SQL?**
SQL is a standard language for managing and manipulating relational databases.

**✨ Key Features:**
• **Data Querying** - Retrieve data from databases
• **Data Manipulation** - Insert, update, delete records
• **Data Definition** - Create and modify database structures
• **Data Control** - Manage user permissions and security

**🔧 In Cosmo Agents Project:**
- **Supabase Database** - PostgreSQL with SQL queries
- **Data Storage** - Store user data and conversion logs
- **Real-time Queries** - Live data updates and subscriptions
- **Performance Optimization** - Efficient database queries

**💡 Common SQL Commands:**
\`\`\`sql
SELECT * FROM users WHERE id = 1;
INSERT INTO conversions (file_name, status) VALUES ('test.sql', 'completed');
UPDATE users SET last_login = NOW() WHERE id = 1;
DELETE FROM logs WHERE created_at < '2024-01-01';
\`\`\`

**🚀 Benefits:**
- Standard language across all databases
- Powerful data manipulation capabilities
- Excellent performance for large datasets
- Strong data integrity and consistency`;
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

  // General programming questions
  if (message.includes('programming') || message.includes('coding') || message.includes('development')) {
    return `**💻 Programming & Development:**

**🎯 What is Programming?**
Programming is the process of creating instructions for computers to follow. It involves writing code in programming languages to solve problems and build applications.

**✨ Key Concepts:**
• **Algorithms** - Step-by-step problem-solving procedures
• **Data Structures** - Ways to organize and store data
• **Logic** - Making decisions and controlling program flow
• **Debugging** - Finding and fixing errors in code

**🔧 Popular Programming Languages:**
• **Python** - Great for beginners, data science, AI
• **JavaScript** - Web development, frontend and backend
• **Java** - Enterprise applications, Android development
• **C++** - System programming, game development
• **C#** - Windows applications, game development with Unity

**💡 Getting Started:**
1. Choose a language based on your goals
2. Learn basic syntax and concepts
3. Practice with small projects
4. Build a portfolio of work
5. Join coding communities

**🚀 Best Practices:**
- Write clean, readable code
- Use meaningful variable names
- Comment your code
- Test thoroughly
- Keep learning and practicing`;
  }

  // General technology questions
  if (message.includes('technology') || message.includes('tech') || message.includes('software')) {
    return `**🔧 Technology & Software:**

**🎯 What is Technology?**
Technology refers to tools, systems, and methods used to solve problems and improve human life. In software, it includes programming languages, frameworks, and tools.

**✨ Key Areas:**
• **Web Development** - Building websites and web applications
• **Mobile Development** - Creating apps for smartphones
• **Data Science** - Analyzing and interpreting data
• **Artificial Intelligence** - Creating intelligent systems
• **Cloud Computing** - Using remote servers and services

**🔧 Modern Tech Stack:**
• **Frontend** - React, Vue, Angular (user interfaces)
• **Backend** - Node.js, Python, Java (server-side logic)
• **Databases** - MySQL, PostgreSQL, MongoDB (data storage)
• **Cloud** - AWS, Google Cloud, Azure (hosting and services)

**💡 Learning Path:**
1. Start with fundamentals (HTML, CSS, JavaScript)
2. Learn a framework (React, Vue, etc.)
3. Explore backend development
4. Understand databases and APIs
5. Learn about DevOps and deployment

**🚀 Industry Trends:**
- Artificial Intelligence and Machine Learning
- Cloud-native applications
- Mobile-first development
- Cybersecurity and privacy
- Sustainable technology`;
  }
  
  // Default response
  return `I'm Cosmo Agents, your AI assistant! 🚀

I can help you with any programming, technology, or general questions you might have. Feel free to ask me about:

**Programming & Development:**
• Any programming language (Python, JavaScript, Java, C++, etc.)
• Web development frameworks and libraries
• Database technologies and SQL
• Cloud platforms and services
• DevOps and deployment strategies

**Technology & Tools:**
• Software development methodologies
• Best practices and design patterns
• Debugging and troubleshooting
• Performance optimization
• Security best practices

**General Questions:**
• Technology concepts and explanations
• Learning resources and tutorials
• Industry trends and insights
• Problem-solving approaches

**Project-Specific Help:**
• React, TypeScript, and modern web development
• Database migration and conversion
• AI/ML integration and implementation
• Code analysis and optimization

What would you like to know about? I'm here to help with anything! 💡`;
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
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Copy message to clipboard
  const copyMessage = async (content: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedMessageId(messageId);
      toast({
        title: 'Copied!',
        description: 'Message copied to clipboard.',
      });
      setTimeout(() => setCopiedMessageId(null), 2000);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to copy message.',
        variant: 'destructive',
      });
    }
  };

  // Auto-scroll to bottom when new messages are added
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize with welcome message on component mount - fresh start every time
  useEffect(() => {
    const welcomeMessage: Message = {
      id: Date.now().toString(),
      role: 'assistant',
      content: `👋 **Hi! I'm your AI assistant.**

I can help with React, TypeScript, Supabase, and all technologies used in this project.

Ask me anything! 🚀`,
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
            <div className="flex items-center justify-between mt-2 mb-3">
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
                  Migration
                </Button>
              </div>
              <div className="text-xs text-gray-500">
                {messages.length} messages
              </div>
            </div>
            
            {/* Quick Question Buttons */}
            {messages.length === 1 && (
              <div className="flex flex-wrap gap-2 mb-3">
                <Button
                  onClick={() => setInputMessage("How do I use React hooks?")}
                  variant="outline"
                  size="sm"
                  className="text-xs h-7 px-2"
                >
                  React Hooks
                </Button>
                <Button
                  onClick={() => setInputMessage("Explain TypeScript")}
                  variant="outline"
                  size="sm"
                  className="text-xs h-7 px-2"
                >
                  TypeScript
                </Button>
                <Button
                  onClick={() => setInputMessage("How to use Supabase?")}
                  variant="outline"
                  size="sm"
                  className="text-xs h-7 px-2"
                >
                  Supabase
                </Button>
                <Button
                  onClick={() => setInputMessage("Code conversion features")}
                  variant="outline"
                  size="sm"
                  className="text-xs h-7 px-2"
                >
                  Code Conversion
                </Button>
              </div>
            )}
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
                      <div 
                        className={`${
                          message.role === 'assistant' ? 'chatbot-message' : ''
                        } prose prose-sm max-w-none`}
                        style={{
                          lineHeight: '1.5',
                          fontSize: '14px'
                        }}
                      >
                        {message.content}
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <div className="text-xs text-gray-400">
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        {message.role === 'assistant' && (
                          <Button
                            onClick={() => copyMessage(message.content, message.id)}
                            variant="ghost"
                            size="sm"
                            className="h-5 w-5 p-0 text-gray-400 hover:text-gray-600"
                          >
                            {copiedMessageId === message.id ? (
                              <Check className="h-3 w-3" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="max-w-[85%] rounded-2xl px-2 py-1.5 sm:px-3 sm:py-2 md:px-4 md:py-3 bg-white text-gray-800 border-2 border-blue-200 shadow-sm">
                      <div className="flex items-center gap-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                        <span className="text-sm text-gray-600">AI is thinking...</span>
                      </div>
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