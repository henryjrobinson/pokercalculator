'use client';

import React from 'react';
import { GameStage } from '@/types';

interface StageProgressProps {
  currentStage: GameStage;
  className?: string;
}

const StageProgress: React.FC<StageProgressProps> = ({ 
  currentStage,
  className = '' 
}) => {
  const stages: GameStage[] = ['preflop', 'flop', 'turn', 'river'];
  
  // Get the index of the current stage
  const currentIndex = stages.indexOf(currentStage);
  
  // Map of stage names for display
  const stageNames: Record<GameStage, string> = {
    'preflop': 'Pre-flop',
    'flop': 'Flop',
    'turn': 'Turn',
    'river': 'River'
  };
  
  // Get stage description
  const stageDescriptions: Record<GameStage, string> = {
    'preflop': 'Initial hand evaluation',
    'flop': 'First three community cards',
    'turn': 'Fourth community card',
    'river': 'Fifth and final community card'
  };
  
  return (
    <div className={`${className}`}>
      <div className="relative">
        {/* Progress bar */}
        <div className="h-1 w-full bg-gray-200 dark:bg-gray-700 absolute top-5 z-0"></div>
        
        {/* Completed progress */}
        <div 
          className="h-1 bg-primary-500 dark:bg-primary-400 absolute top-5 z-10 transition-all duration-500 ease-out"
          style={{ 
            width: `${currentIndex === 0 ? 0 : (currentIndex / (stages.length - 1)) * 100}%` 
          }}
        ></div>
        
        {/* Stage markers */}
        <div className="relative z-20 flex justify-between">
          {stages.map((stage, index) => {
            // Determine the state of this stage marker
            const isActive = index === currentIndex;
            const isCompleted = index < currentIndex;
            
            return (
              <div key={stage} className="flex flex-col items-center">
                {/* Marker circle */}
                <div 
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center
                    transition-all duration-300 ease-in-out
                    ${isActive 
                      ? 'bg-primary-500 text-white shadow-lg ring-4 ring-primary-100 dark:ring-primary-900' 
                      : isCompleted 
                        ? 'bg-primary-500 text-white' 
                        : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-2 border-gray-300 dark:border-gray-600'
                    }
                  `}
                >
                  {isCompleted ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <span className="text-sm font-medium">{index + 1}</span>
                  )}
                </div>
                
                {/* Stage name */}
                <div 
                  className={`
                    mt-2 text-sm font-medium 
                    ${isActive 
                      ? 'text-primary-700 dark:text-primary-300' 
                      : isCompleted 
                        ? 'text-primary-600 dark:text-primary-400' 
                        : 'text-gray-500 dark:text-gray-400'
                    }
                  `}
                >
                  {stageNames[stage]}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Current stage description */}
      <div className="mt-6 p-3 bg-gray-50 dark:bg-gray-800 rounded-md text-sm border border-gray-200 dark:border-gray-700">
        <span className="font-medium">{stageNames[currentStage]}:</span> {stageDescriptions[currentStage]}
      </div>
    </div>
  );
};

export default StageProgress;
