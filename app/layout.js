'use client';

import './globals.css';
import StyledComponentsRegistry from './registry';
import { ModalProvider } from '@/context/ModalContext';
import { Inter, Poppins } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-poppins',
  display: 'swap',
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <head>
        <title>Expense Tracker</title>
        <meta name="description" content="Track your expenses and income with teams" />
      </head>
      <body className={inter.className}>
        <StyledComponentsRegistry>
          <ModalProvider>
            {children}
          </ModalProvider>
        </StyledComponentsRegistry>
        {/* PERMANENT MODAL ROOT - DO NOT REMOVE */}
        {/* This div ensures all modals render at the top level, above all other UI */}
        <div id="modal-root" data-modal-portal="true"></div>
      </body>
    </html>
  );
}
