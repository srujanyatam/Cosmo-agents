# Chatbot Implementation for Oracle AI Migration Tool

## Overview

This chatbot implementation provides an intelligent AI assistant specifically designed to help users with Sybase to Oracle database migrations. The chatbot is built using modern React patterns and integrates with multiple AI models for enhanced assistance.

## Features

### 🤖 AI-Powered Assistance
- **Multi-Model Support**: Choose between Qwen and Gemini AI models
- **Contextual Responses**: AI understands migration-specific queries
- **Code Analysis**: Analyze and explain SQL code snippets
- **Best Practices**: Get Oracle-specific optimization advice

### 💬 Conversation Management
- **Persistent Conversations**: Save and manage chat history
- **Multiple Conversations**: Create and switch between different chat sessions
- **Smart Suggestions**: Context-aware follow-up questions
- **Real-time Responses**: Instant AI-powered assistance

### 🎨 Modern UI/UX
- **Floating Chat Interface**: Non-intrusive chat window
- **Responsive Design**: Works on desktop and mobile devices
- **Dark/Light Theme Support**: Matches your application theme
- **Accessibility**: Keyboard navigation and screen reader support

### ⚙️ Advanced Configuration
- **Model Selection**: Choose your preferred AI model
- **Temperature Control**: Adjust response creativity (0.0 - 1.0)
- **Token Limits**: Configure response length (100 - 2000 tokens)
- **Custom Prompts**: Personalize AI behavior

## Architecture

### Components Structure
```
src/
├── components/
│   ├── Chatbot.tsx              # Main chat interface
│   ├── ChatbotToggle.tsx        # Floating toggle button
│   └── ChatbotSettings.tsx      # Configuration panel
├── contexts/
│   └── ChatbotContext.tsx       # State management
├── api/
│   └── chatbot.ts              # API client
├── types/
│   └── chatbot.ts              # TypeScript definitions
└── netlify/functions/
    └── chatbot.js              # Serverless function
```

### Data Flow
1. **User Input** → Chatbot Component
2. **Message Processing** → ChatbotContext (State Management)
3. **API Call** → Netlify Function (chatbot.js)
4. **AI Processing** → OpenRouter/Gemini APIs
5. **Response** → Back to UI with suggestions

## Installation & Setup

### 1. Environment Variables
Add these to your `.env` file:
```bash
# For OpenRouter API (Qwen model)
OPENROUTER_API_KEY=your_openrouter_api_key

# For Google Gemini API
GOOGLE_API_KEY=your_google_api_key
```

### 2. Dependencies
The chatbot uses these existing dependencies:
- `@google/generative-ai` - Gemini API integration
- `node-fetch` - HTTP requests in Netlify functions
- `uuid` - Unique ID generation
- `lucide-react` - Icons

### 3. Integration
The chatbot is automatically integrated into your app via:
```tsx
// App.tsx
<ChatbotProvider>
  {/* Your app content */}
  <ChatbotToggle />
</ChatbotProvider>
```

## Usage

### Basic Usage
1. **Open Chatbot**: Click the floating message icon in the bottom-right corner
2. **Start Conversation**: Type your question or select a quick suggestion
3. **Get Help**: Ask about:
   - Code explanations
   - Migration strategies
   - Data type mappings
   - Performance optimization
   - Error resolution

### Quick Suggestions
The chatbot provides contextual suggestions:
- "How do I convert Sybase stored procedures to Oracle?"
- "What are the data type mappings between Sybase and Oracle?"
- "How can I optimize Oracle performance?"
- "Explain this code and suggest improvements"

### Advanced Features

#### Code Analysis
```typescript
// Analyze code with context
const response = await analyzeCodeWithChatbot(
  sqlCode,
  'sql',
  'This is a Sybase stored procedure that needs Oracle conversion'
);
```

#### Migration Help
```typescript
// Get specific migration guidance
const help = await getMigrationHelp('stored procedures');
```

#### Custom Configuration
```typescript
// Update chatbot settings
updateConfig({
  model: 'gemini',
  temperature: 0.5,
  maxTokens: 1500
});
```

## API Reference

### ChatbotContext Methods
- `createConversation(title: string)` - Create new chat session
- `addMessage(conversationId: string, message: ChatMessage)` - Add message
- `setCurrentConversation(conversation: ChatConversation | null)` - Switch conversations
- `updateConfig(config: Partial<ChatbotConfig>)` - Update settings
- `deleteConversation(conversationId: string)` - Remove conversation
- `clearConversation(conversationId: string)` - Clear messages

### API Functions
- `sendChatMessage(request: ChatbotRequest)` - Send message to AI
- `analyzeCodeWithChatbot(code: string, language?: string, context?: string)` - Analyze code
- `getMigrationHelp(topic: string)` - Get migration guidance

## Customization

### Styling
The chatbot uses Tailwind CSS classes and can be customized:
```tsx
<Chatbot 
  isOpen={isOpen} 
  onClose={onClose}
  className="custom-chatbot-styles"
/>
```

### AI Models
Add new AI models in `netlify/functions/chatbot.js`:
```javascript
async function callCustomAPI(messages) {
  // Your custom AI integration
}
```

### System Prompts
Customize AI behavior by modifying the system prompt:
```typescript
updateConfig({
  systemPrompt: 'You are a specialized Oracle migration expert...'
});
```

## Troubleshooting

### Common Issues

1. **API Key Errors**
   - Ensure environment variables are set correctly
   - Check API key permissions and quotas

2. **Netlify Function Issues**
   - Verify function deployment
   - Check function logs in Netlify dashboard

3. **UI Not Loading**
   - Ensure ChatbotProvider wraps your app
   - Check for TypeScript compilation errors

### Debug Mode
Enable debug logging:
```typescript
// In chatbot.js
console.log('Debug:', { messages, response });
```

## Performance Considerations

### Optimization Tips
- **Caching**: Implement conversation caching for better performance
- **Rate Limiting**: Add rate limiting to prevent API abuse
- **Message History**: Limit conversation history to prevent memory issues
- **Lazy Loading**: Load chatbot only when needed

### Monitoring
- Track API usage and costs
- Monitor response times
- Log user interactions for improvement

## Security

### Best Practices
- **API Key Protection**: Never expose API keys in client-side code
- **Input Validation**: Sanitize user inputs
- **Rate Limiting**: Prevent abuse of AI APIs
- **Data Privacy**: Don't store sensitive information in conversations

## Future Enhancements

### Planned Features
- [ ] **File Upload**: Upload SQL files for analysis
- [ ] **Voice Input**: Speech-to-text for hands-free operation
- [ ] **Export Conversations**: Save chat history as PDF/HTML
- [ ] **Team Collaboration**: Share conversations with team members
- [ ] **Integration**: Connect with existing migration workflows

### AI Improvements
- [ ] **Fine-tuning**: Custom model training for migration tasks
- [ ] **Multi-language**: Support for different programming languages
- [ ] **Code Generation**: Generate complete Oracle code from Sybase
- [ ] **Validation**: Automatic code validation and testing

## Contributing

### Development Setup
1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables
4. Start development server: `npm run dev`
5. Test chatbot functionality

### Code Style
- Follow existing TypeScript patterns
- Use functional components with hooks
- Maintain consistent naming conventions
- Add proper error handling

## License

This chatbot implementation is part of the Oracle AI Migration Tool and follows the same license terms.

## Support

For issues and questions:
1. Check the troubleshooting section
2. Review existing documentation
3. Create an issue in the repository
4. Contact the development team

---

**Note**: This chatbot is specifically designed for Sybase to Oracle migrations and may not be suitable for other database migration scenarios without customization. 