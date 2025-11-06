import React from 'react';
import './ChatBubble.css';

function ChatBubble({ sender, text }) {
  const isUser = sender === 'user';
  return (
    <div className={`chat-bubble ${isUser ? 'user' : 'bot'}`}>
      <p>{text}</p>
    </div>
  );
}

export default ChatBubble;
