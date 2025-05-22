'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useGameContext } from '@/context/GameContext';
import { GamePlay } from '@/components/game/GamePlay';

export default function OmahaPage() {
  const { gameState, setGameType } = useGameContext();
  
  // Set game type when component mounts
  useEffect(() => {
    setGameType('omaha');
  }, [setGameType]);
  
  return (
    <div className="container mx-auto py-8 px-4">
      <header className="mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Omaha Odds Calculator</h1>
          <Link href="/" className="text-blue-500 hover:underline">
            ← Back to Home
          </Link>
        </div>
      </header>
      
      <div>
        <GamePlay />
      </div>
    </div>
  );
}
