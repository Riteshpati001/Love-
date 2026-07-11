import React, { useEffect, useState } from 'react';

const FloatingHearts = () => {
  const [hearts, setHearts] = useState([]);

  useEffect(() => {
    const symbols = ['❤️', '💖', '💝', '💕', '💗'];
    const generatedHearts = Array.from({ length: 25 }).map((_, index) => {
      const left = Math.random() * 100;
      const duration = 6 + Math.random() * 8;
      const size = 12 + Math.random() * 20;
      const delay = Math.random() * 10;
      const char = symbols[Math.floor(Math.random() * symbols.length)];

      return { id: index, left, duration, size, delay, char };
    });
    setHearts(generatedHearts);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {hearts.map((heart) => (
        <div
          key={heart.id}
          className="absolute bottom-0 animate-float-heart"
          style={{
            left: `${heart.left}%`,
            animationDuration: `${heart.duration}s`,
            animationDelay: `${heart.delay}s`,
            fontSize: `${heart.size}px`,
          }}
        >
          {heart.char}
        </div>
      ))}
    </div>
  );
};

export default FloatingHearts;
