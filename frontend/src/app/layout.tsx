import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { GameProvider } from '@/context/GameContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Poker Odds Calculator',
  description: 'Calculate your poker winning odds with Monte Carlo simulation',
  keywords: 'poker, calculator, odds, texas holdem, omaha, monte carlo',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <GameProvider>
          <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            <Navbar />
            <main className="flex-grow container mx-auto px-4 py-8">
              {children}
            </main>
            <Footer />
          </div>
        </GameProvider>
      </body>
    </html>
  );
}
