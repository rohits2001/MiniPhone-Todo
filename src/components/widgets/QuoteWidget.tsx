import React from 'react';

export const QuoteWidget: React.FC = () => {
  // Mock quote data (replace with real API data later)
  const quote = {
    text: "Stay hungry, stay foolish.",
    author: "Steve Jobs"
  };

  return (
    <div className="h-full">
      <div className="flex items-center justify-center h-full px-3">
        <p className="text-[11px] italic">"{quote.text}" <span className="text-[10px] opacity-60 ml-1">— {quote.author}</span></p>
      </div>
    </div>
  );
};
