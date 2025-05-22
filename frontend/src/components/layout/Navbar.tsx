'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();
  
  // Check if a route is active
  const isActive = (path: string) => {
    if (path === '/holdem' || path === '/texas-holdem') {
      return pathname === '/holdem' || pathname === '/texas-holdem';
    }
    return pathname === path;
  };
  
  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-primary-600 dark:text-primary-400">
                Poker Calculator
              </span>
            </Link>
          </div>
          
          <div className="flex items-center">
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              <Link 
                href="/" 
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 ${
                  isActive('/') 
                    ? 'border-primary-500 text-gray-900 dark:text-white' 
                    : 'border-transparent text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-700'
                }`}
              >
                Home
              </Link>
              
              <Link 
                href="/texas-holdem" 
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 ${
                  isActive('/texas-holdem') 
                    ? 'border-primary-500 text-gray-900 dark:text-white' 
                    : 'border-transparent text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-700'
                }`}
              >
                Texas Hold'em
              </Link>
              
              <Link 
                href="/omaha" 
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 ${
                  isActive('/omaha') 
                    ? 'border-primary-500 text-gray-900 dark:text-white' 
                    : 'border-transparent text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-700'
                }`}
              >
                Omaha
              </Link>
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button 
              type="button" 
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-gray-200"
              aria-label="Open main menu"
            >
              <svg 
                className="h-6 w-6" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className="hidden md:hidden">
        <div className="px-2 pt-2 pb-3 space-y-1">
          <Link 
            href="/" 
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              isActive('/') 
                ? 'bg-primary-50 dark:bg-primary-900 text-primary-700 dark:text-primary-300' 
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            Home
          </Link>
          
          <Link 
            href="/texas-holdem" 
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              isActive('/texas-holdem') 
                ? 'bg-primary-50 dark:bg-primary-900 text-primary-700 dark:text-primary-300' 
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            Texas Hold'em
          </Link>
          
          <Link 
            href="/omaha" 
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              isActive('/omaha') 
                ? 'bg-primary-50 dark:bg-primary-900 text-primary-700 dark:text-primary-300' 
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            Omaha
          </Link>
        </div>
      </div>
    </nav>
  );
}
