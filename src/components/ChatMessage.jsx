import React from 'react';
import { FaUser } from 'react-icons/fa';
import { TbSquareRoundedLetterG } from 'react-icons/tb';
import ReactMarkdown from 'react-markdown';

const ChatMessage = ({ message, isStreaming = false }) => {  const isUser = message.role === 'user';
  
  // Format the message content with proper syntax highlighting if needed
  const renderContent = () => {
    // If using markdown formatting
    if (message.content.includes('```') || message.content.includes('#') || 
        message.content.includes('*') || message.content.includes('|')) {
      return (
        <ReactMarkdown 
          className="markdown-content"
          components={{
            // Improved contrast for pre blocks (code blocks)
            pre: ({ node, ...props }) => (
              <pre className="bg-dark p-3 rounded overflow-auto my-2 text-light" {...props} />
            ),
            // Improved contrast for inline code and regular code
            code: ({ node, inline, ...props }) => 
              inline ? 
                <code className="bg-dark px-1 py-0.5 rounded small text-light" {...props} /> : 
                <code className="text-light" {...props} />,
            // Brighter link color for better visibility
            a: ({ node, ...props }) => (
              <a className="text-info" style={{color: '#3cd3a9'}} target="_blank" rel="noopener noreferrer" {...props} />
            ),
            // Ensure headers have good contrast
            h1: ({ node, ...props }) => <h1 className="text-light" {...props} />,
            h2: ({ node, ...props }) => <h2 className="text-light" {...props} />,
            h3: ({ node, ...props }) => <h3 className="text-light" {...props} />,
            h4: ({ node, ...props }) => <h4 className="text-light" {...props} />,
            h5: ({ node, ...props }) => <h5 className="text-light" {...props} />,
            h6: ({ node, ...props }) => <h6 className="text-light" {...props} />,
            // Better contrast for lists
            ul: ({ node, ...props }) => <ul className="text-light ps-4" {...props} />,
            ol: ({ node, ...props }) => <ol className="text-light ps-4" {...props} />,
            li: ({ node, ...props }) => <li className="my-1 text-light" {...props} />,
            // Better table styling
            table: ({ node, ...props }) => <table className="table table-dark table-striped mt-3 mb-4" {...props} />,
            th: ({ node, ...props }) => <th className="p-2 border border-secondary text-light" {...props} />,
            td: ({ node, ...props }) => <td className="p-2 border border-secondary text-light" {...props} />,
            // Better contrast for blockquotes
            blockquote: ({ node, ...props }) => (
              <blockquote 
                className="border-start border-4 border-secondary ps-3 py-0 my-3 text-light opacity-90"
                style={{ borderLeftColor: '#6c757d' }}
                {...props} 
              />
            ),
            // Default paragraph styling
            p: ({ node, ...props }) => <p className="text-light mb-3" {...props} />,
            // Strong and emphasized text
            strong: ({ node, ...props }) => <strong className="text-light fw-bold" {...props} />,
            em: ({ node, ...props }) => <em className="text-light fst-italic" {...props} />,
          }}
        >
          {message.content}
        </ReactMarkdown>
      );
    }
    
    // Plain text with line breaks
    return message.content.split('\n').map((line, i) => (
      <React.Fragment key={i}>
        {line}
        {i < message.content.split('\n').length - 1 && <br />}
      </React.Fragment>
    ));
  };

  return (
    <div className={`py-4 ${!isUser ? 'bg-secondary bg-opacity-10' : ''} ${isStreaming ? 'streaming-message' : ''}`}>
      <div className="container">
        <div className="d-flex gap-3 align-items-start" style={{ maxWidth: '768px', margin: '0 auto' }}>
          {/* Avatar icon with proper contrast */}
          <div className={`flex-shrink-0 rounded d-flex align-items-center justify-content-center ${isUser ? 'bg-secondary' : 'bg-success'}`} style={{ width: '28px', height: '28px' }}>
            {isUser ? 
              <FaUser className="text-white small" /> : 
              <TbSquareRoundedLetterG className="text-white" />
            }
          </div>
          
          {/* Message content with improved contrast */}
          <div className="flex-grow-1">
            {/* Always use light text for both user and assistant messages for consistency */}
            <div className="text-light">
              {renderContent()}
              {isStreaming && (
                <span className="cursor-blink ms-1">▋</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
