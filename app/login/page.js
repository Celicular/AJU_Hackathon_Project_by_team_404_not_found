'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './login.module.css';
import Link from 'next/link';

export default function Login() {
  const router = useRouter();
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const token = sessionStorage.getItem('authToken');
    if (token) {
      router.push('/');
      return;
    }
    
    // Check if remembered credentials exist
    const savedUserId = localStorage.getItem('savedUserId');
    if (savedUserId) {
      setUserId(savedUserId);
      setRememberMe(true);
    }
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      // Validate input format
      if (!userId.match(/^AJU\/\d{6}$/)) {
        setError('User ID must be in the format AJU/######');
        setLoading(false);
        return;
      }
      
      if (password.length < 6) {
        setError('Password must be at least 6 characters long');
        setLoading(false);
        return;
      }
      
      // Make API call to login endpoint
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, password }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Authentication failed');
      }
      
      // Handle successful login
      const { token, user } = data;
      
      // Store token and user data
      sessionStorage.setItem('authToken', token);
      sessionStorage.setItem('userData', JSON.stringify(user));
      
      // If "Remember Me" is checked, store userId in localStorage
      if (rememberMe) {
        localStorage.setItem('savedUserId', userId);
      } else {
        localStorage.removeItem('savedUserId');
      }
      
      // Redirect to dashboard
      router.push('/');
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.bgShapes}>
        <div className={styles.bgShape1}></div>
        <div className={styles.bgShape2}></div>
        <div className={styles.bgShape3}></div>
      </div>
      
      <div className={styles.loginCard}>
        <div className={styles.logoContainer}>
          <img src="/128.png" alt="Sync Logo" className={styles.logo} />
          <h1 className={styles.appName}>Sync</h1>
        </div>
        
        <h2 className={styles.loginTitle}>Log in to your account</h2>
        
        {error && <div className={styles.errorMessage}>{error}</div>}
        
        <form onSubmit={handleSubmit} className={styles.loginForm}>
          <div className={styles.formGroup}>
            <label htmlFor="userId">User ID</label>
            <input
              type="text"
              id="userId"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="AJU/######"
              required
              className={styles.input}
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className={styles.input}
            />
          </div>
          
          <div className={styles.formOptions}>
            <div className={styles.checkboxGroup}>
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className={styles.checkbox}
              />
              <label htmlFor="rememberMe">Remember me</label>
            </div>
            
            <Link href="/change-password" className={styles.forgotPassword}>
              Change Password
            </Link>
          </div>
          
          <button 
            type="submit" 
            className={styles.loginButton}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Log in'}
          </button>
        </form>
        
        <div className={styles.loginFooter}>
          <p>© {new Date().getFullYear()} Sync. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
} 