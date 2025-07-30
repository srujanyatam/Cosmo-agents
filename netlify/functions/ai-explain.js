const fetch = require('node-fetch');

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

// Enable CORS
const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

exports.handler = async function(event, context) {
  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return { 
      statusCode: 405, 
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }) 
    };
  }

  // Check if API key is configured
  if (!OPENROUTER_API_KEY) {
    console.error('OpenRouter API key not configured');
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'OpenRouter API key not configured. Please set OPENROUTER_API_KEY environment variable.' 
      })
    };
  }

  try {
    const { code, language } = JSON.parse(event.body);
    if (!code) {
      return { 
        statusCode: 400, 
        headers,
        body: JSON.stringify({ error: 'Missing code' }) 
      };
    }

    console.log('AI Explain function called with language:', language);
    console.log('Code length:', code.length);
    console.log('API key present:', !!OPENROUTER_API_KEY);
    console.log('API key length:', OPENROUTER_API_KEY.length);

    const body = {
      model: 'qwen/qwen3-coder:free',
      messages: [
        { 
          role: 'system', 
          content: 'You are a helpful AI assistant for code explanation. Provide clear, detailed explanations of what the code does, its purpose, and how it works. Include the code in your explanation and use markdown formatting for better readability.' 
        },
        { 
          role: 'user', 
          content: `Explain what the following ${language || 'code'} does in detail. Include the code in your explanation and explain each part clearly:

\`\`\`${language || 'text'}
${code}
\`\`\`

Please provide a comprehensive explanation including:
1. What the code does overall
2. Key functions and their purposes
3. Important variables and their roles
4. Any notable patterns or techniques used
5. Potential use cases or applications` 
        }
      ],
      temperature: 0.3,
      max_tokens: 2000
    };

    console.log('Sending request to OpenRouter API...');

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    console.log('OpenRouter response status:', response.status);

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenRouter API error:', errorData);
      throw new Error(`OpenRouter API error: ${response.status} - ${errorData}`);
    }

    const data = await response.json();
    console.log('OpenRouter response data keys:', Object.keys(data));
    
    if (data.error) {
      console.error('OpenRouter API returned error:', data.error);
      throw new Error(`OpenRouter API error: ${data.error.message || data.error}`);
    }

    const explanation = data.choices?.[0]?.message?.content || '';
    
    console.log('Explanation generated, length:', explanation.length);
    console.log('Explanation preview:', explanation.substring(0, 200) + '...');

    if (!explanation || explanation.trim().length === 0) {
      console.error('Empty explanation from AI model');
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          error: 'AI model returned empty explanation. Please try again.',
          timestamp: new Date().toISOString()
        })
      };
    }
    
    return { 
      statusCode: 200, 
      headers,
      body: JSON.stringify({ 
        explanation,
        timestamp: new Date().toISOString()
      }) 
    };
  } catch (error) {
    console.error('AI explain error:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      apiKey: OPENROUTER_API_KEY ? 'Present' : 'Missing'
    });
    
    // Return a more specific error message
    let errorMessage = 'An error occurred while processing your request. Please try again.';
    
    if (error.message.includes('API key')) {
      errorMessage = 'API key configuration error. Please check your OPENROUTER_API_KEY.';
    } else if (error.message.includes('quota') || error.message.includes('rate limit')) {
      errorMessage = 'API rate limit exceeded. Please try again later.';
    } else if (error.message.includes('OpenRouter')) {
      errorMessage = 'AI service error. Please try again.';
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