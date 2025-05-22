'use client';

import React from 'react';
import { Card as CardType, HandRank } from '@/types';
import { Card } from '@/components/cards/Card';

interface PlayerHandProps {
  playerName: string;
  cards: CardType[];
  isCurrentPlayer?: boolean;
  winPercentage?: number;
  bestHand?: HandRank;
  className?: string;
}

const PlayerHand: React.FC<PlayerHandProps> = ({
  playerName,
  cards,
  isCurrentPlayer = false,
  winPercentage,
  bestHand,
  className = '',
}) => {
  // Function to return a human-readable hand rank
  const getHandRankDisplay = (rank?: HandRank): string => {
    if (!rank) return 'Unknown';
    
    const rankMap: Record<HandRank, string> = {
      'high_card': 'High Card',
      'pair': 'Pair',
      'two_pair': 'Two Pair',
      'three_of_a_kind': 'Three of a Kind',
      'straight': 'Straight',
      'flush': 'Flush',
      'full_house': 'Full House',
      'four_of_a_kind': 'Four of a Kind',
      'straight_flush': 'Straight Flush',
      'royal_flush': 'Royal Flush'
    };
    
    return rankMap[rank];
  };
  
  // Get color class based on win percentage
  const getWinPercentageColor = (percentage?: number): string => {
    if (!percentage) return 'text-gray-500 dark:text-gray-400';
    
    if (percentage >= 0.7) return 'text-green-600 dark:text-green-400';
    if (percentage >= 0.5) return 'text-green-500 dark:text-green-400';
    if (percentage >= 0.3) return 'text-yellow-500 dark:text-yellow-400';
    if (percentage >= 0.2) return 'text-orange-500 dark:text-orange-400';
    return 'text-red-500 dark:text-red-400';
  };
  
  return (
    <div 
      className={`
        ${className}
        rounded-lg bg-white dark:bg-gray-800 shadow-md overflow-hidden
        ${isCurrentPlayer ? 'border-2 border-primary-500 dark:border-primary-400' : 'border border-gray-200 dark:border-gray-700'}
        transition-all duration-300
      `}
    >
      <div className="p-4 bg-gray-50 dark:bg-gray-850 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <div className="flex items-center">
          {isCurrentPlayer && (
            <div className="w-2 h-2 rounded-full bg-primary-500 mr-2"></div>
          )}
          <h3 className={`font-medium ${isCurrentPlayer ? 'text-primary-700 dark:text-primary-300' : ''}`}>
            {playerName}
          </h3>
        </div>
        
        {winPercentage !== undefined && (
          <div className={`text-sm font-semibold ${getWinPercentageColor(winPercentage)}`}>
            {(winPercentage * 100).toFixed(1)}%
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex justify-center space-x-2 mb-4">
          {cards.map((card, index) => (
            <Card 
              key={`${card.rank}${card.suit}-${index}`}
              card={card}
              size="md"
            />
          ))}
          
          {/* Placeholder for empty card slots */}
          {cards.length < 4 && Array(4 - cards.length).fill(0).map((_, index) => (
            <div 
              key={`empty-${index}`} 
              className="w-16 h-24 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-md flex items-center justify-center"
            >
              <span className="text-gray-300 dark:text-gray-600">+</span>
            </div>
          ))}
        </div>
        
        {bestHand && (
          <div className="text-center text-sm font-medium text-gray-600 dark:text-gray-300">
            Best hand: <span className="text-primary-600 dark:text-primary-400">{getHandRankDisplay(bestHand)}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayerHand;
