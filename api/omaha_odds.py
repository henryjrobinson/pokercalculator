import random
from itertools import combinations
from texas_holdem_odds import Card, evaluate_five_card_hand

def create_deck():
    ranks = '23456789TJQKA'
    suits = 'HDCS'
    return [Card(rank, suit) for rank in ranks for suit in suits]

def calculate_odds(active_players, my_hand, community_cards, num_simulations=10000):
    deck = create_deck()
    
    # Remove known cards from the deck
    for card in my_hand + community_cards:
        deck = [c for c in deck if not (c.rank == card.rank and c.suit == card.suit)]
    
    wins = 0
    
    for _ in range(num_simulations):
        # Shuffle the deck
        random.shuffle(deck)
        
        # Deal remaining community cards
        remaining_community = 5 - len(community_cards)
        simulated_community = community_cards + deck[:remaining_community]
        
        # Deal cards to other active players
        other_players_cards = [deck[remaining_community + i*4 : remaining_community + (i+1)*4] 
                               for i in range(active_players - 1)]
        
        # Evaluate hands
        my_score = evaluate_omaha_hand(my_hand, simulated_community)
        other_scores = [evaluate_omaha_hand(player_hand, simulated_community) 
                        for player_hand in other_players_cards]
        
        if my_score > max(other_scores):
            wins += 1
        elif my_score == max(other_scores):
            wins += 0.5  # Count ties as half a win
    
    return wins / num_simulations

def evaluate_omaha_hand(hole_cards, community_cards):
    """
    Evaluate an Omaha hand (4 hole cards + 5 community)
    In Omaha, you must use exactly 2 hole cards and 3 community cards.
    """
    best_score = 0
    # Try all combinations of 2 hole cards
    for hole_combo in combinations(hole_cards, 2):
        # Try all combinations of 3 community cards
        for comm_combo in combinations(community_cards, 3):
            # Combine the selected cards
            hand = list(hole_combo) + list(comm_combo)
            # Evaluate the 5-card hand
            score = evaluate_five_card_hand(hand)
            best_score = max(best_score, score)
    return best_score

def parse_cards(card_string):
    """Parse a string of cards like 'AH KD QC JS' into a list of Card objects."""
    if not card_string.strip():
        return []
        
    cards = []
    for card_text in card_string.strip().split():
        if len(card_text) != 2:
            raise ValueError(f"Invalid card format: {card_text}. Use format like 'AH' (Ace of Hearts).")
        
        rank, suit = card_text[0], card_text[1]
        valid_ranks = '23456789TJQKA'
        valid_suits = 'HDCS'
        
        if rank not in valid_ranks:
            raise ValueError(f"Invalid rank: {rank}. Valid ranks are {', '.join(valid_ranks)}")
        if suit not in valid_suits:
            raise ValueError(f"Invalid suit: {suit}. Valid suits are {', '.join(valid_suits)}")
            
        cards.append(Card(rank, suit))
    
    return cards
