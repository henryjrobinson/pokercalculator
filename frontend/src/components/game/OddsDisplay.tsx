'use client';

import React from 'react';
import { GameStage } from '@/types';

interface OddsDisplayProps {
  odds: number;
  stage: GameStage;
  activePlayers: number;
  className?: string;
}

const OddsDisplay: React.FC<OddsDisplayProps> = ({
  odds,
  stage,
  activePlayers,
  className = '',
}) => {
  // Format odds as a percentage with 2 decimal places
  const formatOdds = (value: number): string => {
    return (value * 100).toFixed(2) + '%';
  };

  // Determine background color based on odds
  const getOddsColor = (value: number): string => {
    if (value >= 0.7) return 'bg-green-500';
    if (value >= 0.5) return 'bg-green-400';
    if (value >= 0.3) return 'bg-yellow-400';
    if (value >= 0.2) return 'bg-orange-400';
    return 'bg-red-500';
  };

  // Get display name for game stage
  const getStageName = (stage: GameStage): string => {
    const stageNames: Record<GameStage, string> = {
      'preflop': 'Pre-flop',
      'flop': 'Flop',
      'turn': 'Turn',
      'river': 'River'
    };
    return stageNames[stage];
  };

  // Get appropriate recommendation based on odds
  const getRecommendation = (value: number): string => {
    if (value >= 0.7) return 'Strong position - consider raising';
    if (value >= 0.5) return 'Good position - consider calling or raising';
    if (value >= 0.3) return 'Moderate position - consider calling';
    if (value >= 0.2) return 'Weak position - consider checking';
    return 'Poor position - consider folding';
  };

  return (
    <div className={`card p-6 ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Win Probability</h3>
        <div className="bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 px-3 py-1 rounded-full text-sm font-medium">
          {getStageName(stage)}
        </div>
      </div>

      <div className="flex flex-col items-center mb-6">
        <div className="text-5xl font-bold text-center text-primary-600 dark:text-primary-400 mb-2">
          {formatOdds(odds)}
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Against {activePlayers - 1} opponent{activePlayers - 1 !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Odds visualization bar */}
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mb-4 overflow-hidden">
        <div 
          className={`h-full ${getOddsColor(odds)} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${Math.min(odds * 100, 100)}%` }}
        ></div>
      </div>

      {/* Recommendation */}
      <div className="text-sm bg-gray-50 dark:bg-gray-800 p-3 rounded-md border border-gray-200 dark:border-gray-700">
        <span className="font-medium">Suggestion: </span>
        {getRecommendation(odds)}
      </div>

      <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
        *Based on Monte Carlo simulation with 10,000 iterations
      </div>
    </div>
  );
};

export default OddsDisplay;
