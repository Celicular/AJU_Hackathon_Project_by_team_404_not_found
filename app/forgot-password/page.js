'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './forgot-password.module.css';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // This is just a placeholder - no actual logic
    setSubmitted(true);
  };
  
  return (
    <div className={styles.container}>
      <div className={styles.bgShapes}>
        <div className={styles.bgShape1}></div>
        <div className={styles.bgShape2}></div>
      </div>
      
      <div className={styles.card}>
        <div className={styles.logoContainer}>
          <img src="/128.png" alt="Sync Logo" className={styles.logo} />
          <h1 className={styles.appName}>Sync</h1>
        </div>
        
        {submitted ? (
          <div className={styles.successMessage}>
            <h2>Reset Link Sent</h2>
            <p>If an account exists with this email, you will receive a password reset link shortly.</p>
            <Link href="/login" className={styles.backButton}>
              Return to Login
            </Link>
          </div>
        ) : (
          <>
            <h2 className={styles.title}>Reset your password</h2>
            <p className={styles.description}>
              Enter your email address and we'll send you instructions to reset your password.
            </p>
            
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className={styles.input}
                />
              </div>
              
              <button type="submit" className={styles.submitButton}>
                Send Reset Link
              </button>
              
              <Link href="/login" className={styles.backLink}>
                Back to Login
              </Link>
            </form>
          </>
        )}
      </div>
    </div>
  );
} 