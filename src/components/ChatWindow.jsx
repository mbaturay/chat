import React, { useRef, useEffect } from 'react';
import ChatMessage from './ChatMessage';

const ChatWindow = ({ messages, streamingMessage }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingMessage?.content]);

  // Combine regular messages with the currently streaming message (if any)
  const allMessages = streamingMessage 
    ? [...messages, streamingMessage] 
    : messages;
    
  // Sample suggested prompts that users can click on
  const suggestedPrompts = [
    { title: "Explain quantum physics", desc: "in simple terms", prompt: "Explain quantum physics in simple terms that a high school student could understand." },
    { title: "Write a poem", desc: "about artificial intelligence", prompt: "Write a poem about artificial intelligence and its impact on humanity." },
    { title: "How do I improve", desc: "my React.js skills?", prompt: "What are the best practices for improving my React.js skills? I'm an intermediate developer looking to level up." }
  ];

  // Function to be called when a user clicks on a suggested prompt
  const handleSuggestedPrompt = (prompt) => {
    // This will be passed up to parent components through props
    if (window.sendSuggestedPrompt) {
      window.sendSuggestedPrompt(prompt);
    }
  };

  return (
    <div className="chat-window">
      {allMessages.length === 0 ? (
        <div className="d-flex flex-column align-items-center justify-content-center h-100 text-center text-light px-4">
          <div className="mb-4 rounded-circle bg-success bg-opacity-25 d-flex align-items-center justify-content-center" style={{width: "64px", height: "64px"}}>
            <i className="bi bi-chat-dots text-success" style={{fontSize: "2rem"}}></i>
          </div>
          <h3 className="fs-3 fw-semibold mb-3 text-light">How can I help you today?</h3>
          <p className="text-light opacity-75 mb-4 mx-auto" style={{maxWidth: "500px"}}>
            Send a message to start chatting with the AI assistant.
          </p>
          
          <div className="container">
            <div className="row row-cols-1 row-cols-md-3 g-3" style={{maxWidth: "900px"}}>
              {suggestedPrompts.map((item, i) => (
                <div key={i} className="col">                  <div 
                    className="bg-dark bg-opacity-50 rounded p-3 text-start h-100"
                    style={{cursor: "pointer"}}
                    onClick={() => handleSuggestedPrompt(item.prompt)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSuggestedPrompt(item.prompt)}
                    tabIndex={0}
                    role="button"
                    aria-label={`Suggested prompt: ${item.title} ${item.desc}`}
                  >
                    <h5 className="fw-medium text-light">{item.title}</h5>
                    <p className="text-light opacity-75 small">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="px-3">
          {allMessages.map((message, index) => (
            <ChatMessage 
              key={index} 
              message={message} 
              isStreaming={streamingMessage && index === allMessages.length - 1}
            />
          ))}
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatWindow;
