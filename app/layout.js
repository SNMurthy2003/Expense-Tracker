'use client';

import './globals.css';
import StyledComponentsRegistry from './registry';
import { ModalProvider } from '@/context/ModalContext';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>Expense Tracker</title>
        <meta name="description" content="Track your expenses and income with teams" />
      </head>
      <body>
        <StyledComponentsRegistry>
          <ModalProvider>
            {children}
          </ModalProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
