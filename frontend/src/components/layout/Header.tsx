'use client';

import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/layout/Navbar';
import PrivateHeader from '@/components/layout/PrivateHeader';

export default function Header() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <PrivateHeader />;
  }

  return <Navbar />;
}