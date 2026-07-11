import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import GlassCard from './GlassCard';

const GiftBoxes = ({ onNext }) => {
  const [opened, setOpened] = useState({
    1: false,
    2: false,
    3: false,
    4: false
  });

  const surprises = {
    1: { emoji: '🧸', title: 'Teddy Bear Care', description: 'A cute little cuddle companion representing warmth, comfort, and safety.' },
    2: { emoji: '🌹', title: 'Everlasting Rose', description: 'An elegant red blossom symbolizing deep devotion and unwavering love.' },
    3: { emoji: '✍️', title: 'Romantic Shayari', description: '“Tere chehre se nazar hatti nahi, hum kya karein... Tera rasta badalna chahein toh kadam badalte nahi...”' },
    4: { emoji: '🍫', title: 'Chocolates & Spark', description: 'Sweet bites of absolute joy to cherish the sweet times shared ahead.' }
  };

  const handleOpen = (id) => {
    if (opened[id]) return;
    setOpened((prev) => ({ ...prev, [id]: true }));

    confetti({
      particleCount: 40,
      angle: 90,
      spread: 60,
      origin: { y: 0.8 }
    });
  };

  const allOpened = Object.values(opened).every(Boolean);

  return (
    <div className="max-w-3xl w-full mx-auto px-4 z-10">
      <GlassCard className="text-center">
        <h2 className="text-3xl font-bold text-rose-700 mb-2 script-font">Mystery Gift Boxes</h2>
        <p className="text-sm text-slate-500 mb-8">Tap each mystery romantic box to unwrap special surprises and memories.</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          {[1, 2, 3, 4].map((id) => (
            <div
              key={id}
              onClick={() => handleOpen(id)}
              className={`p-6 rounded-2xl cursor-pointer border transition-all duration-300 text-center flex flex-col justify-center items-center h-48 relative ${
                opened[id]
                  ? 'bg-rose-50 border-rose-300 scale-105 shadow-md'
                  : 'bg-white/50 border-pink-100 hover:border-pink-300 hover:scale-105 shadow-sm'
              }`}
            >
              {!opened[id] ? (
                <div className="flex flex-col items-center">
                  <div className="text-5xl animate-bounce mb-3">🎁</div>
                  <div className="text-xs font-semibold text-rose-500 tracking-wide uppercase">Open Me</div>
                </div>
              ) : (
                <div className="animate-fade-in">
                  <div className="text-4xl mb-2">{surprises[id].emoji}</div>
                  <div className="font-bold text-rose-700 text-sm mb-1">{surprises[id].title}</div>
                  <div className="text-[10px] text-slate-600 leading-relaxed max-h-[80px] overflow-y-auto">
                    {surprises[id].description}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {allOpened ? (
          <button
            onClick={onNext}
            className="px-10 py-3 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white rounded-full font-bold shadow-md transition-all animate-bounce"
          >
            Go to the Big Question 💖
          </button>
        ) : (
          <p className="text-xs text-rose-400 italic">Unwrap all boxes to reveal the final stage...</p>
        )}
      </GlassCard>
    </div>
  );
};

export default GiftBoxes;
