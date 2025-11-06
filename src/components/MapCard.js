import React from 'react';
import './MapCard.css';

function MapCard({ title, type, congestion, transport, mapUrl }) {
  return (
    <div className="map-card">
      <h4>{title}</h4>
      <p>유형: {type}</p>
      <p>혼잡도: {congestion}</p>
      <p>이동 수단: {transport}</p>
      <a href={mapUrl} target="_blank" rel="noopener noreferrer">🗺 지도 보기</a>
    </div>
  );
}

export default MapCard;
