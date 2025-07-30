const { GoogleGenerativeAI } = require('@google/generative-ai');

exports.handler = async (event, context) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    // Check if it's a POST request
    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        headers,
        body: JSON.stringify({ error: 'Method not allowed' })
      };
    }

    // Parse the request body
    const { message } = JSON.parse(event.body);

    if (!message) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Message is required' })
      };
    }

    // Get the chatbot API key
    const apiKey = process.env.CHATBOT_GEMINI_API_KEY;
    
    if (!apiKey) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          error: 'Chatbot API key not configured. Please set CHATBOT_GEMINI_API_KEY environment variable.' 
        })
      };
    }

    // Initialize Google Generative AI
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    // Create a comprehensive system prompt for the chatbot
    const systemPrompt = `You are Cosmo Agents, an expert AI assistant specializing in the technologies and features used in the Cosmo Agents website. You have deep knowledge of:

**Core Technologies:**
- Git & GitHub workflows, version control, branching strategies
- Oracle Database, PL/SQL, SQL optimization, database design
- Sybase Database, migration strategies, compatibility issues
- Supabase (PostgreSQL), real-time features, authentication, database management
- Python programming, best practices, libraries, frameworks
- React.js, hooks, state management, component architecture
- TypeScript, type safety, interfaces, advanced features
- LangChain, AI/ML integration, prompt engineering, chain management
- APIs (REST, GraphQL), authentication, rate limiting, best practices

**Website Features:**
- Code migration tools (Sybase to Oracle conversion)
- Database schema analysis and optimization
- Performance monitoring and metrics
- Real-time collaboration features
- File upload and processing systems
- Authentication and user management
- Error handling and debugging
- Deployment and CI/CD processes

**Your Role:**
- Provide accurate, helpful answers about these technologies
- Help users understand how these technologies work together
- Offer practical advice for development and troubleshooting
- Explain concepts clearly with examples when appropriate
- Be friendly, professional, and encouraging
- If you don't know something specific, admit it and suggest where to find more information

**Response Style:**
- Be concise but thorough
- Use bullet points for lists when helpful
- Include code examples when relevant
- Explain technical concepts in accessible terms
- Always be helpful and supportive

Remember: You're here to help users understand and work with the technologies that power the Cosmo Agents platform.`;

    // Generate response
    const result = await model.generateContent([
      { role: "user", parts: [{ text: systemPrompt }] },
      { role: "model", parts: [{ text: "I understand. I'm Cosmo Agents, your expert AI assistant for all the technologies and features used in this platform. I'm ready to help with Git, GitHub, Oracle, Sybase, Supabase, Python, React, TypeScript, LangChain, APIs, and everything else related to this website. What would you like to know?" }] },
      { role: "user", parts: [{ text: message }] }
    ]);

    const response = await result.response;
    const text = response.text();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        response: text,
        timestamp: new Date().toISOString()
      })
    };

  } catch (error) {
    console.error('Chatbot error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'An error occurred while processing your request. Please try again.',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      })
    };
  }
}; 