'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import NavBar from './components/NavBar/NavBar';
import Hero from './components/Hero/Hero';

export default function Home() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    const token = sessionStorage.getItem('authToken');
    if (token) {
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
    <div className={styles.main}>
      <NavBar />
      <Hero />
    </div>
  );
} 