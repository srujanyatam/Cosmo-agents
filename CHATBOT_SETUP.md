# Cosmo Agents Chatbot Setup

## Overview
The Cosmo Agents chatbot now uses a dedicated `CHATBOT_GEMINI_API_KEY` for answering questions about the technologies and features used in the website.

## Environment Variables Setup

### For Netlify Backend (Environment Variables)
Add these as **Key/Value pairs** in your Netlify environment variables:

1. **`CHATBOT_GEMINI_API_KEY`** - Your Google Generative AI API key for the chatbot
   - This is used exclusively for the chatbot functionality
   - Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

2. **`VITE_GEMINI_API_KEY`** - Your Google Generative AI API key for code conversion features
   - This is used for the main AI conversion features (Sybase to Oracle conversion)

3. **`OPENROUTER_API_KEY`** - Your OpenRouter API key for Netlify functions
   - This is used for AI explanation and rewriting services

4. **`VITE_SUPABASE_URL`** - Your Supabase project URL
5. **`VITE_SUPABASE_ANON_KEY`** - Your Supabase anonymous key

## Chatbot Features

The chatbot is specifically trained to answer questions about:

### Core Technologies
- **Git & GitHub**: Workflows, version control, branching strategies
- **Oracle Database**: PL/SQL, SQL optimization, database design
- **Sybase Database**: Migration strategies, compatibility issues
- **Supabase**: PostgreSQL, real-time features, authentication, database management
- **Python**: Programming, best practices, libraries, frameworks
- **React.js**: Hooks, state management, component architecture
- **TypeScript**: Type safety, interfaces, advanced features
- **LangChain**: AI/ML integration, prompt engineering, chain management
- **APIs**: REST, GraphQL, authentication, rate limiting, best practices

### Website Features
- Code migration tools (Sybase to Oracle conversion)
- Database schema analysis and optimization
- Performance monitoring and metrics
- Real-time collaboration features
- File upload and processing systems
- Authentication and user management
- Error handling and debugging
- Deployment and CI/CD processes

## How to Use

1. **Deploy your site** with the environment variables configured
2. **Open the chatbot** by clicking the chat button in the bottom-right corner
3. **Ask questions** about any of the technologies or features listed above
4. **Get expert answers** from the AI assistant

## Example Questions

- "How does the Sybase to Oracle conversion work?"
- "What are the best practices for React hooks?"
- "How do I optimize Oracle SQL queries?"
- "What's the difference between Supabase and traditional databases?"
- "How do I set up Git workflows for this project?"
- "What TypeScript features are used in this codebase?"
- "How does the authentication system work?"
- "What are the performance optimization techniques used?"

## Troubleshooting

### Chatbot Not Responding
1. Check that `CHATBOT_GEMINI_API_KEY` is set in Netlify environment variables
2. Verify the API key is valid and has sufficient quota
3. Check the browser console for any error messages

### API Key Issues
- Ensure you're using the correct API key format
- Check that your Google AI Studio account has billing enabled
- Verify the API key has access to the Gemini model

### Deployment Issues
- Make sure all environment variables are set in Netlify
- Check that the Netlify functions are properly deployed
- Verify the function directory structure is correct

## Security Notes

- The `CHATBOT_GEMINI_API_KEY` is only used for the chatbot functionality
- API keys are stored securely in Netlify environment variables
- The chatbot function includes proper error handling and CORS configuration
- No sensitive data is logged or stored in the chatbot responses 