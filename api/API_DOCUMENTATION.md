# Poker Calculator API Documentation

## Overview

This document outlines the API endpoints for the Poker Calculator application. The API provides functionality for calculating poker odds using Monte Carlo simulation for both Texas Hold'em and Omaha poker variants.

## Base URL

When deployed on Vercel:
```
https://your-vercel-app.vercel.app/api
```

For local development:
```
http://localhost:3000/api
```

## Endpoints

### Start Game

Initializes a new poker game and calculates initial odds.

**URL:** `/start_game`  
**Method:** `POST`  
**Authentication:** None (stateless with session ID)

**Request Body:**
```json
{
  "game_type": "holdem", // or "omaha"
  "my_hand": "AH KD", // 2 cards for holdem, 4 cards for omaha
  "num_players": 4 // Number of players in the game
}
```

**Response:**
```json
{
  "game_id": "abc123", // Unique session ID for this game
  "odds": 0.452, // Probability of winning (0-1)
  "stage": "preflop", // Current game stage
  "active_players": 4, // Number of active players
  "hand_history": [] // Array of previous hands
}
```

**Error Response:**
```json
{
  "error": "Invalid hand format. Use notation like 'AH KD'."
}
```

### Update Game

Updates game state with new community cards and calculates updated odds.

**URL:** `/update_game`  
**Method:** `POST`  
**Authentication:** None (stateless with session ID)

**Request Body:**
```json
{
  "game_id": "abc123", // Game session ID from start_game
  "community_cards": "AH 7D 2S", // Community cards in play
  "active_players": 3, // Number of remaining players
  "stage": "flop" // Current game stage (flop, turn, river)
}
```

**Response:**
```json
{
  "odds": 0.678, // Updated probability of winning (0-1)
  "stage": "flop", // Current game stage
  "active_players": 3, // Number of active players
  "hand_history": [] // Array of previous hands
}
```

**Error Response:**
```json
{
  "error": "Invalid game session"
}
```

### Reset Game

Resets the current game session.

**URL:** `/reset_game`  
**Method:** `POST`  
**Authentication:** None (stateless with session ID)

**Request Body:**
```json
{} // Empty body
```

**Response:**
```json
{
  "status": "reset_successful"
}
```

### Get Hand History

Retrieves the history of previously calculated hands.

**URL:** `/hand_history`  
**Method:** `GET`  
**Authentication:** None (stateless with session ID)

**Response:**
```json
{
  "hand_history": [
    {
      "game_type": "holdem",
      "my_hand": "AH KD",
      "community_cards": "QS JD 10H",
      "odds": 0.756,
      "players": 3
    }
    // More history items...
  ]
}
```

## Data Models

### Card Format

Cards are specified using a two-character notation:
- First character: Rank (2-9, T for 10, J, Q, K, A)
- Second character: Suit (H for Hearts, D for Diamonds, C for Clubs, S for Spades)

Examples:
- `AH` = Ace of Hearts
- `KD` = King of Diamonds
- `TS` = Ten of Spades

### Game Stages

- `preflop`: Before any community cards are dealt
- `flop`: After first three community cards are dealt
- `turn`: After fourth community card is dealt
- `river`: After fifth community card is dealt

## Error Handling

All API endpoints return appropriate HTTP status codes:

- `200 OK`: Request succeeded
- `400 Bad Request`: Invalid input parameters
- `500 Internal Server Error`: Server-side error

Error responses include an `error` field with a descriptive message.

## Rate Limiting

To prevent abuse, the API implements rate limiting:
- 100 requests per minute per IP address
- 1000 requests per day per IP address

## Implementation Notes

The Monte Carlo simulation runs 10,000 iterations by default to calculate odds. This provides a good balance between accuracy and performance.
