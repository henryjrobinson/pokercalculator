# Poker Odds Calculator

A modern, cloud-ready web application that calculates poker winning odds using Monte Carlo simulation. This calculator supports both Texas Hold'em and Omaha poker variants, with a visually appealing and intuitive user interface.

![Poker Calculator](.github/images/calculator-preview.png)

## Features

- **Real-time odds calculation** using Monte Carlo simulation
- Support for **Texas Hold'em** and **Omaha** poker variants
- Visual card selection interface with suit grouping
- Track game progression through different stages (Preflop, Flop, Turn, River)
- Animated card transitions and interactions
- Adjustable number of players and ability to account for folded players
- Hand history tracking to review previous calculations
- Responsive design that works on desktop and mobile devices
- Dark mode support for comfortable usage in low-light environments
- Cloud-ready deployment with Vercel

## Technology Stack

### Frontend
- **Next.js** - React framework with server-side rendering
- **TypeScript** - For type safety and better developer experience
- **Tailwind CSS** - Utility-first CSS framework for styling
- **React Context API** - For state management
- **React Query** - For efficient data fetching and caching

### Backend
- **Python Flask** - Lightweight API server
- **Flask-CORS** - For handling cross-origin requests
- **Python Poker Evaluation Library** - For accurate hand strength calculation

### Deployment
- **Vercel** - For frontend and serverless backend deployment
- **GitHub Actions** - For CI/CD workflows

## Architecture

The application follows a modern architecture with a clear separation of concerns:

```
frontend/
├── src/
│   ├── app/              # Next.js pages and routing
│   ├── components/       # React components
│   │   ├── cards/        # Card-related components
│   │   ├── game/         # Game-related components
│   │   └── ui/           # General UI components
│   ├── context/          # React context providers
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility functions and API clients
│   └── types/            # TypeScript type definitions
│
backend/
├── app.py               # Flask application entry point
├── calculator/          # Poker odds calculation modules
└── tests/               # Backend tests
```

## How It Works

The calculator uses a Monte Carlo simulation approach to estimate winning probabilities:

1. For each simulation, it deals random cards to complete the community cards
2. It then deals random cards to other players
3. All possible hands are evaluated according to standard poker hand rankings
4. Your winning percentage is calculated based on thousands of simulations

## Card Notation

Cards are represented visually in the UI, but internally they use a two-character notation:
- First character: Rank (2-9, T for 10, J, Q, K, A)
- Second character: Suit (H for Hearts, D for Diamonds, C for Clubs, S for Spades)

Examples:
- `AH` = Ace of Hearts
- `KD` = King of Diamonds
- `TS` = Ten of Spades

## Deployment

The application is configured for easy deployment to Vercel:

1. Sign up for a [Vercel account](https://vercel.com/signup)
2. Fork or clone this repository
3. Connect your GitHub repository to Vercel
4. Configure the environment variables in the Vercel dashboard
5. Deploy the project

## Local Development

To run the application locally:

```bash
# Clone the repository
git clone https://github.com/yourusername/pokercalculator.git
cd pokercalculator

# Install dependencies
pip install -r requirements.txt

# Run the application
python api/index.py
```

The application will be available at http://localhost:5000
