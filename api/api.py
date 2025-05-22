from flask import Flask, request, jsonify, session
import uuid
import os
from texas_holdem_odds import calculate_odds as calculate_holdem_odds, parse_cards
from omaha_odds import calculate_odds as calculate_omaha_odds, parse_cards as parse_omaha_cards
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})
app.secret_key = os.environ.get('SECRET_KEY', 'dev_secret_key_replace_in_production')

# Rate limiting variables
MAX_REQUESTS_PER_MINUTE = 100
MAX_REQUESTS_PER_DAY = 1000

@app.route('/api/start_game', methods=['POST'])
def start_game():
    """Start a new poker game and calculate initial odds."""
    try:
        data = request.get_json()
        
        # Validate input
        if not data:
            return jsonify({"error": "No data provided"}), 400
            
        required_fields = ['game_type', 'my_hand', 'num_players']
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing required field: {field}"}), 400
        
        # Validate game type
        if data['game_type'] not in ['holdem', 'omaha']:
            return jsonify({"error": "Game type must be 'holdem' or 'omaha'"}), 400
            
        # Validate number of players
        try:
            num_players = int(data['num_players'])
            if num_players < 2 or num_players > 10:
                return jsonify({"error": "Number of players must be between 2 and 10"}), 400
        except ValueError:
            return jsonify({"error": "Number of players must be an integer"}), 400
            
        # Validate hand
        my_hand_str = data['my_hand'].strip().upper()
        try:
            if data['game_type'] == 'holdem':
                my_hand = parse_cards(my_hand_str)
                if len(my_hand) != 2:
                    return jsonify({"error": "Texas Hold'em requires exactly 2 cards"}), 400
            else:  # Omaha
                my_hand = parse_omaha_cards(my_hand_str)
                if len(my_hand) != 4:
                    return jsonify({"error": "Omaha requires exactly 4 cards"}), 400
        except ValueError as e:
            return jsonify({"error": str(e)}), 400
        
        # Create new game session
        session['game_id'] = str(uuid.uuid4())
        session['game_type'] = data['game_type']
        session['active_players'] = num_players
        session['my_hand'] = my_hand_str
        session['community_cards'] = ''
        session['stage'] = 'preflop'
        
        # Calculate odds
        if session['game_type'] == 'holdem':
            odds = calculate_holdem_odds(session['active_players'], 
                                         my_hand, 
                                         [])
        else:  # Omaha
            odds = calculate_omaha_odds(session['active_players'], 
                                        my_hand, 
                                        [])
        
        # Initialize hand history if it doesn't exist
        if 'hand_history' not in session:
            session['hand_history'] = []
        
        # Add new hand to history
        new_hand = {
            'game_type': session['game_type'],
            'my_hand': session['my_hand'],
            'community_cards': '',
            'odds': odds,
            'players': session['active_players']
        }
        
        # Insert at the beginning of the list
        session['hand_history'].insert(0, new_hand)
        
        # Keep only the last 10 hands
        session['hand_history'] = session['hand_history'][:10]
        
        return jsonify({
            'game_id': session['game_id'],
            'odds': odds,
            'stage': session['stage'],
            'active_players': session['active_players'],
            'hand_history': session['hand_history']
        })
    
    except Exception as e:
        app.logger.error(f"Error in start_game: {str(e)}")
        return jsonify({"error": "An unexpected error occurred"}), 500

@app.route('/api/update_game', methods=['POST'])
def update_game():
    """Update game state with new community cards and calculate updated odds."""
    try:
        data = request.get_json()
        
        # Validate input
        if not data:
            return jsonify({"error": "No data provided"}), 400
            
        required_fields = ['game_id', 'community_cards', 'active_players', 'stage']
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing required field: {field}"}), 400
        
        # Validate game session
        if 'game_id' not in session or session['game_id'] != data['game_id']:
            return jsonify({'error': 'Invalid game session'}), 400
        
        # Validate active players
        try:
            active_players = int(data['active_players'])
            if active_players < 2 or active_players > 10:
                return jsonify({"error": "Number of active players must be between 2 and 10"}), 400
        except ValueError:
            return jsonify({"error": "Number of active players must be an integer"}), 400
            
        # Validate stage
        if data['stage'] not in ['preflop', 'flop', 'turn', 'river']:
            return jsonify({"error": "Invalid game stage"}), 400
            
        # Validate community cards based on stage
        community_cards_str = data['community_cards'].strip().upper()
        try:
            community_cards = parse_cards(community_cards_str)
            expected_cards = {'preflop': 0, 'flop': 3, 'turn': 4, 'river': 5}
            if len(community_cards) != expected_cards[data['stage']]:
                return jsonify({
                    "error": f"Stage '{data['stage']}' requires exactly {expected_cards[data['stage']]} community cards"
                }), 400
        except ValueError as e:
            return jsonify({"error": str(e)}), 400
        
        # Update session
        session['active_players'] = active_players
        session['community_cards'] = community_cards_str
        session['stage'] = data['stage']
        
        # Calculate updated odds
        if session['game_type'] == 'holdem':
            my_hand = parse_cards(session['my_hand'])
            odds = calculate_holdem_odds(session['active_players'], 
                                         my_hand, 
                                         community_cards)
        else:  # Omaha
            my_hand = parse_omaha_cards(session['my_hand'])
            odds = calculate_omaha_odds(session['active_players'], 
                                        my_hand, 
                                        community_cards)
        
        # Update the current hand in history
        if session['hand_history']:
            session['hand_history'][0].update({
                'community_cards': session['community_cards'],
                'odds': odds,
                'players': session['active_players']
            })
        
        return jsonify({
            'odds': odds,
            'stage': session['stage'],
            'active_players': session['active_players'],
            'hand_history': session['hand_history']
        })
    
    except Exception as e:
        app.logger.error(f"Error in update_game: {str(e)}")
        return jsonify({"error": "An unexpected error occurred"}), 500

@app.route('/api/reset_game', methods=['POST'])
def reset_game():
    """Reset the current game session."""
    try:
        session.pop('game_id', None)
        session.pop('game_type', None)
        session.pop('my_hand', None)
        session.pop('community_cards', None)
        session.pop('stage', None)
        session.pop('active_players', None)
        
        return jsonify({'status': 'reset_successful'})
    
    except Exception as e:
        app.logger.error(f"Error in reset_game: {str(e)}")
        return jsonify({"error": "An unexpected error occurred"}), 500

@app.route('/api/hand_history', methods=['GET'])
def get_hand_history():
    """Get the hand history."""
    try:
        return jsonify({'hand_history': session.get('hand_history', [])})
    
    except Exception as e:
        app.logger.error(f"Error in get_hand_history: {str(e)}")
        return jsonify({"error": "An unexpected error occurred"}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
