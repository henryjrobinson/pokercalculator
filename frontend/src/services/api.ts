import axios from 'axios';
import { Card, GameType, GameStage, GameStartResponse, GameUpdateResponse } from '@/types';

// API base URL - fallback to localhost for development
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Create axios instance with common configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper function to format cards for API requests (e.g., ['AH', 'KD'])
const formatCards = (cards: Card[]): string[] => {
  return cards.map(card => `${card.rank}${card.suit}`);
};

// API service with typed methods
export const api = {
  /**
   * Start a new game session
   */
  startGame: async (
    gameType: GameType,
    playerCards: Card[],
    playerCount: number
  ): Promise<GameStartResponse> => {
    try {
      const response = await apiClient.post('/api/start_game', {
        game_type: gameType,
        my_hand: formatCards(playerCards).join(','),
        num_players: playerCount,
      });
      
      return response.data;
    } catch (error) {
      console.error('Error starting game:', error);
      throw error;
    }
  },
  
  /**
   * Update an existing game with new community cards
   */
  updateGame: async (
    gameId: string,
    communityCards: Card[],
    activePlayers: number,
    stage: GameStage
  ): Promise<GameUpdateResponse> => {
    try {
      const response = await apiClient.post('/api/update_game', {
        game_id: gameId,
        community_cards: formatCards(communityCards).join(','),
        active_players: activePlayers,
        stage: stage,
      });
      
      return response.data;
    } catch (error) {
      console.error('Error updating game:', error);
      throw error;
    }
  },
  
  /**
   * Reset the current game session
   */
  resetGame: async (gameId: string): Promise<void> => {
    try {
      await apiClient.post('/api/reset_game', {
        game_id: gameId,
      });
    } catch (error) {
      console.error('Error resetting game:', error);
      throw error;
    }
  },
  
  /**
   * Get hand history
   */
  getHandHistory: async (): Promise<any> => {
    try {
      const response = await apiClient.get('/api/hand_history');
      return response.data;
    } catch (error) {
      console.error('Error fetching hand history:', error);
      throw error;
    }
  },
};

export default api;
