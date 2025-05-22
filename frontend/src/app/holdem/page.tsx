'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useGameContext } from '@/context/GameContext';
import { GamePlay } from '@/components/game/GamePlay';

export default function HoldemPage() {
  const router = useRouter();
  const { gameState, setGameType } = useGameContext();
  
  // Redirect to the new Texas Hold'em page
  useEffect(() => {
    router.push('/texas-holdem');
  }, [router]);
  
  return (
    <div className="container mx-auto py-8 px-4 flex justify-center items-center h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Redirecting to new Texas Hold'em page...</h1>
        <p>If you are not redirected automatically, please click the button below:</p>
        <Link 
          href="/texas-holdem" 
          className="mt-4 inline-block px-6 py-3 bg-primary-500 text-white font-medium rounded-md hover:bg-primary-600 transition-colors"
        >
          Go to Texas Hold'em Calculator
        </Link>
      </div>
    </div>
  );
}
