import { Card, Rank, Suit } from '@/types';

/**
 * Converts a string representation of a card (e.g., "AH") to a Card object
 */
export const parseCard = (cardString: string): Card | null => {
  if (cardString.length !== 2) {
    return null;
  }
  
  const rank = cardString[0].toUpperCase();
  const suit = cardString[1].toUpperCase();
  
  const validRanks = '23456789TJQKA';
  const validSuits = 'HDCS';
  
  if (!validRanks.includes(rank) || !validSuits.includes(suit)) {
    return null;
  }
  
  return { 
    rank: rank as Rank, 
    suit: suit as Suit 
  };
};

/**
 * Converts a Card object to a string representation (e.g., "AH")
 */
export const cardToString = (card: Card): string => {
  return `${card.rank}${card.suit}`;
};

/**
 * Parses a space-separated string of cards (e.g., "AH KD") into an array of Card objects
 */
export const parseCards = (cardsString: string): Card[] => {
  if (!cardsString.trim()) {
    return [];
  }
  
  const cardStrings = cardsString.trim().split(/\s+/);
  const cards: Card[] = [];
  
  for (const cardString of cardStrings) {
    const card = parseCard(cardString);
    if (card) {
      cards.push(card);
    }
  }
  
  return cards;
};

/**
 * Converts an array of Card objects to a space-separated string
 */
export const cardsToString = (cards: Card[]): string => {
  return cards.map(cardToString).join(' ');
};

/**
 * Validates a hand based on the game type
 */
export const validateHand = (cards: Card[], gameType: 'holdem' | 'omaha'): boolean => {
  const requiredCards = gameType === 'holdem' ? 2 : 4;
  return cards.length === requiredCards;
};

/**
 * Validates community cards based on the game stage
 */
export const validateCommunityCards = (cards: Card[], stage: 'preflop' | 'flop' | 'turn' | 'river'): boolean => {
  switch (stage) {
    case 'preflop':
      return cards.length === 0;
    case 'flop':
      return cards.length === 3;
    case 'turn':
      return cards.length === 4;
    case 'river':
      return cards.length === 5;
    default:
      return false;
  }
};

/**
 * Gets the color for a card suit
 */
export const getSuitColor = (suit: Suit): string => {
  return suit === 'H' || suit === 'D' ? 'text-red-600' : 'text-slate-900';
};

/**
 * Gets the Unicode symbol for a card suit
 */
export const getSuitSymbol = (suit: Suit): string => {
  switch (suit) {
    case 'H':
      return '♥';
    case 'D':
      return '♦';
    case 'C':
      return '♣';
    case 'S':
      return '♠';
    default:
      return '';
  }
};

/**
 * Gets the display name for a card rank
 */
export const getRankDisplay = (rank: Rank): string => {
  if (rank === 'T') return '10';
  return rank;
};

/**
 * Checks if two cards are the same (have the same rank and suit)
 */
export const areCardsEqual = (card1: Card, card2: Card): boolean => {
  return card1.rank === card2.rank && card1.suit === card2.suit;
};

/**
 * Checks if a card already exists in an array of cards
 */
export const isCardInArray = (card: Card, cards: Card[]): boolean => {
  return cards.some(c => areCardsEqual(c, card));
};

/**
 * Creates a deck of 52 cards
 */
export const createDeck = (): Card[] => {
  const ranks: Rank[] = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];
  const suits: Suit[] = ['H', 'D', 'C', 'S'];
  
  const deck: Card[] = [];
  
  for (const suit of suits) {
    for (const rank of ranks) {
      deck.push({ rank, suit });
    }
  }
  
  return deck;
};

/**
 * Filters a deck to remove cards that are already in play
 */
export const getAvailableCards = (existingCards: Card[]): Card[] => {
  const deck = createDeck();
  return deck.filter(card => !isCardInArray(card, existingCards));
};
