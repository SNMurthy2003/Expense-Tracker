'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import AppLayout from '@/components/AppLayout';
import { auth } from '@/firebase';
import { signOut } from 'firebase/auth';

export default function ProtectedLayout({ children }) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('user');
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AppLayout onLogout={handleLogout}>
      {children}
    </AppLayout>
  );
}
