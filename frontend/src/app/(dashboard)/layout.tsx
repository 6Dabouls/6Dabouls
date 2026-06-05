'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { PageLoader } from '@/components/ui/LoadingSpinner';
import { setAccessToken } from '@/services/api';

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, isLoading, accessToken, user, setLoading } = useAuthStore();

  useEffect(() => {
    // Initialize auth from localStorage
    const storedToken = localStorage.getItem('accessToken');
    if (storedToken) {
      setAccessToken(storedToken);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) return <PageLoader text="Vérification de la session..." />;
  if (!isAuthenticated) return <PageLoader text="Redirection..." />;

  return <DashboardLayout>{children}</DashboardLayout>;
}
