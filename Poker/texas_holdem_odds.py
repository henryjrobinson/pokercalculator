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

def calculate_odds(num_players, my_hand, community_cards, num_simulations=10000):
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
        
        # Deal cards to other players
        other_players_cards = [deck[remaining_community + i*2 : remaining_community + (i+1)*2] 
                               for i in range(num_players - 1)]
        
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
    
    # Check for flush
    if len(set(card.suit for card in cards)) == 1:
        return max(hand_ranks) + 100  # Flush
    
    # Check for straight
    sorted_ranks = sorted(set(hand_ranks))
    if len(sorted_ranks) >= 5 and sorted_ranks[-1] - sorted_ranks[-5] == 4:
        return sorted_ranks[-1] + 90  # Straight
    
    # Count rank occurrences
    rank_counts = {rank: hand_ranks.count(rank) for rank in set(hand_ranks)}
    
    if 4 in rank_counts.values():
        return max(r for r, count in rank_counts.items() if count == 4) + 80  # Four of a kind
    elif 3 in rank_counts.values() and 2 in rank_counts.values():
        return max(r for r, count in rank_counts.items() if count == 3) + 70  # Full house
    elif 3 in rank_counts.values():
        return max(r for r, count in rank_counts.items() if count == 3) + 60  # Three of a kind
    elif list(rank_counts.values()).count(2) == 2:
        return max(r for r, count in rank_counts.items() if count == 2) + 50  # Two pair
    elif 2 in rank_counts.values():
        return max(r for r, count in rank_counts.items() if count == 2) + 40  # One pair
    else:
        return max(hand_ranks)  # High card

if __name__ == "__main__":
    # Example usage
    my_hand = [Card('A', 'H'), Card('K', 'D')]
    community_cards = [Card('7', 'S'), Card('8', 'C'), Card('9', 'D')]
    odds = calculate_odds(4, my_hand, community_cards)
    print(f"Odds of winning: {odds:.2%}")
