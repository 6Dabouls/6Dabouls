import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Neero – Votre Plateforme Financière',
  description: 'Gérez vos paiements, transferts et opérations Mobile Money en toute sécurité.',
  keywords: ['mobile money', 'transfert argent', 'paiement', 'fintech', 'Afrique'],
  authors: [{ name: 'Neero' }],
  icons: { icon: '/favicon.ico' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={inter.className}>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: { borderRadius: '10px', background: '#1e3a5f', color: '#fff' },
            success: { style: { background: '#059669' } },
            error: { style: { background: '#dc2626' } },
          }}
        />
      </body>
    </html>
  );
}
