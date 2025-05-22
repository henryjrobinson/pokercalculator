'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero section */}
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-5xl font-bold mb-6 text-gray-900 dark:text-white">
          Poker Odds Calculator
        </h1>
        <p className="text-xl mb-10 text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Make better poker decisions with real-time odds calculation powered by Monte Carlo simulation
        </p>
        
        {/* Game variant cards */}
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 my-16">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transform transition-all hover:scale-105 hover:shadow-xl">
            <div className="h-3 bg-primary-500 w-full"></div>
            <div className="p-8">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Texas Hold'em</h2>
              <p className="mb-6 text-gray-600 dark:text-gray-300">
                Calculate precise winning odds for Texas Hold'em poker with 2 hole cards and up to 5 community cards.
                Perfect for tournament and cash game players looking for a statistical edge.
              </p>
              <Link href="/texas-holdem" className="inline-block px-6 py-3 bg-primary-500 text-white font-medium rounded-md hover:bg-primary-600 transition-colors">
                Open Texas Hold'em Calculator
              </Link>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transform transition-all hover:scale-105 hover:shadow-xl">
            <div className="h-3 bg-secondary-500 w-full"></div>
            <div className="p-8">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Omaha</h2>
              <p className="mb-6 text-gray-600 dark:text-gray-300">
                Calculate winning probabilities for Omaha poker with 4 hole cards and up to 5 community cards.
                Analyze complex hand combinations and make data-driven decisions in every pot.
              </p>
              <Link href="/omaha" className="inline-block px-6 py-3 bg-secondary-500 text-white font-medium rounded-md hover:bg-secondary-600 transition-colors">
                Open Omaha Calculator
              </Link>
            </div>
          </div>
        </div>
        
        {/* Features section */}
        <div className="max-w-5xl mx-auto py-12">
          <h2 className="text-3xl font-bold mb-10 text-gray-900 dark:text-white">Key Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-center text-gray-900 dark:text-white">Real-time Odds</h3>
              <p className="text-gray-600 dark:text-gray-300 text-center">
                Get instant probability updates as community cards are revealed, helping you make better decisions at every stage.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-center text-gray-900 dark:text-white">Visual Interface</h3>
              <p className="text-gray-600 dark:text-gray-300 text-center">
                Intuitive card selection with visual feedback helps you quickly input your hand and community cards.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-center text-gray-900 dark:text-white">Hand Analysis</h3>
              <p className="text-gray-600 dark:text-gray-300 text-center">
                Get detailed hand strength evaluation and strategic recommendations based on your current position.
              </p>
            </div>
          </div>
        </div>
        
        {/* How it works section */}
        <div className="max-w-4xl mx-auto py-12 px-4">
          <h2 className="text-3xl font-bold mb-10 text-gray-900 dark:text-white">How It Works</h2>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            <ol className="space-y-6">
              <li className="flex items-center">
                <div className="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  1
                </div>
                <p className="text-gray-700 dark:text-gray-300"><span className="font-semibold">Choose a poker variant</span> - Select between Texas Hold'em and Omaha based on your game.</p>
              </li>
              <li className="flex items-center">
                <div className="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  2
                </div>
                <p className="text-gray-700 dark:text-gray-300"><span className="font-semibold">Select your cards</span> - Use the visual card picker to input your hole cards.</p>
              </li>
              <li className="flex items-center">
                <div className="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  3
                </div>
                <p className="text-gray-700 dark:text-gray-300"><span className="font-semibold">Add community cards</span> - Input the flop, turn, and river as they are revealed.</p>
              </li>
              <li className="flex items-center">
                <div className="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  4
                </div>
                <p className="text-gray-700 dark:text-gray-300"><span className="font-semibold">View your odds</span> - Get real-time probability updates and hand strength analysis.</p>
              </li>
              <li className="flex items-center">
                <div className="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  5
                </div>
                <p className="text-gray-700 dark:text-gray-300"><span className="font-semibold">Make informed decisions</span> - Use the calculated odds to guide your betting decisions.</p>
              </li>
            </ol>
          </div>
        </div>
      </div>
      
      {/* Footer section */}
      <footer className="mt-16 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-8">
        <div className="container mx-auto px-4 text-center text-gray-600 dark:text-gray-300">
          <p> 2024 Poker Odds Calculator. All rights reserved.</p>
          <p className="mt-2">Developed with Next.js, TypeScript and Tailwind CSS.</p>
        </div>
      </footer>
    </div>
  );
}
