
import React, { ReactNode } from 'react';

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
    <div className="min-h-screen bg-[#f9fafb] text-slate-900 selection:bg-indigo-100 selection:text-indigo-900 font-sans">
      {children}
    </div>
  );
}
