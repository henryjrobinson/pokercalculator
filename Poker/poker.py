from flask import Flask, request, jsonify, render_template, session
from texas_holdem_odds import calculate_odds, parse_cards
import uuid

app = Flask(__name__)
app.secret_key = 'your_secret_key_here'  # Replace with a real secret key

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/start_game', methods=['POST'])
def start_game():
    data = request.json
    session['game_id'] = str(uuid.uuid4())
    session['active_players'] = int(data['num_players'])
    session['my_hand'] = data['my_hand']
    session['community_cards'] = ''
    session['stage'] = 'preflop'
    
    odds = calculate_odds(session['active_players'], 
                          parse_cards(session['my_hand']), 
                          [])
    
    # Initialize hand history if it doesn't exist
    if 'hand_history' not in session:
        session['hand_history'] = []
    
    # Add new hand to history
    new_hand = {
        'my_hand': session['my_hand'],
        'community_cards': '',
        'odds': odds,
        'players': session['active_players']
    }
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

@app.route('/update_game', methods=['POST'])
def update_game():
    data = request.json
    if 'game_id' not in session or session['game_id'] != data['game_id']:
        return jsonify({'error': 'Invalid game session'}), 400
    
    session['active_players'] = int(data['active_players'])
    session['community_cards'] = data['community_cards']
    session['stage'] = data['stage']
    
    odds = calculate_odds(session['active_players'], 
                          parse_cards(session['my_hand']), 
                          parse_cards(session['community_cards']))
    
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

@app.route('/reset_game', methods=['POST'])
def reset_game():
    if 'hand_history' in session:
        del session['hand_history']
    session.clear()
    return jsonify({'status': 'success'})

@app.route('/get_hand_history', methods=['GET'])
def get_hand_history():
    return jsonify(session.get('hand_history', []))

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
