'use client';

import { useState, useEffect } from 'react';
import styles from './Hero.module.css';

export default function Hero() {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const token = sessionStorage.getItem('authToken');
    const userDataStr = sessionStorage.getItem('userData');
    
    if (userDataStr) {
      try {
        const userData = JSON.parse(userDataStr);
        setUserData(userData);
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }
  }, []);

  return (
    <div className={styles.heroContainer}>
      <div className={styles.heroContent}>
        <h1 className={styles.heroTitle}>
          {userData ? `Welcome to Sync, ${userData.name}` : 'Welcome to Sync'}
        </h1>
        <p className={styles.heroDescription}>
          Access your academic information, manage assignments, and track your progress - all synchronized in one place.
        </p>
        
        {userData && (
          <div className={styles.userInfo}>
            <div className={styles.userInfoItem}>
              <span className={styles.userInfoLabel}>Enrollment:</span>
              <span className={styles.userInfoValue}>{userData.enrollment}</span>
            </div>
            <div className={styles.userInfoItem}>
              <span className={styles.userInfoLabel}>Course:</span>
              <span className={styles.userInfoValue}>{userData.course}</span>
            </div>
            <div className={styles.userInfoItem}>
              <span className={styles.userInfoLabel}>Batch:</span>
              <span className={styles.userInfoValue}>{userData.batch}</span>
            </div>
          </div>
        )}
        
        <div className={styles.statsCards}>
          <div className={styles.statsCard}>
            <div className={styles.statsIcon}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <div className={styles.statsInfo}>
              <h3>Attendance</h3>
              <p>85%</p>
            </div>
          </div>
          <div className={styles.statsCard}>
            <div className={styles.statsIcon}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
            </div>
            <div className={styles.statsInfo}>
              <h3>Pending</h3>
              <p>3 Tasks</p>
            </div>
          </div>
          <div className={styles.statsCard}>
            <div className={styles.statsIcon}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="7"></circle>
                <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
              </svg>
            </div>
            <div className={styles.statsInfo}>
              <h3>CGPA</h3>
              <p>8.5</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 