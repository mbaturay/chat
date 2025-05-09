import React, { useState, useEffect, useRef } from 'react';
import { FaPaperPlane } from 'react-icons/fa';
import { FaMicrophone } from 'react-icons/fa';
import { BsThreeDots } from 'react-icons/bs';
import { FiSearch } from 'react-icons/fi';
import { BsPlusLg, BsImages } from 'react-icons/bs';

const MessageInput = ({ onSendMessage, isLoading }) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef(null);

  // Auto-resize the textarea as content grows
  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    // Reset height to auto to get the correct scrollHeight
    textarea.style.height = 'auto';
    
    // Set the height to the scrollHeight (content height)
    const newHeight = Math.min(textarea.scrollHeight, 200); // Max height of 200px
    textarea.style.height = `${newHeight}px`;
  };

  // Adjust height when message changes
  useEffect(() => {
    adjustTextareaHeight();
  }, [message]);

  // Focus the input when the component mounts
  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message);
      setMessage('');
      
      // Reset textarea height after sending
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.style.height = 'auto';
        }
      }, 0);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="position-relative">
      <div className="position-relative w-100 bg-dark rounded shadow border border-secondary border-opacity-25">
        {/* Button tray above input field on mobile */}
        <div className="d-md-none d-flex align-items-center justify-content-center gap-2 position-absolute" style={{ top: '-3rem', left: '50%', transform: 'translateX(-50%)' }}>
          <button type="button" className="btn btn-dark rounded-circle p-2">
            <BsPlusLg className="text-light" />
          </button>
          <button type="button" className="btn btn-dark rounded-circle p-2">
            <FiSearch className="text-light" />
          </button>
          <button type="button" className="btn btn-dark rounded-circle p-2">
            <BsImages className="text-light" />
          </button>
        </div>

        {/* Input field and buttons */}
        <div className="d-flex align-items-center">
          <button type="button" className="btn btn-link text-light p-3 d-none d-md-block" 
                  aria-label="Add attachments">
            <BsPlusLg />
          </button>
          
          <div className="position-relative flex-grow-1">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Message ChatGPT…"
              className="form-control bg-transparent text-light border-0 py-3 px-3"
              style={{ minHeight: '44px', maxHeight: '200px', resize: 'none' }}
              rows={1}
              disabled={isLoading}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
            {isLoading && (
              <div className="position-absolute end-0 bottom-0 p-3 typing-indicator">
                <div></div>
                <div></div>
                <div></div>
              </div>
            )}
          </div>
          
          <div className="d-flex align-items-center">
            <button 
              type="button" 
              className="btn btn-link text-light p-2 d-none d-md-block"
              title="Attach files"
              aria-label="Attach files"
            >
              <BsImages />
            </button>
            
            <button 
              type="button"
              className="btn btn-link text-light p-2 d-none d-md-block"
              title="Voice input"
              aria-label="Voice input"
            >
              <FaMicrophone />
            </button>
            
            <button 
              type="submit" 
              className="btn btn-link text-success p-3"
              disabled={!message.trim() || isLoading}
              aria-label="Send message"
            >
              <FaPaperPlane />
            </button>
          </div>
        </div>
      </div>
      
      {/* Screen reader text for better accessibility */}
      <span className="visually-hidden">
        {isLoading ? "Message is being processed" : "Type a message and press Enter to send"}
      </span>
    </form>
  );
};

export default MessageInput;
