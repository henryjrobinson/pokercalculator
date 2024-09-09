import random
from itertools import combinations

class Card:
    def __init__(self, rank, suit):
        self.rank = rank
        self.suit = suit

    def __repr__(self):
        return f"{self.rank}{self.suit}"

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
    possible_hands = []
    for hole_combo in combinations(hole_cards, 2):
        for community_combo in combinations(community_cards, 3):
            possible_hands.append(evaluate_hand(list(hole_combo) + list(community_combo)))
    return max(possible_hands)

def evaluate_hand(cards):
    # This function remains the same as in texas_holdem_odds.py
    # ... (include the evaluate_hand function here)
    pass

def parse_cards(card_string):
    return [Card(card[0], card[1]) for card in card_string.split()]
