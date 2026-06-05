'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { PageLoader } from '@/components/ui/LoadingSpinner';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, user, isLoading } = useAuthStore();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push('/login');
      } else if (user?.role === 'USER') {
        router.push('/dashboard');
      }
    }
  }, [isAuthenticated, isLoading, user, router]);

  if (isLoading) return <PageLoader text="Vérification des permissions..." />;
  if (!isAuthenticated || user?.role === 'USER') return <PageLoader />;

  return <DashboardLayout>{children}</DashboardLayout>;
}
