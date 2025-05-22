'use client';

import React from 'react';
import { Card as CardType, GameStage } from '@/types';
import { Card } from '@/components/cards/Card';

interface CommunityCardsProps {
  cards: CardType[];
  stage: GameStage;
  onCardSelect?: (index: number) => void;
  maxCards?: number;
  className?: string;
}

const CommunityCards: React.FC<CommunityCardsProps> = ({
  cards,
  stage,
  onCardSelect,
  maxCards = 5,
  className = '',
}) => {
  // Get the number of visible cards based on the current stage
  const getVisibleCardCount = (stage: GameStage): number => {
    switch (stage) {
      case 'preflop': return 0;
      case 'flop': return 3;
      case 'turn': return 4;
      case 'river': return 5;
      default: return 0;
    }
  };

  const visibleCount = getVisibleCardCount(stage);
  
  // Get the stage name for display
  const getStageName = (stage: GameStage): string => {
    const stageNames: Record<GameStage, string> = {
      'preflop': 'Pre-flop',
      'flop': 'Flop',
      'turn': 'Turn',
      'river': 'River'
    };
    return stageNames[stage];
  };
  
  return (
    <div className={`${className}`}>
      <div className="flex items-center justify-end mb-3">
        <span className="text-sm bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 px-3 py-0.5 rounded-full">
          {getStageName(stage)}
        </span>
      </div>
      
      <div className="p-6 bg-green-800 dark:bg-green-900 rounded-xl shadow-inner border border-green-700 dark:border-green-800">
        <div className="flex justify-center flex-wrap gap-2 sm:gap-4">
          {/* Render existing cards */}
          {cards.map((card, index) => (
            <Card
              key={`community-${index}`}
              card={card}
              size="lg"
              onClick={onCardSelect ? () => onCardSelect(index) : undefined}
              className={index >= visibleCount ? 'opacity-30' : ''}
            />
          ))}
          
          {/* Render empty card slots */}
          {cards.length < maxCards && Array(maxCards - cards.length).fill(0).map((_, index) => (
            <div
              key={`empty-community-${index}`}
              className="w-20 h-28 border-2 border-dashed border-green-600 dark:border-green-700 rounded-md flex items-center justify-center cursor-pointer hover:bg-green-700/20 transition-colors"
              onClick={onCardSelect ? () => onCardSelect(cards.length + index) : undefined}
            >
              <span className="text-green-500 dark:text-green-400 text-2xl">+</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-3 text-center text-sm text-gray-500 dark:text-gray-400">
        {cards.length === 0 ? (
          <span>Click to add community cards</span>
        ) : (
          <span>{cards.length} of {maxCards} cards placed</span>
        )}
      </div>
    </div>
  );
};

export default CommunityCards;
