import random
from collections import Counter

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
        other_players_cards = [deck[remaining_community + i*2 : remaining_community + (i+1)*2] 
                               for i in range(active_players - 1)]
        
        # Evaluate hands
        my_score = evaluate_hand(my_hand + simulated_community)
        other_scores = [evaluate_hand(player_hand + simulated_community) 
                        for player_hand in other_players_cards]
        
        if my_score > max(other_scores):
            wins += 1
        elif my_score == max(other_scores):
            wins += 0.5  # Count ties as half a win
    
    return wins / num_simulations

def evaluate_hand(cards):
    ranks = '23456789TJQKA'
    hand_ranks = [ranks.index(card.rank) for card in cards]
    suit_counts = Counter(card.suit for card in cards)
    rank_counts = Counter(hand_ranks)
    
    # Check for flush
    flush = max(suit_counts.values()) >= 5
    
    # Check for straight
    sorted_ranks = sorted(set(hand_ranks))
    straight = False
    for i in range(len(sorted_ranks) - 4):
        if sorted_ranks[i:i+5] == list(range(sorted_ranks[i], sorted_ranks[i] + 5)):
            straight = True
            break
    # Special case for Ace-low straight
    if sorted_ranks == [0, 1, 2, 3, 12]:
        straight = True
    
    # Determine hand rank
    if flush and straight:
        return 8  # Straight flush
    elif max(rank_counts.values()) == 4:
        return 7  # Four of a kind
    elif set(rank_counts.values()) == {3, 2}:
        return 6  # Full house
    elif flush:
        return 5  # Flush
    elif straight:
        return 4  # Straight
    elif max(rank_counts.values()) == 3:
        return 3  # Three of a kind
    elif list(rank_counts.values()).count(2) == 2:
        return 2  # Two pair
    elif max(rank_counts.values()) == 2:
        return 1  # One pair
    else:
        return 0  # High card

def parse_cards(card_string):
    return [Card(card[0], card[1]) for card in card_string.split()]
