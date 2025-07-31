const fetch = require('node-fetch');

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const GOOGLE_API_KEY = process.env.VITE_GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

const SYSTEM_PROMPT = `You are an expert Oracle database migration assistant specializing in Sybase to Oracle conversions. You help users with:

1. Code explanations and analysis
2. Migration best practices and strategies
3. Data type mapping between Sybase and Oracle
4. Syntax conversion help
5. Error resolution and debugging
6. Performance optimization tips
7. Oracle-specific features and recommendations

Always provide clear, actionable advice. When showing code examples, use proper syntax highlighting. Be concise but thorough. If you're unsure about something, say so rather than guessing.

Current context: You're helping with a Sybase to Oracle migration project.`;

async function callOpenRouterAPI(messages, model = 'qwen/qwen3-coder:free') {
  const body = {
    model: model,
    messages: messages,
    temperature: 0.7,
    max_tokens: 1000
  };

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || 'Sorry, I couldn\'t generate a response.';
  } catch (error) {
    console.error('OpenRouter API error:', error);
    throw error;
  }
}

async function callGeminiAPI(messages) {
  const lastUserMessage = messages.filter(m => m.role === 'user').pop()?.content || '';
  
  const body = {
    contents: [{
      parts: [{
        text: SYSTEM_PROMPT + '\n\nUser: ' + lastUserMessage
      }]
    }]
  };

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GOOGLE_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I couldn\'t generate a response.';
  } catch (error) {
    console.error('Gemini API error:', error);
    throw error;
  }
}

function extractIntent(userMessage) {
  const message = userMessage.toLowerCase();
  
  if (message.includes('explain') || message.includes('what does') || message.includes('how does')) {
    return 'code_explanation';
  }
  if (message.includes('migrate') || message.includes('convert') || message.includes('oracle')) {
    return 'migration_help';
  }
  if (message.includes('data type') || message.includes('varchar') || message.includes('int')) {
    return 'data_type_mapping';
  }
  if (message.includes('syntax') || message.includes('error') || message.includes('fix')) {
    return 'syntax_help';
  }
  if (message.includes('performance') || message.includes('optimize') || message.includes('fast')) {
    return 'best_practices';
  }
  
  return 'general_question';
}

function generateSuggestions(intent) {
  const suggestions = {
    code_explanation: [
      "Can you show me the converted Oracle version?",
      "What are the key differences between Sybase and Oracle?",
      "How can I optimize this code for Oracle?"
    ],
    migration_help: [
      "What are the main challenges in Sybase to Oracle migration?",
      "How do I handle stored procedures?",
      "What about triggers and functions?"
    ],
    data_type_mapping: [
      "Show me the complete data type mapping table",
      "How do I handle TEXT and IMAGE types?",
      "What about custom data types?"
    ],
    syntax_help: [
      "How do I convert Sybase date functions?",
      "What's the Oracle equivalent of @@IDENTITY?",
      "How do I handle temporary tables?"
    ],
    best_practices: [
      "What are Oracle performance best practices?",
      "How do I use bulk operations?",
      "What about indexing strategies?"
    ],
    general_question: [
      "How do I start a migration project?",
      "What tools do you recommend?",
      "Can you explain the migration process?"
    ]
  };
  
  return suggestions[intent] || suggestions.general_question;
}

exports.handler = async function(event, context) {
  // Add CORS headers for browser requests
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  // Add a simple GET endpoint for testing
  if (event.httpMethod === 'GET') {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: 'Chatbot function is running!',
        status: 'ok',
        timestamp: new Date().toISOString(),
        hasOpenRouterKey: !!OPENROUTER_API_KEY,
        hasGoogleKey: !!GOOGLE_API_KEY
      })
    };
  }

  if (event.httpMethod !== 'POST') {
    return { 
      statusCode: 405, 
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }) 
    };
  }

  // Check if API keys are configured
  if (!OPENROUTER_API_KEY && !GOOGLE_API_KEY) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'API keys not configured. Please set OPENROUTER_API_KEY or VITE_GEMINI_API_KEY environment variables in Netlify.' 
      })
    };
  }

  try {
    const { message, conversationHistory = [], model = 'qwen' } = JSON.parse(event.body);
    
    if (!message) {
      return { 
        statusCode: 400, 
        headers,
        body: JSON.stringify({ error: 'Missing message' }) 
      };
    }

    // Extract intent from user message
    const intent = extractIntent(message);
    
    // Prepare conversation history for API
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...conversationHistory.map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      { role: 'user', content: message }
    ];

    // Call appropriate API based on model preference
    let response;
    if (model === 'gemini' && GOOGLE_API_KEY) {
      response = await callGeminiAPI(messages);
    } else {
      response = await callOpenRouterAPI(messages);
    }

    // Generate contextual suggestions
    const suggestions = generateSuggestions(intent);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: response,
        intent: intent,
        suggestions: suggestions,
        timestamp: new Date().toISOString()
      })
    };

  } catch (error) {
    console.error('Chatbot error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Failed to process message',
        details: error.message
      })
    };
  }
}; 