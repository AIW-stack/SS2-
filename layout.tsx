
import React from 'react';

/**
 * Root Layout (Next.js App Router Pattern)
 * This component provides the HTML wrapper and global context.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f9fafb] text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      {/* 
        Next.js usually handles fonts via next/font. 
        In this environment, we rely on the index.html head for font loading.
      */}
      {children}
    </div>
