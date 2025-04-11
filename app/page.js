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
      // For now, we'll just set as authenticated without redirecting
      // In a real app, you would uncomment this to redirect to login
      // router.push('/login');
      setIsAuthenticated(true); // For demo purposes
    }
  }, [router]);

  const handleLogout = () => {
    // Clear authentication data
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('userData');
    // Clear any localStorage items related to auth
    localStorage.removeItem('savedUserId');
    // Redirect to login (uncomment when login page is ready)
    // router.push('/login');
  };

  if (!isAuthenticated) {
    return null; // Don't render anything while checking authentication
  }

  return (
    <div className={styles.main}>
      <NavBar onLogout={handleLogout} />
      <Hero />
    </div>
  );
} 