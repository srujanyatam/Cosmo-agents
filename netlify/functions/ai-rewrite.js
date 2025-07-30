const fetch = require('node-fetch');

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

// Enable CORS
const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

async function fetchWithRetry(body, maxRetries = 3) {
  let lastError = null;
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });
      const data = await response.json();
      const text = data.choices?.[0]?.message?.content || '';
      if (text && text.trim().length > 0) {
        return { success: true, text };
      }
      lastError = data.error || 'AI did not return a result.';
    } catch (err) {
      lastError = err.message || 'AI rewrite failed';
    }
    // Wait 500ms before retrying
    await new Promise(res => setTimeout(res, 500));
  }
  return { success: false, error: lastError };
}

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
    const { code, prompt } = JSON.parse(event.body);
    if (!code || !prompt) {
      return { 
        statusCode: 400, 
        headers,
        body: JSON.stringify({ error: 'Missing code or prompt' }) 
      };
    }

    const body = {
      model: 'qwen/qwen3-coder:free',
      messages: [
        { role: 'system', content: 'You are a code rewriting assistant. CRITICAL: Return ONLY the rewritten code. NO explanations, NO comments, NO markdown, NO text before or after. ONLY the code. If you include any explanations, the response will be rejected.' },
        { role: 'user', content: `Rewrite this code: ${prompt}\n\n${code}\n\nIMPORTANT: Return ONLY the rewritten code, nothing else.` }
      ],
      temperature: 0.1
    };

    const result = await fetchWithRetry(body, 3);
    if (result.success) {
      return { 
        statusCode: 200, 
        headers,
        body: JSON.stringify({ rewrittenCode: result.text }) 
      };
    } else {
      return { 
        statusCode: 500, 
        headers,
        body: JSON.stringify({ error: result.error || 'AI rewrite failed' }) 
      };
    }
  } catch (error) {
    console.error('AI rewrite error:', error);
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