
import React, { ReactNode } from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'SpendShield - Know. Control. Save.',
  description: 'SpendShield helps Indian consumers track, control, and optimize their digital subscriptions across UPI, cards, and app stores to stop silent money leaks.',
};

export default function RootLayout({
  children,
}: {
  children?: ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} font-sans min-h-screen bg-[#f9fafb] text-slate-900 selection:bg-indigo-100 selection:text-indigo-900 antialiased`}>
        {children}
      </body>
    </html>
  );
}
