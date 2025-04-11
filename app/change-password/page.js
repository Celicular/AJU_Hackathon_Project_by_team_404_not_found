'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './change-password.module.css';

export default function ChangePassword() {
  const router = useRouter();
  const [userId, setUserId] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    
    try {
      // Validate input format
      if (!userId.match(/^AJU\/\d{6}$/)) {
        setError('User ID must be in the format AJU/######');
        setLoading(false);
        return;
      }
      
      if (currentPassword.length < 6) {
        setError('Current password must be at least 6 characters long');
        setLoading(false);
        return;
      }

      if (newPassword.length < 6) {
        setError('New password must be at least 6 characters long');
        setLoading(false);
        return;
      }
      
      if (newPassword !== confirmPassword) {
        setError('New password and confirm password do not match');
        setLoading(false);
        return;
      }
      
      // Make API call to change password endpoint
      const response = await fetch('/api/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          userId, 
          currentPassword, 
          newPassword 
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Password change failed');
      }
      
      // Handle successful password change
      setSuccess('Password changed successfully! Redirecting to login page...');
      
      // Clear form
      setUserId('');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
      // Redirect to login page after a short delay
      setTimeout(() => {
        router.push('/login');
      }, 2000);
      
    } catch (err) {
      setError(err.message || 'Password change failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.changePasswordContainer}>
      <div className={styles.bgShapes}>
        <div className={styles.bgShape1}></div>
        <div className={styles.bgShape2}></div>
        <div className={styles.bgShape3}></div>
      </div>
      
      <div className={styles.changePasswordCard}>
        <div className={styles.logoContainer}>
          <img src="/128.png" alt="Sync Logo" className={styles.logo} />
          <h1 className={styles.appName}>Sync</h1>
        </div>
        
        <h2 className={styles.changePasswordTitle}>Change Password</h2>
        
        {error && <div className={styles.errorMessage}>{error}</div>}
        {success && <div className={styles.successMessage}>{success}</div>}
        
        <form onSubmit={handleSubmit} className={styles.changePasswordForm}>
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
            <label htmlFor="currentPassword">Current Password</label>
            <input
              type="password"
              id="currentPassword"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter your current password"
              required
              className={styles.input}
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="newPassword">New Password</label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter your new password"
              required
              className={styles.input}
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your new password"
              required
              className={styles.input}
            />
          </div>
          
          <button 
            type="submit" 
            className={styles.changePasswordButton}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Change Password'}
          </button>
        </form>
        
        <div className={styles.formFooter}>
          <Link href="/login" className={styles.backToLogin}>
            Back to Login
          </Link>
        </div>
        
        <div className={styles.changePasswordFooter}>
          <p>© {new Date().getFullYear()} Sync. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
} 