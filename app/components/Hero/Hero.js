'use client';

import { useEffect, useState } from 'react';
import styles from './Hero.module.css';

export default function Hero() {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    // Get user data from sessionStorage
    const userData = sessionStorage.getItem('userData');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  return (
    <div className={styles.heroContainer}>
      <div className={styles.heroContent}>
        <h1 className={styles.heroTitle}>
          {user ? `Welcome, ${user.name}` : 'Welcome to Student Portal'}
        </h1>
        <p className={styles.heroDescription}>
          Access your academic information, manage assignments, and track your progress - all in one place.
        </p>
        <div className={styles.statsCards}>
          <div className={styles.statsCard}>
            <div className={styles.statsIcon}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <div className={styles.statsContent}>
              <h3>Completed Assignments</h3>
              <p className={styles.statsNumber}>12 <span className={styles.statsPercentage}>/ 15</span></p>
            </div>
          </div>
          <div className={styles.statsCard}>
            <div className={styles.statsIcon}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <div className={styles.statsContent}>
              <h3>Attendance</h3>
              <p className={styles.statsNumber}>87<span className={styles.statsPercentage}>%</span></p>
            </div>
          </div>
          <div className={styles.statsCard}>
            <div className={styles.statsIcon}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path>
                <line x1="4" y1="22" x2="4" y2="15"></line>
              </svg>
            </div>
            <div className={styles.statsContent}>
              <h3>CGPA</h3>
              <p className={styles.statsNumber}>8.5</p>
            </div>
          </div>
        </div>
        <div className={styles.heroCta}>
          <button className={styles.primaryBtn}>View Dashboard</button>
          <button className={styles.secondaryBtn}>Academic Calendar</button>
        </div>
      </div>
      <div className={styles.heroVisual}>
        <div className={styles.heroImage}></div>
      </div>
      <div className={styles.bgShapes}>
        <div className={styles.bgShape1}></div>
        <div className={styles.bgShape2}></div>
        <div className={styles.bgShape3}></div>
      </div>
    </div>
  );
} 