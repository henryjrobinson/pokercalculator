'use client';

import React from 'react';
import { Card as CardType, Suit, Rank } from '@/types';
import { getSuitColor, getSuitSymbol, getRankDisplay } from '@/utils/cardUtils';

interface CardProps {
  card: CardType;
  isSelected?: boolean;
  isDisabled?: boolean;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Card: React.FC<CardProps> = ({ 
  card, 
  isSelected = false,
  isDisabled = false, 
  onClick,
  size = 'md',
  className = ''
}) => {
  // Use proper type assertions to ensure type safety
  const suitColor = getSuitColor(card.suit as Suit);
  const suitSymbol = getSuitSymbol(card.suit as Suit);
  const rankDisplay = getRankDisplay(card.rank as Rank);
  
  const sizeClasses = {
    sm: 'w-12 h-16 text-xs',
    md: 'w-16 h-24 text-sm',
    lg: 'w-20 h-28 text-base'
  };
  
  return (
    <div 
      className={`
        relative select-none
        ${sizeClasses[size]}
        ${suitColor}
        bg-white dark:bg-gray-800 rounded-md shadow-md
        border-2 ${isSelected ? 'border-primary-500 dark:border-primary-400' : 'border-gray-200 dark:border-gray-700'}
        ${!isDisabled && !isSelected ? 'hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-lg' : ''}
        ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        transition-all duration-200 ease-in-out
        transform ${isSelected ? 'scale-105' : ''}
        ${className}
      `}
      onClick={isDisabled ? undefined : onClick}
      aria-disabled={isDisabled}
    >
      <div className="absolute top-1 left-1.5 font-bold">
        {rankDisplay}
      </div>
      
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl">
        {suitSymbol}
      </div>
      
      <div className="absolute bottom-1 right-1.5 font-bold transform rotate-180">
        {rankDisplay}
      </div>

      {isSelected && (
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary-500 dark:bg-primary-400 rounded-full flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
      )}
    </div>
  );
};
