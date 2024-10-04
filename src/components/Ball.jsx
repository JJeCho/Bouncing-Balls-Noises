// src/components/Ball.jsx
import React from 'react';

const Ball = ({ position, circleRadius, ballRadius, color }) => {
  const left = circleRadius + position.x - ballRadius;
  const top = circleRadius + position.y - ballRadius;

  return (
    <div
      style={{
        position: 'absolute',
        left: `${left}px`,
        top: `${top}px`,
        width: `${ballRadius * 2}px`,
        height: `${ballRadius * 2}px`,
        backgroundColor: color,
        borderRadius: '50%',
      }}
    />
  );
};

export default Ball;
