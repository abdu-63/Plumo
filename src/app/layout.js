import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import { Providers } from './providers';
import { Suspense } from 'react';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Plumo',
  description: 'Regarder les kaï Fankai en streaming !',
  icons: {
    icon: '/logo_navigateur.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <Suspense fallback={<div style={{ height: '64px', background: 'rgba(10,10,10,0.8)' }}></div>}>
            <Navbar />
          </Suspense>
          {children}
        </Providers>
      </body>
    </html>
  );
}
