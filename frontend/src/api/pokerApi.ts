import axios from 'axios';
import { GameStartResponse, GameUpdateResponse, StartGameRequest, UpdateGameRequest } from '@/types';

// Create an axios instance with proper configuration
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// API functions with proper typing
export const pokerApi = {
  startGame: async (startRequest: StartGameRequest): Promise<GameStartResponse> => {
    try {
      const response = await apiClient.post<GameStartResponse>('/start_game', startRequest);
      return response.data;
    } catch (error) {
      console.error('Error starting game:', error);
      throw error;
    }
  },

  updateGame: async (updateRequest: UpdateGameRequest): Promise<GameUpdateResponse> => {
    try {
      const response = await apiClient.post<GameUpdateResponse>('/update_game', updateRequest);
      return response.data;
    } catch (error) {
      console.error('Error updating game:', error);
      throw error;
    }
  },

  resetGame: async (): Promise<{ status: string }> => {
    try {
      const response = await apiClient.post<{ status: string }>('/reset_game', {});
      return response.data;
    } catch (error) {
      console.error('Error resetting game:', error);
      throw error;
    }
  },

  getHandHistory: async (): Promise<{ hand_history: any[] }> => {
    try {
      const response = await apiClient.get<{ hand_history: any[] }>('/hand_history');
      return response.data;
    } catch (error) {
      console.error('Error fetching hand history:', error);
      throw error;
    }
  }
};

// Utility functions for API requests
export const parseApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    if (error.response?.data?.error) {
      return error.response.data.error;
    }
    return error.message;
  }
  return 'An unknown error occurred';
};
