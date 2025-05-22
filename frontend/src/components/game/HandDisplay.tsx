'use client';

import React from 'react';
import { Card as CardType } from '@/types';
import { Card } from '../cards/Card';
import { cardsToString } from '@/utils/cardUtils';

interface HandDisplayProps {
  cards: CardType[];
  title: string;
  maxCards?: number;
  onRemoveCard?: (index: number) => void;
}

export const HandDisplay: React.FC<HandDisplayProps> = ({
  cards,
  title,
  maxCards,
  onRemoveCard,
}) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">{title}</h3>
        {maxCards && (
          <span className="text-sm text-gray-600">
            {cards.length} of {maxCards} cards
          </span>
        )}
      </div>
      
      {cards.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {cards.map((card, index) => (
            <div key={index} className="relative">
              <Card card={card} />
              
              {onRemoveCard && (
                <button
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                  onClick={() => onRemoveCard(index)}
                  aria-label="Remove card"
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="border border-dashed border-gray-300 dark:border-gray-600 rounded-md p-4 text-center text-gray-500 dark:text-gray-400">
          {maxCards ? `Select up to ${maxCards} cards` : 'No cards selected'}
        </div>
      )}
      
      {cards.length > 0 && (
        <div className="text-sm text-gray-600 dark:text-gray-400">
          <span className="font-medium">Notation:</span> {cardsToString(cards)}
        </div>
      )}
    </div>
  );
};
