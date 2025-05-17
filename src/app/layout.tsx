import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { BottomNav } from './ui/navigation/bottom-nav';
import Image from 'next/image';
import { ClerkProvider } from '@clerk/nextjs';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'TripWell',
  description: 'Plan your trips with ease',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <main className="min-h-screen pb-16">
            {children}
          </main>
          <BottomNav />
        </body>
      </html>
    </ClerkProvider>
  );
}