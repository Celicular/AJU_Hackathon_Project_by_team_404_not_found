'use client';

import { useState, useEffect } from 'react';
import styles from './CanteenButton.module.css';

export default function CanteenButton({ onClick }) {
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Handle scroll to hide/show button
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY) {
        setVisible(false); // Scrolling down
      } else {
        setVisible(true); // Scrolling up
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <button 
      className={`${styles.canteenButton} ${visible ? styles.visible : styles.hidden}`}
      onClick={onClick}
      aria-label="Open Canteen Menu"
    >
      <div className={styles.iconWrapper}>
        <svg 
          className={styles.icon} 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            d="M18 4H6C4.89543 4 4 4.89543 4 6V18C4 19.1046 4.89543 20 6 20H18C19.1046 20 20 19.1046 20 18V6C20 4.89543 19.1046 4 18 4Z" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
          />
          <path 
            d="M16 2V6M8 2V6M4 10H20M9 14H7V16H9V14ZM9 14V16M15 14H17M15 16H17M12 14V16" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
        </svg>
        <span className={styles.buttonText}>Canteen</span>
      </div>
    </button>
  );
}