import { ClerkProvider, ClerkLoaded, ClerkLoading } from '@clerk/nextjs';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AI Party Game',
  description: 'A fun web-based party game with AI image generation',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // For development purposes, we can conditionally render the ClerkProvider
  // This allows the app to run even without valid Clerk API keys
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  if (isDevelopment) {
    return (
      <html lang="en">
        <body className={inter.className}>{children}</body>
      </html>
    );
  }
  
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <ClerkLoading>
            <div className="flex items-center justify-center min-h-screen">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700"></div>
              <p className="ml-3">Loading authentication...</p>
            </div>
          </ClerkLoading>
          <ClerkLoaded>{children}</ClerkLoaded>
        </body>
      </html>
    </ClerkProvider>
  );
}
