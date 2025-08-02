const fetch = require('node-fetch');

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

    // Get the Chatbot OpenRouter API key
    const apiKey = process.env.CHATBOT_OPENROUTER_API_KEY;
    
    console.log('Chatbot function called with message:', message.substring(0, 100) + '...');
          console.log('Chatbot OpenRouter API key present:', !!apiKey);
    console.log('API key length:', apiKey ? apiKey.length : 0);
    
    if (!apiKey) {
      console.error('Chatbot OpenRouter API key not configured');
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          error: 'Chatbot OpenRouter API key not configured. Please set CHATBOT_OPENROUTER_API_KEY environment variable.' 
        })
      };
    }

    // Create a comprehensive system prompt for the chatbot
    const systemPrompt = `You are Cosmo Agents, a precise and accurate AI assistant for the Cosmo Agents website. You specialize in the EXACT technologies used in this project.

**Core Technologies (ONLY answer about these):**
• **React.js** - Component architecture, hooks, state management
• **TypeScript** - Type safety, interfaces, generics
• **Vite** - Build tool, development server, optimization
• **Tailwind CSS** - Utility-first styling, responsive design
• **Supabase** - PostgreSQL database, authentication, real-time
• **Netlify Functions** - Serverless backend, API endpoints
• **Google Generative AI** - AI-powered code conversion
• **LangChain** - AI/ML integration, prompt engineering
• **Git/GitHub** - Version control, collaboration
• **Oracle/Sybase** - Database migration, legacy systems
• **Python** - AI integration, data processing
• **SQL** - Database queries, optimization

**Your Role:**
• Answer questions about Cosmo Agents technologies ONLY
• Provide accurate, concise explanations
• Give practical code examples when relevant
• Be direct and to the point
• If asked about other technologies, politely redirect

**Response Guidelines:**
• Keep answers focused and precise (2-4 sentences for simple questions)
• Use bullet points for lists
• Include code examples when helpful
• Use proper markdown formatting
• Add line breaks between sections

**Important Rules:**
1. ONLY help with Cosmo Agents technologies listed above
2. For other technologies, say: "I can only help with Cosmo Agents technologies (React, TypeScript, Supabase, etc.). Please ask about those instead!"
3. Keep responses concise and accurate
4. Use proper formatting with line breaks

**Formatting:**
- Use **bold** for emphasis
- Use \`code\` for inline code
- Use \`\`\` for code blocks
- Add line breaks between sections
- Use bullet points for lists

Remember: You're here to help users understand and work with the Cosmo Agents platform technologies.`;

    // Generate response using OpenRouter API
    console.log('Generating response for message:', message.substring(0, 100) + '...');
    
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://cosmoagents.netlify.app',
        'X-Title': 'Cosmo Agents Chatbot'
      },
      body: JSON.stringify({
        model: 'openai/gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: message
          }
        ],
        max_tokens: 600,
        temperature: 0.3
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter API error:', response.status, errorText);
      throw new Error(`OpenRouter API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('OpenRouter response received');
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('Invalid response format from OpenRouter');
      throw new Error('Invalid response format from AI model');
    }

    const text = data.choices[0].message.content;
    
    console.log('Response generated successfully, length:', text.length);
    console.log('Response preview:', text.substring(0, 200) + '...');

    if (!text || text.trim().length === 0) {
      console.error('Empty response from AI model');
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          error: 'AI model returned empty response. Please try again.',
          timestamp: new Date().toISOString()
        })
      };
    }

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
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      apiKey: process.env.CHATBOT_OPENROUTER_API_KEY ? 'Present' : 'Missing',
      model: 'openai/gpt-4o-mini'
    });
    
    // Return a more specific error message
    let errorMessage = 'An error occurred while processing your request. Please try again.';
    
    if (error.message.includes('API key')) {
      errorMessage = 'API key configuration error. Please check your CHATBOT_OPENROUTER_API_KEY.';
    } else if (error.message.includes('quota') || error.message.includes('rate limit')) {
      errorMessage = 'API rate limit exceeded. Please try again later.';
    } else if (error.message.includes('model')) {
      errorMessage = 'AI model error. Please try again.';
    }
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
        timestamp: new Date().toISOString()
      })
    };
  }
}; 