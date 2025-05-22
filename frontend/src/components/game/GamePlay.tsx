'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card as CardType, GameStage, GameType, HandRank } from '@/types';
import { useGameContext } from '@/context/GameContext';
import { CardSelectionGrid } from '@/components/cards/CardSelectionGrid';
import { Card } from '@/components/cards/Card';
import CommunityCards from '@/components/game/CommunityCards';
import PlayerHand from '@/components/game/PlayerHand';
import OddsDisplay from '@/components/game/OddsDisplay';
import StageProgress from '@/components/game/StageProgress';

export const GamePlay: React.FC = () => {
  const router = useRouter();
  const { gameState, startGame, updateGame, resetGame } = useGameContext();
  
  const [playerCards, setPlayerCards] = useState<CardType[]>([]);
  const [communityCards, setCommunityCards] = useState<CardType[]>([]);
  const [currentStage, setCurrentStage] = useState<GameStage>('preflop');
  const [playerCount, setPlayerCount] = useState(2);
  const [gameType, setGameType] = useState<GameType>('texas-holdem');
  const [isSelectionModalOpen, setIsSelectionModalOpen] = useState(false);
  const [selectionIndex, setSelectionIndex] = useState<number>(-1);
  const [bestHand, setBestHand] = useState<HandRank | undefined>(undefined);
  const [gamePhase, setGamePhase] = useState<'deal' | 'flop' | 'turn' | 'river'>('deal');
  
  // Derived values
  const isTexasHoldem = gameType === 'texas-holdem';
  const maxPlayerCards = isTexasHoldem ? 2 : 4;
  const maxCommunityCards = 5;
  
  const allCards = [...playerCards, ...communityCards];
  
  // Open card selection modal
  const openCardSelection = (index: number = -1) => {
    setSelectionIndex(index);
    setIsSelectionModalOpen(true);
  };
  
  // Close card selection modal
  const closeCardSelection = () => {
    setIsSelectionModalOpen(false);
    setSelectionIndex(-1);
  };
  
  // Handle card selection based on current game phase
  const handleCardSelect = (card: CardType) => {
    if (gamePhase === 'deal') {
      // Handle player card selection
      if (playerCards.length >= maxPlayerCards && selectionIndex === -1) return;
      
      let newPlayerCards = [...playerCards];
      
      if (selectionIndex >= 0 && selectionIndex < playerCards.length) {
        // Replace existing card
        newPlayerCards[selectionIndex] = card;
      } else {
        // Add new card
        newPlayerCards.push(card);
      }
      
      setPlayerCards(newPlayerCards);
    } else {
      // Handle community card selection
      if (communityCards.length >= maxCommunityCards && selectionIndex === -1) return;
      
      let newCommunityCards = [...communityCards];
      
      if (selectionIndex >= 0 && selectionIndex < communityCards.length) {
        // Replace existing card
        newCommunityCards[selectionIndex] = card;
      } else {
        // Add new card
        newCommunityCards.push(card);
      }
      
      setCommunityCards(newCommunityCards);
      
      // Update the game stage based on the number of community cards
      updateGameStage(newCommunityCards.length);
    }
    
    closeCardSelection();
  };
  
  // Update game stage based on community card count
  const updateGameStage = (cardCount: number) => {
    if (cardCount === 0) {
      setCurrentStage('preflop');
    } else if (cardCount === 3) {
      setCurrentStage('flop');
    } else if (cardCount === 4) {
      setCurrentStage('turn');
    } else if (cardCount === 5) {
      setCurrentStage('river');
    }
  };
  
  // Open community card selection by index
  const handleCommunityCardClick = (index: number) => {
    if (index < communityCards.length) {
      // Edit existing card
      openCardSelection(index);
    } else {
      // Add new card
      openCardSelection();
    }
  };
  
  // Start game when player cards are selected
  useEffect(() => {
    if (playerCards.length === maxPlayerCards) {
      // Start the game with selected player cards
      startGame({
        gameType,
        playerCount,
        playerCards,
        communityCards: [],
      });
    }
  }, [playerCards, maxPlayerCards, gameType, playerCount, startGame]);
  
  // Update game when community cards change
  useEffect(() => {
    if (playerCards.length === maxPlayerCards && communityCards.length > 0) {
      // Update the game with new community cards
      updateGame({
        communityCards,
      });
    }
  }, [communityCards, playerCards, maxPlayerCards, updateGame]);
  
  // Update best hand when game state changes
  useEffect(() => {
    if (gameState.handRank) {
      setBestHand(gameState.handRank as HandRank);
    }
  }, [gameState.handRank]);
  
  // Reset the game
  const handleResetGame = () => {
    setPlayerCards([]);
    setCommunityCards([]);
    setCurrentStage('preflop');
    setBestHand(undefined);
    setGamePhase('deal');
    resetGame();
  };
  
  // Switch game type
  const handleSwitchGameType = () => {
    handleResetGame();
    const newGameType = isTexasHoldem ? 'omaha' : 'texas-holdem';
    setGameType(newGameType);
    // Navigate to the appropriate page
    router.push(`/${newGameType}`);
  };
  
  // Effect to handle game phase transitions
  useEffect(() => {
    if (gamePhase === 'flop' && communityCards.length === 0) {
      // Auto-open selection when entering flop phase with no cards
      handleCommunityCardClick(0);
    } else if (gamePhase === 'turn' && communityCards.length === 3) {
      // Auto-open selection when entering turn phase
      handleCommunityCardClick(3);
    } else if (gamePhase === 'river' && communityCards.length === 4) {
      // Auto-open selection when entering river phase
      handleCommunityCardClick(4);
    }
  }, [gamePhase, communityCards.length]);
  
  return (
    <div className="space-y-8">
      {/* Game controls */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">
          {isTexasHoldem ? 'Texas Hold\'em' : 'Omaha'} Odds Calculator
        </h2>
        <div className="flex space-x-3">
          <button
            onClick={handleSwitchGameType}
            className="px-4 py-2 bg-secondary-500 text-white rounded-md hover:bg-secondary-600 transition-colors focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:ring-opacity-50"
          >
            Switch to {isTexasHoldem ? 'Omaha' : 'Texas Hold\'em'}
          </button>
          <button
            onClick={handleResetGame}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
          >
            New Hand
          </button>
        </div>
      </div>
      
      {/* Stage progress tracker */}
      <StageProgress currentStage={currentStage} className="mb-8" />
      
      {/* Main game area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left side - game visuals */}
        <div className="lg:col-span-2 space-y-8">
          {/* Community cards section */}
          <div className="bg-green-800 rounded-xl p-6">
            <h3 className="text-white text-lg mb-4">Community Cards</h3>
            <CommunityCards
              cards={communityCards}
              stage={currentStage}
              onCardSelect={gamePhase !== 'deal' ? handleCommunityCardClick : undefined}
              maxCards={maxCommunityCards}
            />
          </div>
          
          {/* Player hand as separate section */}
          <div className="bg-green-900 rounded-xl p-6">
            <h3 className="text-white text-lg mb-4">Your Hand</h3>
            <div className="flex justify-center">
              <PlayerHand
                playerName=""
                cards={playerCards}
                isCurrentPlayer={true}
                bestHand={bestHand}
                winPercentage={gameState.odds ? gameState.odds : 0}
              />
            </div>
          </div>
          
          {/* Game phase information */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            {gamePhase === 'flop' && (
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2">The Flop</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {communityCards.length < 3 ? 'Select 3 community cards for the flop' : 'Flop is dealt. See your odds or continue to the turn.'}
                </p>
                {communityCards.length === 3 && (
                  <button 
                    onClick={() => setGamePhase('turn')}
                    className="px-6 py-3 bg-primary-500 text-white rounded-md hover:bg-primary-600"
                  >
                    Deal Turn
                  </button>
                )}
              </div>
            )}
            
            {gamePhase === 'turn' && (
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2">The Turn</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {communityCards.length < 4 ? 'Select the turn card' : 'Turn is dealt. See your odds or continue to the river.'}
                </p>
                {communityCards.length === 4 && (
                  <button 
                    onClick={() => setGamePhase('river')}
                    className="px-6 py-3 bg-primary-500 text-white rounded-md hover:bg-primary-600"
                  >
                    Deal River
                  </button>
                )}
              </div>
            )}
            
            {gamePhase === 'river' && (
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2">The River</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {communityCards.length < 5 ? 'Select the river card' : 'Hand complete. See your final odds.'}
                </p>
                {communityCards.length === 5 && (
                  <div className="mt-4">
                    <p className="text-green-600 font-medium">All cards dealt. Your final odds are calculated.</p>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Game controls section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 space-y-4">
            <h3 className="font-semibold text-lg">Game Controls</h3>
            
            {/* Player cards selection */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">Your Cards</label>
              <div className="flex gap-2">
                {playerCards.map((card, index) => (
                  <div 
                    key={`control-player-${index}`}
                    onClick={() => openCardSelection(index)}
                    className="cursor-pointer transform hover:scale-105 transition-transform"
                  >
                    <Card card={card} size="sm" />
                  </div>
                ))}
                
                {playerCards.length < maxPlayerCards && (
                  <div 
                    className="w-12 h-16 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-md flex items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    onClick={() => openCardSelection()}
                  >
                    <span className="text-gray-400">+</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Player count selection */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">Number of Players</label>
              <div className="flex items-center">
                <input 
                  type="range" 
                  min="2" 
                  max="9" 
                  value={playerCount} 
                  onChange={(e) => setPlayerCount(parseInt(e.target.value))}
                  className="flex-grow mr-2 accent-primary-500"
                />
                <span className="text-sm font-semibold bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 px-2 py-1 rounded w-8 text-center">
                  {playerCount}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right side - odds and controls */}
        <div className="space-y-8">
          {/* Card dealing widget - now on the right side */}
          {gamePhase === 'deal' && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-xl font-semibold mb-4 text-center">Deal Your Cards</h3>
              {playerCards.length < maxPlayerCards ? (
                <div className="text-center">
                  <p className="text-gray-600 dark:text-gray-300 mb-4">Select your {maxPlayerCards} hole cards to begin</p>
                  <button 
                    onClick={() => setIsSelectionModalOpen(true)}
                    className="px-6 py-3 bg-primary-500 text-white rounded-md hover:bg-primary-600 w-full"
                  >
                    Select Cards
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-gray-600 dark:text-gray-300 mb-4">Your cards are dealt. Now let's see the flop.</p>
                  <button 
                    onClick={() => setGamePhase('flop')}
                    className="px-6 py-3 bg-primary-500 text-white rounded-md hover:bg-primary-600 w-full"
                  >
                    Deal Flop
                  </button>
                </div>
              )}
            </div>
          )}
          
          {/* Action buttons based on game phase */}
          {gamePhase !== 'deal' && communityCards.length < (
            gamePhase === 'flop' ? 3 : gamePhase === 'turn' ? 4 : 5
          ) && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-xl font-semibold mb-4 text-center">
                Select {gamePhase === 'flop' ? 'Flop' : gamePhase === 'turn' ? 'Turn' : 'River'} Card
              </h3>
              <button 
                onClick={() => handleCommunityCardClick(communityCards.length)}
                className="px-6 py-3 bg-primary-500 text-white rounded-md hover:bg-primary-600 w-full"
              >
                Select Card
              </button>
            </div>
          )}
          
          {/* Deal River button - shown when turn is complete */}
          {gamePhase === 'turn' && communityCards.length === 4 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-xl font-semibold mb-4 text-center">Ready for the River</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">Turn card is dealt. Ready to see the final card.</p>
              <button 
                onClick={() => setGamePhase('river')}
                className="px-6 py-3 bg-primary-500 text-white rounded-md hover:bg-primary-600 w-full"
              >
                Deal River
              </button>
            </div>
          )}
          
          {/* Deal Complete message - shown when river is complete */}
          {gamePhase === 'river' && communityCards.length === 5 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-xl font-semibold mb-4 text-center">Hand Complete</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">All cards dealt. Your final odds are calculated.</p>
              <div className="px-6 py-3 bg-green-100 text-green-800 rounded-md text-center font-medium">
                See your odds below
              </div>
            </div>
          )}
          
          {/* Odds display */}
          {gameState.odds && playerCards.length === maxPlayerCards && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-xl font-semibold mb-4 text-center">Your Odds</h3>
              <div className="relative h-40 w-40 mx-auto mb-4">
                <svg className="w-full h-full" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#EEEEEE"
                    strokeWidth="3"
                  />
                  <path
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#4CAF50"
                    strokeWidth="3"
                    strokeDasharray={`${Math.min(Math.round(gameState.odds * 100), 100)}, 100`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                  <span className="text-3xl font-bold text-primary-600">{Math.min(Math.round(gameState.odds * 100), 100)}%</span>
                </div>
              </div>
              <OddsDisplay
                odds={gameState.odds || 0}
                stage={currentStage}
                activePlayers={playerCount}
              />
            </div>
          )}
        </div>
      </div>
      
      {/* Card selection modal - shown when modal is open */}
      {isSelectionModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h3 className="text-lg font-semibold">
                Select {gamePhase === 'deal' ? 'Your Card' : 'Community Card'}
              </h3>
              <button 
                onClick={closeCardSelection}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <CardSelectionGrid
                onCardSelect={handleCardSelect}
                selectedCards={allCards}
                disabledCards={allCards}
                maxSelections={maxPlayerCards + maxCommunityCards}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GamePlay;
