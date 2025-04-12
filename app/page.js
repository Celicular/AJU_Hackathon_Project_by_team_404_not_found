'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import styles from './page.module.css';
import NavBar from './components/NavBar/NavBar';
import Hero from './components/Hero/Hero';

// Dynamically import the ClientCanteenButton to avoid hydration errors
const ClientCanteenButton = dynamic(
  () => import('./components/CanteenMenu/ClientCanteenButton'),
  { ssr: false }
);

export default function Home() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Set client-side flag
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    // Only run on client side
    if (!isClient) return;
    
    // Check if user is authenticated
    try {
      const token = sessionStorage.getItem('authToken');
      if (token) {
        setIsAuthenticated(true);
      } else {
        // Redirect to login page if not authenticated
        router.push('/login');
      }
    } catch (err) {
      console.error('Error checking authentication:', err);
      router.push('/login');
    }
  }, [router, isClient]);

  // Don't render anything until we're on the client and authenticated
  if (!isClient || !isAuthenticated) {
    return null;
  }

  return (
    <div className={styles.main}>
      <NavBar />
      <Hero />
      <ClientCanteenButton />
    </div>
  );
} 