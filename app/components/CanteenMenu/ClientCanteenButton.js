'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import CanteenButton from './CanteenButton';

// Dynamically import MenuModal with no SSR
const MenuModal = dynamic(() => import('./MenuModal'), { 
  ssr: false,
  loading: () => null
});

export default function ClientCanteenButton() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);

  // Check if we're on the client side and get user data
  useEffect(() => {
    setIsClient(true);
    
    if (typeof window !== 'undefined') {
      try {
        const storedData = sessionStorage.getItem('userData');
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          setUserData(parsedData);
        }
      } catch (err) {
        console.error('Error accessing session storage:', err);
        setError('Failed to retrieve user data');
      }
    }
  }, []);

  const openMenu = () => {
    setIsMenuOpen(true);
  };
  
  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Don't render anything on server side
  if (!isClient) {
    return null;
  }

  // Don't show the button if user is not authenticated
  if (!userData) {
    return null;
  }

  return (
    <>
      <CanteenButton onClick={openMenu} />
      {isMenuOpen && (
        <MenuModal 
          isOpen={isMenuOpen} 
          onClose={closeMenu} 
        />
      )}
    </>
  );
}