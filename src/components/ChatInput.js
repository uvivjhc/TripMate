import React, { useState } from 'react';
import './ChatInput.css';

function ChatInput({ onSend }) {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() === '') return;
    onSend(input);
    setInput('');
  };

  return (
    <form onSubmit={handleSubmit} className="chat-input">
      <input
        type="text"
        placeholder="예: 해변과 커피가 있는 곳으로 가고 싶어"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button type="submit">전송</button>
    </form>
  );
}

export default ChatInput;
