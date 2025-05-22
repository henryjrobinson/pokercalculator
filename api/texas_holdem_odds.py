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
    """
    Evaluate a 7-card hand (2 hole cards + 5 community) and return a score.
    Higher scores indicate stronger hands.
    """
    # Get all 5-card combinations from the 7 cards
    best_score = 0
    for five_cards in combinations(cards, 5):
        score = evaluate_five_card_hand(list(five_cards))
        best_score = max(best_score, score)
    return best_score

def evaluate_five_card_hand(cards):
    """
    Evaluate a 5-card poker hand and return a score.
    Returns an integer score where higher is better.
    """
    ranks = '23456789TJQKA'
    hand_ranks = [ranks.index(card.rank) for card in cards]
    suits = [card.suit for card in cards]
    
    # Check for flush
    is_flush = len(set(suits)) == 1
    
    # Check for straight
    rank_counts = {}
    for rank in hand_ranks:
        rank_counts[rank] = rank_counts.get(rank, 0) + 1
    
    distinct_ranks = sorted(rank_counts.keys())
    
    # Special case: A-5 straight (Ace counts as 1)
    is_straight = False
    is_straight_to_five = False
    if len(distinct_ranks) >= 5:
        is_straight = max(distinct_ranks) - min(distinct_ranks) == 4 and len(distinct_ranks) == 5
    
    # Check for A-5 straight
    if 12 in distinct_ranks and set([0, 1, 2, 3]) <= set(distinct_ranks):
        is_straight = True
        is_straight_to_five = True
    
    # Determine hand category
    # Royal/Straight Flush
    if is_flush and is_straight:
        if is_straight_to_five:
            return 8000000 + 5  # Straight flush to 5
        else:
            return 8000000 + max(distinct_ranks)  # Value of straight flush
    
    # Four of a kind
    if 4 in rank_counts.values():
        four_rank = [r for r, c in rank_counts.items() if c == 4][0]
        kicker = [r for r in distinct_ranks if r != four_rank][0]
        return 7000000 + four_rank * 13 + kicker
    
    # Full House
    if 3 in rank_counts.values() and 2 in rank_counts.values():
        three_rank = [r for r, c in rank_counts.items() if c == 3][0]
        two_rank = [r for r, c in rank_counts.items() if c == 2][0]
        return 6000000 + three_rank * 13 + two_rank
    
    # Flush
    if is_flush:
        return 5000000 + sum(13**i * r for i, r in enumerate(sorted(hand_ranks, reverse=True)))
    
    # Straight
    if is_straight:
        if is_straight_to_five:
            return 4000000 + 5  # A-5 straight
        else:
            return 4000000 + max(distinct_ranks)  # Value of the highest card in straight
    
    # Three of a kind
    if 3 in rank_counts.values():
        three_rank = [r for r, c in rank_counts.items() if c == 3][0]
        kickers = sorted([r for r in distinct_ranks if r != three_rank], reverse=True)
        return 3000000 + three_rank * 13**2 + kickers[0] * 13 + kickers[1]
    
    # Two pair
    if list(rank_counts.values()).count(2) == 2:
        pairs = sorted([r for r, c in rank_counts.items() if c == 2], reverse=True)
        kicker = [r for r in distinct_ranks if r not in pairs][0]
        return 2000000 + pairs[0] * 13**2 + pairs[1] * 13 + kicker
    
    # One pair
    if 2 in rank_counts.values():
        pair_rank = [r for r, c in rank_counts.items() if c == 2][0]
        kickers = sorted([r for r in distinct_ranks if r != pair_rank], reverse=True)
        return 1000000 + pair_rank * 13**3 + kickers[0] * 13**2 + kickers[1] * 13 + kickers[2]
    
    # High card
    sorted_ranks = sorted(hand_ranks, reverse=True)
    return sum(13**i * r for i, r in enumerate(sorted_ranks))

def parse_cards(card_string):
    """Parse a string of cards like 'AH KD' into a list of Card objects."""
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
