'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { GameType, GameStage, Card, HandRank } from '@/types';

// Interface for our API service (to be implemented)
interface ApiService {
  startGame: (gameType: GameType, playerCards: Card[], playerCount: number) => Promise<any>;
  updateGame: (gameId: string, communityCards: Card[], activePlayers: number, stage: GameStage) => Promise<any>;
  resetGame: (gameId: string) => Promise<void>;
  getHandHistory: () => Promise<any>;
}

// Mock API implementation for development
const mockApi: ApiService = {
  startGame: async (gameType, playerCards, playerCount) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      game_id: 'game-' + Math.random().toString(36).substring(2, 9),
      odds: Math.random() * 100,
      stage: 'preflop' as GameStage,
      active_players: playerCount,
      hand_history: []
    };
  },
  updateGame: async (gameId, communityCards, activePlayers, stage) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      odds: Math.random() * 100,
      stage: stage,
      active_players: activePlayers,
      hand_history: []
    };
  },
  resetGame: async (gameId) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
  },
  getHandHistory: async () => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      hand_history: [
        {
          game_type: 'texas-holdem',
          my_hand: 'AH,KD',
          community_cards: 'QH,JH,TH',
          odds: 87.5,
          players: 2
        },
        {
          game_type: 'omaha',
          my_hand: 'AH,KD,QH,JH',
          community_cards: '9H,8H,7H',
          odds: 92.3,
          players: 3
        }
      ]
    };
  }
};

// Use the mock API for now
const api = mockApi;

// Hand history item structure
interface HandHistoryItem {
  gameType: GameType;
  myHand: string;
  communityCards: string;
  odds: number;
  players: number;
}

// Game state interface
interface GameState {
  gameId: string;
  gameType: GameType;
  myHand: Card[];
  communityCards: Card[];
  activePlayers: number;
  stage: GameStage;
  odds: number;
  handRank?: HandRank;
}

// Initial state for the game
const initialGameState: GameState = {
  gameId: "",
  gameType: "texas-holdem",
  myHand: [],
  communityCards: [],
  activePlayers: 2,
  stage: "preflop",
  odds: 0
};

// Parameters for startGame
interface StartGameParams {
  gameType: GameType;
  playerCount: number;
  playerCards: Card[];
  communityCards: Card[];
}

// Parameters for updateGame
interface UpdateGameParams {
  communityCards: Card[];
}

// Game context type definition
interface GameContextType {
  gameState: GameState;
  handHistory: HandHistoryItem[];
  isLoading: boolean;
  error: string | null;
  setGameType: (type: GameType) => void;
  startGame: (params: StartGameParams) => Promise<void>;
  updateGame: (params: UpdateGameParams) => Promise<void>;
  resetGame: () => Promise<void>;
  fetchHandHistory: () => Promise<void>;
}

// Create the context with default values
const GameContext = createContext<GameContextType>({} as GameContextType);

// Context provider component
export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const [handHistory, setHandHistory] = useState<HandHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Set the game type
  const setGameType = useCallback((type: GameType) => {
    setGameState(prev => ({ ...prev, gameType: type }));
  }, []);
  
  // Fetch hand history from the API
  const fetchHandHistory = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await api.getHandHistory();
      const formattedHistory = response.hand_history.map((item: any) => ({
        gameType: item.game_type as GameType,
        myHand: item.my_hand,
        communityCards: item.community_cards,
        odds: item.odds,
        players: item.players
      }));
      setHandHistory(formattedHistory);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch hand history';
      setError(errorMessage);
      console.error('Error fetching hand history:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Start a new game
  const startGame = useCallback(async (params: StartGameParams) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await api.startGame(
        params.gameType,
        params.playerCards,
        params.playerCount
      );
      
      setGameState({
        gameId: response.game_id,
        gameType: params.gameType,
        myHand: params.playerCards,
        communityCards: params.communityCards || [],
        activePlayers: response.active_players,
        stage: response.stage,
        odds: response.odds,
        handRank: undefined // Will be set when updating with community cards
      });
      
      // Also fetch hand history to keep it updated
      await fetchHandHistory();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to start game';
      setError(errorMessage);
      console.error('Error starting game:', err);
    } finally {
      setIsLoading(false);
    }
  }, [fetchHandHistory]);
  
  // Update an existing game
  const updateGame = useCallback(async (params: UpdateGameParams) => {
    if (!gameState.gameId) {
      setError("Cannot update: No active game");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Determine the stage based on community card count
      let newStage: GameStage = gameState.stage;
      if (params.communityCards.length === 3) {
        newStage = "flop";
      } else if (params.communityCards.length === 4) {
        newStage = "turn";
      } else if (params.communityCards.length === 5) {
        newStage = "river";
      }
      
      const response = await api.updateGame(
        gameState.gameId,
        params.communityCards,
        gameState.activePlayers,
        newStage
      );
      
      setGameState(prev => ({
        ...prev,
        communityCards: params.communityCards,
        stage: response.stage || newStage,
        odds: response.odds,
        // Add a random hand rank for simulated development
        handRank: params.communityCards.length >= 5 ? 
          ['pair', 'two_pair', 'three_of_a_kind', 'straight', 'flush'][Math.floor(Math.random() * 5)] as HandRank : 
          undefined
      }));
      
      // Also fetch hand history to keep it updated
      await fetchHandHistory();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update game';
      setError(errorMessage);
      console.error('Error updating game:', err);
    } finally {
      setIsLoading(false);
    }
  }, [gameState.gameId, gameState.activePlayers, gameState.stage, fetchHandHistory]);
  
  // Reset the current game
  const resetGame = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (gameState.gameId) {
        await api.resetGame(gameState.gameId);
      }
      
      setGameState(prev => ({
        ...initialGameState,
        gameType: prev.gameType // Preserve the game type
      }));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to reset game';
      setError(errorMessage);
      console.error('Error resetting game:', err);
    } finally {
      setIsLoading(false);
    }
  }, [gameState.gameId]);
  
  // Load hand history on initial mount
  useEffect(() => {
    fetchHandHistory();
  }, [fetchHandHistory]);
  
  // Context value
  const value: GameContextType = {
    gameState,
    handHistory,
    isLoading,
    error,
    setGameType,
    startGame,
    updateGame,
    resetGame,
    fetchHandHistory
  };
  
  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
};

// Custom hook to use the game context
export const useGameContext = (): GameContextType => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  return context;
};
