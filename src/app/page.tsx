'use client';

import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (isAuthenticated) {
        router.push('/dashboard');
      } else {
        router.push('/login');
      }
    }
  }, [loading, isAuthenticated, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <img src="/wo-axolot.png" alt="Logo Wo! Money" className="w-40 mb-6 invert" />
      <p className="text-lg text-dark-purple font-semibold">Carregando...</p>
    </div>
  );
}
