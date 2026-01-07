
import React, { ReactNode } from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SpendShield - Know. Control. Save.',
  description: 'SpendShield helps Indian consumers track, control, and optimize their digital subscriptions across UPI, cards, and app stores to stop silent money leaks.',
};

/**
 * Root Layout Component
 * Following Next.js App Router conventions to provide a global UI shell.
 */
export default function RootLayout({
  children,
}: {
  children?: ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#f9fafb] text-slate-900 selection:bg-indigo-100 selection:text-indigo-900 font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
