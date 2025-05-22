// Card Types
export interface Card {
  rank: Rank;
  suit: Suit;
}

export type Rank = 'A' | 'K' | 'Q' | 'J' | 'T' | '9' | '8' | '7' | '6' | '5' | '4' | '3' | '2';
export type Suit = 'H' | 'D' | 'C' | 'S';

// Game Types
export type GameType = 'texas-holdem' | 'omaha';

export type GameStage = 'preflop' | 'flop' | 'turn' | 'river';

// Hand Types
export type HandRank = 
  | 'high_card' 
  | 'pair' 
  | 'two_pair' 
  | 'three_of_a_kind' 
  | 'straight' 
  | 'flush' 
  | 'full_house' 
  | 'four_of_a_kind' 
  | 'straight_flush' 
  | 'royal_flush';

export interface GameState {
  gameId: string;
  gameType: GameType;
  myHand: Card[];
  communityCards: Card[];
  activePlayers: number;
  stage: GameStage;
  odds: number;
}

// API Response Types
export interface GameStartResponse {
  game_id: string;
  odds: number;
  stage: GameStage;
  active_players: number;
  hand_history: HandHistoryItem[];
}

export interface GameUpdateResponse {
  odds: number;
  stage: GameStage;
  active_players: number;
  hand_history: HandHistoryItem[];
}

export interface HandHistoryItem {
  game_type: GameType;
  my_hand: string;
  community_cards: string;
  odds: number;
  players: number;
}

// Hand Evaluation Types
export interface HandEvaluation {
  handType: HandType;
  handRank: number;
  description: string;
}

export type HandType = 
  | 'high_card'
  | 'pair'
  | 'two_pair'
  | 'three_of_a_kind'
  | 'straight'
  | 'flush'
  | 'full_house'
  | 'four_of_a_kind'
  | 'straight_flush'
  | 'royal_flush';

// API Request Types
export interface StartGameRequest {
  game_type: GameType;
  my_hand: string;
  num_players: number;
}

export interface UpdateGameRequest {
  game_id: string;
  community_cards: string;
  active_players: number;
  stage: GameStage;
}
