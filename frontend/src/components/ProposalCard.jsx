import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import GlassCard from './GlassCard';

const ProposalCard = ({ receiverName, proposalMessage, onAccept, onReject }) => {
  const [rejectStyle, setRejectStyle] = useState({});
  const [rejectCount, setRejectCount] = useState(0);

  const handleHoverReject = () => {
    if (rejectCount >= 5) {
      return;
    }
    const randomX = (Math.random() - 0.5) * 350;
    const randomY = (Math.random() - 0.5) * 150;
    
    setRejectStyle({
      position: 'relative',
      transform: `translate(${randomX}px, ${randomY}px)`,
      transition: 'all 0.2s ease-out'
    });
    setRejectCount((prev) => prev + 1);
  };

  const executeAccept = () => {
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 }
    });

    const duration = 3 * 1000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 }
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 }
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());

    onAccept();
  };

  return (
    <div className="max-w-xl w-full mx-auto px-4 z-10">
      <GlassCard className="text-center">
        <div className="flex justify-center mb-6 text-5xl animate-bounce">
          💝
        </div>

        <h2 className="text-3xl md:text-4xl font-bold text-rose-700 mb-6 script-font">
          My Sweetest Proposal
        </h2>

        <p className="text-lg text-slate-700 leading-relaxed mb-10 italic">
          "{proposalMessage || 'Every single moment spent with you has been a beautiful dream come true. Will you make me the happiest person and walk this path of life alongside me?'}"
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center min-h-[100px]">
          <button
            onClick={executeAccept}
            className="px-10 py-4 bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-500 hover:to-teal-600 text-white rounded-full font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 z-10"
          >
            YES! I Do ❤️
          </button>

          <button
            style={rejectStyle}
            onMouseEnter={handleHoverReject}
            onClick={onReject}
            className="px-8 py-4 bg-rose-200 hover:bg-rose-300 text-rose-800 rounded-full font-bold text-lg transition-all duration-200"
          >
            {rejectCount < 5 ? 'No, I decline' : 'Okay, No 💔'}
          </button>
        </div>
      </GlassCard>
    </div>
  );
};

export default ProposalCard;
