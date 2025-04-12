'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import CanteenButton from '../../app/components/CanteenMenu/CanteenButton';
import styles from './page.module.css';

// Dynamically import MenuModal with no SSR to avoid hydration errors
const MenuModal = dynamic(() => import('../../app/components/CanteenMenu/MenuModal'), { 
  ssr: false 
});

export default function CanteenMenuPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  
  // Set client-side flag
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  useEffect(() => {
    // Only run on client side
    if (!isClient) return;
    
    // Check if user is authenticated by looking for userData in sessionStorage
    try {
      const userData = sessionStorage.getItem('userData');
      if (!userData) {
        router.push('/login');
      } else {
        setIsAuthenticated(true);
      }
    } catch (err) {
      console.error('Error accessing session storage:', err);
      router.push('/login');
    }
  }, [router, isClient]);
  
  const openMenu = () => {
    setIsMenuOpen(true);
  };
  
  const closeMenu = () => {
    setIsMenuOpen(false);
  };
  
  // Don't render anything on server or if not authenticated
  if (!isClient || !isAuthenticated) {
    return null;
  }
  
  return (
    <div className={styles.container}>
      <CanteenButton onClick={openMenu} />
      <MenuModal isOpen={isMenuOpen} onClose={closeMenu} />
    </div>
  );
} 