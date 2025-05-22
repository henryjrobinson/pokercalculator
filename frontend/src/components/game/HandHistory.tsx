'use client';

import React from 'react';
import { HandHistoryItem } from '@/types';
import { parseCards } from '@/utils/cardUtils';

interface HandHistoryProps {
  history: HandHistoryItem[];
}

export const HandHistory: React.FC<HandHistoryProps> = ({ history }) => {
  // Format odds as a percentage
  const formatOdds = (odds: number): string => {
    return (odds * 100).toFixed(2) + '%';
  };
  
  // Get game type display name
  const getGameTypeDisplay = (gameType: string): string => {
    return gameType === 'holdem' ? 'Texas Hold\'em' : 'Omaha';
  };
  
  return (
    <div className="card">
      <div className="card-header">
        Hand History
      </div>
      <div className="p-0">
        {history.length > 0 ? (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {history.map((hand, index) => (
              <li key={index} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium">{getGameTypeDisplay(hand.game_type)}</span>
                  <span className="text-green-600 font-bold">{formatOdds(hand.odds)}</span>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="inline-block mr-4">Hand: <code>{hand.my_hand}</code></span>
                  <span className="inline-block">Players: {hand.players}</span>
                </div>
                {hand.community_cards && (
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Community: <code>{hand.community_cards}</code>
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400">
            No hand history available
          </div>
        )}
      </div>
    </div>
  );
};
