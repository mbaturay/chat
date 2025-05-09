import { useState, useEffect } from 'react';
import ChatWindow from './components/ChatWindow';
import MessageInput from './components/MessageInput';
import { sendChatMessage, checkApiKey } from './services/openai';
import './App.css';

// Add console log to verify the component is mounting
console.log('App component mounting');

function App() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [model, setModel] = useState("gpt-3.5-turbo");
  const [apiKeyValid, setApiKeyValid] = useState(true);
  const [streamingMessage, setStreamingMessage] = useState(null);

  // Check if API key is valid on load
  useEffect(() => {
    const validateApiKey = async () => {
      const isValid = await checkApiKey();
      setApiKeyValid(isValid);
      
      if (!isValid) {
        setMessages([{
          role: 'assistant',
          content: 'OpenAI API key is missing or invalid. Please add a valid API key in your .env file (VITE_OPENAI_API_KEY=your_key_here) or create one at <a href="https://platform.openai.com/account/api-keys" target="_blank" rel="noopener noreferrer" class="footer-link">OpenAI API Keys</a>.'
        }]);
      }
    };
    
    validateApiKey();
  }, []);

  // Set up handler for suggested prompts
  useEffect(() => {
    window.sendSuggestedPrompt = (prompt) => {
      handleSendMessage(prompt);
    };
    
    return () => {
      delete window.sendSuggestedPrompt;
    };
  }, [messages]); // Re-create when messages change

  const handleSendMessage = async (content) => {
    if (!apiKeyValid) {
      setMessages([
        ...messages,
        { role: 'user', content },
        { 
          role: 'assistant', 
          content: 'Cannot send message: OpenAI API key is missing or invalid. Please add a valid API key in your .env file (VITE_OPENAI_API_KEY=your_key_here) or create one at <a href="https://platform.openai.com/account/api-keys" target="_blank" rel="noopener noreferrer" class="footer-link">OpenAI API Keys</a>.'
        }
      ]);
      return;
    }
    
    // Add user message to chat
    const userMessage = { role: 'user', content };
    setMessages([...messages, userMessage]);
    
    setIsLoading(true);
    
    try {
      // Create message history for OpenAI API
      const messageHistory = [
        { role: 'system', content: 'You are a helpful assistant.' },
        ...messages,
        userMessage
      ];
      
      // Add a placeholder for the streaming response
      const streamingPlaceholder = { role: 'assistant', content: '' };
      setStreamingMessage(streamingPlaceholder);
      
      // Get response from OpenAI with streaming updates
      const response = await sendChatMessage(
        messageHistory, 
        model,
        (partialResponse) => {
          setStreamingMessage({ ...streamingPlaceholder, content: partialResponse });
        }
      );
      
      // Final update with complete response
      setStreamingMessage(null);
      setMessages(prevMessages => [
        ...prevMessages, 
        { role: 'assistant', content: response }
      ]);
    } catch (error) {
      console.error('Error:', error);
      // Add error message
      setStreamingMessage(null);
      setMessages(prevMessages => [
        ...prevMessages, 
        { role: 'assistant', content: 'Sorry, there was an error processing your request. ' + error.message }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleModelChange = (newModel) => {
    setModel(newModel);
  };

  return (
    <div className="min-vh-100 bg-dark d-flex flex-column">
      {/* Main layout with sidebar and content */}
      <div className="d-flex flex-grow-1">
        {/* Side panel with model selection - hidden on mobile */}
        <div className="d-none d-md-flex flex-column bg-dark border-end border-secondary" style={{ width: '250px' }}>
          <div className="p-3">
            <button 
              onClick={() => setMessages([])}
              className="w-100 d-flex align-items-center gap-2 btn btn-success py-2"
              aria-label="Start a new chat"
            >
              <i className="bi bi-plus"></i>
              New chat
            </button>
          </div>
          
          <div className="px-3 py-2">
            <div className="text-light small text-uppercase px-2 py-2">Models</div>
            <div className="mb-3">
              <div className="p-3 d-flex flex-column rounded bg-dark">
                <div className="d-flex align-items-center">
                  <div className="rounded d-flex align-items-center justify-content-center bg-success me-2" style={{ width: '20px', height: '20px' }}>
                    <i className="bi bi-cpu text-white small"></i>
                  </div>
                  <span className="text-light small fw-medium">GPT-4o</span>
                </div>
                <div className="text-light opacity-75 small mt-1 ms-4">Most capable model, with vision and high intelligence</div>
              </div>
              
              <select 
                value={model} 
                onChange={(e) => handleModelChange(e.target.value)}
                className="form-select form-select-sm mt-2 bg-dark text-light border-secondary"
                aria-label="Select AI model"
              >
                <option value="gpt-3.5-turbo">GPT-3.5 Turbo (Latest)</option>
                <option value="gpt-3.5-turbo-16k">GPT-3.5 Turbo 16K</option>
                <option value="gpt-3.5-turbo-0125">GPT-3.5 Turbo (Jan 2025)</option>
                <option value="gpt-4">GPT-4 (if available)</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Main chat area */}
        <div className="flex-grow-1 d-flex flex-column bg-dark">
          {/* Mobile model selector */}
          <div className="d-flex d-md-none align-items-center justify-content-between px-3 py-2 border-bottom border-secondary">
            <div className="text-light small">GPT-4o</div>
            <select 
              value={model} 
              onChange={(e) => handleModelChange(e.target.value)}
              className="form-select form-select-sm w-auto bg-dark text-light border-0"
              aria-label="Select AI model (mobile)"
            >
              <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
              <option value="gpt-3.5-turbo-16k">GPT-3.5 Turbo 16K</option>
              <option value="gpt-3.5-turbo-0125">GPT-3.5 (Jan 2025)</option>
              <option value="gpt-4">GPT-4</option>
            </select>
          </div>

          <div className="flex-grow-1 overflow-hidden">
            <ChatWindow 
              messages={messages} 
              streamingMessage={streamingMessage}
            />
            <div className="px-3 pb-3">
              <MessageInput 
                onSendMessage={handleSendMessage} 
                isLoading={isLoading} 
              />
              <div className="text-center mt-2 text-light opacity-75 small">
                <p>Not for commercial use. The model may produce inaccurate information. <a href="#" className="footer-link">Model capabilities</a></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
