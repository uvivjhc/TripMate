import React, { useState } from 'react';
import ChatBubble from './components/ChatBubble.js';
import ChatInput from './components/ChatInput.js';
import MapCard from './components/MapCard.js';
import './App.css';

/* 메인 */
function App() {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: '어디로 가고 싶으세요?' }
  ]);

  /* const handleSend = (userMessage) => {
    const newMessages = [...messages, { sender: 'user', text: userMessage }];

    // 예시 응답 (향후 서버 연결 예정)
    const botReply = {
      sender: 'bot',
      text: `"${userMessage}" 관련 추천을 분석 중이에요! 아래 추천지를 확인해보세요 👇`,
      card: {
        title: '해운대 해수욕장',
        type: '해변',
        congestion: '중간',
        transport: '부산 1001번 버스, 정류장: 해운대역, 약 25분 소요',
        mapUrl: 'https://maps.google.com/?q=해운대+해수욕장'
      }
    };

    setMessages([...newMessages, botReply]);
  }; */
  const handleSend = async (userMessage) => {
    const newMessages = [...messages, { sender: 'user', text: userMessage }];
    setMessages(newMessages);

    try {
      const response = await fetch('http://localhost:4000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userMessage })
      });
      const data = await response.json();

      const botReply = {
        sender: 'bot',
        text: data.replyText,
        card: data.recommendation
      };

      setMessages([...newMessages, botReply]);
    } catch (error) {
      setMessages([...newMessages, {
        sender: 'bot',
        text: '⚠️ 추천 중 오류가 발생했어요. 다시 시도해주세요!'
      }]);
    }
  };




  return (
    <div className="app-container">
      <h2>🏖 TripMate</h2>
      <div className="chat-box">
        {messages.map((msg, idx) => (
          <div key={idx}>
            <ChatBubble sender={msg.sender} text={msg.text} />
            {msg.card && <MapCard {...msg.card} />}
          </div>
        ))}
      </div>
      <ChatInput onSend={handleSend} />
    </div>
  );
}

export default App;
