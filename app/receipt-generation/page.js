'use client';

import { useEffect, useState } from 'react';
import NavBar from '../components/NavBar/NavBar';
import Receipt from '../components/Receipt/Receipt';
import styles from './page.module.css';
import { useRouter } from 'next/navigation';

export default function ReceiptGenerationPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    const userData = sessionStorage.getItem('userData');
    if (userData) {
      setIsAuthenticated(true);
    } else {
      // Redirect to login page if not authenticated
      router.push('/login');
    }
  }, [router]);

  if (!isAuthenticated) {
    return null; // Don't render anything while checking authentication
  }

  return (
    <div className={styles.container}>
      <NavBar />
      <div className={styles.contentWrapper}>
        <Receipt />
      </div>
    </div>
  );
} 