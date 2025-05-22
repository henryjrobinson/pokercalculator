'use client';

import React, { useState, useEffect } from 'react';
import { Card as CardType, Rank, Suit } from '@/types';
import { Card } from './Card';
import { isCardInArray, getSuitSymbol } from '@/utils/cardUtils';

interface CardSelectionGridProps {
  onCardSelect: (card: CardType) => void;
  selectedCards: CardType[];
  disabledCards?: CardType[];
  maxSelections?: number;
  className?: string;
}

export const CardSelectionGrid: React.FC<CardSelectionGridProps> = ({
  onCardSelect,
  selectedCards,
  disabledCards = [],
  maxSelections = Infinity,
  className = '',
}) => {
  const [groupedCards, setGroupedCards] = useState<Record<Suit, CardType[]>>({} as Record<Suit, CardType[]>);
  const [activeFilter, setActiveFilter] = useState<Suit | null>(null);
  
  // Generate all possible cards, grouped by suit
  useEffect(() => {
    const ranks: Rank[] = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];
    const suits: Suit[] = ['H', 'D', 'C', 'S'];
    
    const grouped: Record<Suit, CardType[]> = { H: [], D: [], C: [], S: [] };
    
    for (const suit of suits) {
      for (const rank of ranks) {
        grouped[suit].push({ rank, suit });
      }
    }
    
    setGroupedCards(grouped);
  }, []);
  
  const handleCardClick = (card: CardType) => {
    // If the card is already selected, do nothing (handled by parent component)
    if (isCardInArray(card, selectedCards) || selectedCards.length >= maxSelections) {
      return;
    }
    
    // Otherwise, select the card
    onCardSelect(card);
  };
  
  const isCardDisabled = (card: CardType): boolean => {
    // Check if the card is in the disabled cards list
    return isCardInArray(card, disabledCards) || 
           (selectedCards.length >= maxSelections && !isCardInArray(card, selectedCards));
  };
  
  const isCardSelected = (card: CardType): boolean => {
    return isCardInArray(card, selectedCards);
  };
  
  // Helper for suit filter styling
  const getSuitFilterClass = (suit: Suit) => {
    const baseClasses = "p-2 rounded-md text-center cursor-pointer transition-colors";
    
    if (activeFilter === suit) {
      return `${baseClasses} bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 font-bold`;
    }
    
    return `${baseClasses} hover:bg-gray-100 dark:hover:bg-gray-800`;
  };

  // Get suit display name
  const getSuitDisplayName = (suit: Suit) => {
    const suitSymbol = getSuitSymbol(suit);
    const suitNames = {
      'H': 'Hearts',
      'D': 'Diamonds',
      'C': 'Clubs',
      'S': 'Spades'
    };
    
    return (
      <span className={suit === 'H' || suit === 'D' ? 'text-red-600 dark:text-red-400' : ''}>
        {suitSymbol} {suitNames[suit]}
      </span>
    );
  };
  
  // Filter suits or display all
  const filteredSuits = activeFilter ? [activeFilter] : (['H', 'D', 'C', 'S'] as Suit[]);
  
  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Card Selection</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {selectedCards.length}/{maxSelections !== Infinity ? maxSelections : '∞'}
        </p>
      </div>
      
      {/* Suit filters */}
      <div className="grid grid-cols-5 gap-2">
        <div 
          className={`p-2 rounded-md text-center cursor-pointer ${activeFilter === null ? 'bg-gray-200 dark:bg-gray-700 font-bold' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
          onClick={() => setActiveFilter(null)}
        >
          All
        </div>
        {(['H', 'D', 'C', 'S'] as Suit[]).map(suit => (
          <div 
            key={suit} 
            className={getSuitFilterClass(suit)}
            onClick={() => setActiveFilter(activeFilter === suit ? null : suit)}
          >
            {getSuitSymbol(suit)}
          </div>
        ))}
      </div>
      
      {/* Card grid organized by suits */}
      <div className="space-y-6">
        {filteredSuits.map(suit => (
          <div key={suit} className="space-y-2">
            <h4 className="font-medium">{getSuitDisplayName(suit)}</h4>
            <div className="grid grid-cols-7 gap-1 sm:gap-2">
              {groupedCards[suit]?.map((card) => (
                <Card
                  key={`${card.rank}${card.suit}`}
                  card={card}
                  isSelected={isCardSelected(card)}
                  isDisabled={isCardDisabled(card)}
                  onClick={() => handleCardClick(card)}
                  size="sm"
                  className="mx-auto"
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Recently used cards - for quick selection (future enhancement) */}
      {selectedCards.length > 0 && (
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <h4 className="font-medium mb-2">Recently Selected</h4>
          <div className="flex flex-wrap gap-2">
            {selectedCards.map((card, index) => (
              <Card
                key={`selected-${index}`}
                card={card}
                isSelected={true}
                size="sm"
                onClick={() => {}}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
