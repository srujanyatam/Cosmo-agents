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

    const body = {
      model: 'qwen/qwen3-coder:free',
      messages: [
        { role: 'system', content: 'You are a helpful AI assistant for code explanation.' },
        { role: 'user', content: `Explain what the following code does in plain English. Include the code in your explanation, but do not use markdown or code fences.\n\nCode:\n${code}` }
      ]
    };

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();
    const explanation = data.choices?.[0]?.message?.content || '';
    
    return { 
      statusCode: 200, 
      headers,
      body: JSON.stringify({ explanation }) 
    };
  } catch (error) {
    console.error('AI explain error:', error);
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