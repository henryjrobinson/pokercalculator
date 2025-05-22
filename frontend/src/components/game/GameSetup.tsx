'use client';

import React, { useState } from 'react';
import { useGame } from '@/context/GameContext';
import { Card as CardType, GameType } from '@/types';
import { HandDisplay } from './HandDisplay';
import { CardSelectionGrid } from '../cards/CardSelectionGrid';
import { cardsToString } from '@/utils/cardUtils';

interface GameSetupProps {
  gameType: GameType;
}

export const GameSetup: React.FC<GameSetupProps> = ({ gameType }) => {
  const { startGame, isLoading, error } = useGame();
  const [selectedCards, setSelectedCards] = useState<CardType[]>([]);
  const [players, setPlayers] = useState<number>(4);
  
  const requiredCards = gameType === 'holdem' ? 2 : 4;
  
  const handleCardSelect = (card: CardType) => {
    if (selectedCards.length < requiredCards) {
      setSelectedCards([...selectedCards, card]);
    }
  };
  
  const handleRemoveCard = (index: number) => {
    const newCards = [...selectedCards];
    newCards.splice(index, 1);
    setSelectedCards(newCards);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedCards.length !== requiredCards) {
      return;
    }
    
    const handString = cardsToString(selectedCards);
    startGame(handString, players);
  };
  
  return (
    <div className="space-y-6">
      <div className="card">
        <div className="card-header">
          {gameType === 'holdem' ? 'Texas Hold\'em' : 'Omaha'} Setup
        </div>
        <div className="card-body space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="players" className="block text-sm font-medium mb-1">
                Number of Players
              </label>
              <input
                id="players"
                type="number"
                min="2"
                max="10"
                className="input-field w-full"
                value={players}
                onChange={(e) => setPlayers(parseInt(e.target.value) || 2)}
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                Total players at the table (including you)
              </p>
            </div>
            
            <HandDisplay
              cards={selectedCards}
              title="Your Hand"
              maxCards={requiredCards}
              onRemoveCard={handleRemoveCard}
            />
            
            <button
              type="submit"
              className="btn-primary w-full"
              disabled={selectedCards.length !== requiredCards || isLoading}
            >
              {isLoading ? 'Calculating...' : 'Calculate Odds'}
            </button>
            
            {error && (
              <div className="text-red-500 text-sm mt-2">
                {error}
              </div>
            )}
          </form>
          
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <CardSelectionGrid
              onCardSelect={handleCardSelect}
              selectedCards={selectedCards}
              maxSelections={requiredCards}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
