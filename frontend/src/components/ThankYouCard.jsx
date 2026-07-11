import React from 'react';
import GlassCard from './GlassCard';

const ThankYouCard = ({ status, receiverName }) => {
  const isAccepted = status === 'accepted';

  return (
    <div className="max-w-xl w-full mx-auto px-4 z-10">
      <GlassCard className="text-center">
        <div className="text-6xl mb-6">
          {isAccepted ? '💝' : '🤍'}
        </div>

        <h2 className="text-3xl md:text-4xl font-bold text-rose-700 mb-4 script-font">
          {isAccepted ? 'A Beautiful Beginning!' : 'Thank You'}
        </h2>

        <p className="text-lg text-slate-700 leading-relaxed italic mb-8">
          {isAccepted
            ? `“You have made this experience absolute heaven. Your positive response fills my soul with immense light. Looking forward to our wonderful road of memories together.”`
            : `“Thank you for taking your valuable time to view my special proposal and walk through our memory lane. Your feelings are fully respected, and the bond we share remains absolutely cherished.”`}
        </p>

        <div className="border-t border-rose-100 pt-6">
          <p className="text-xs text-slate-500 uppercase tracking-widest">Logged Decision Status</p>
          <div className="mt-2 text-lg font-bold text-slate-700">
            {isAccepted ? 'Proposal Accepted' : 'Proposal Rejected'}
          </div>
        </div>
      </GlassCard>
    </div>
  );
};

export default ThankYouCard;
