'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import NavBar from '../components/NavBar/NavBar';
import styles from './page.module.css';

export default function StudentInfo() {
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [authToken, setAuthToken] = useState(null);
  const router = useRouter();

  // Check for auth token changes
  useEffect(() => {
    const checkAuth = () => {
      const token = sessionStorage.getItem('authToken');
      setAuthToken(token);
      
      // If there's no token, redirect to login
      if (!token) {
        router.push('/login');
      }
    };
    
    // Check initially
    checkAuth();
    
    // Set up interval to check for auth changes
    const interval = setInterval(checkAuth, 1000);
    
    // Clean up
    return () => clearInterval(interval);
  }, [router]);

  // Fetch student data whenever auth token changes
  useEffect(() => {
    const fetchStudentInfo = async () => {
      if (!authToken) return;
      
      setLoading(true);
      setError(null);
      
      try {
        console.log('Fetching student information...');
        
        const response = await fetch('/api/student-info', {
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        });
        
        console.log('API Response Status:', response.status);
        
        if (response.status === 404) {
          // Handle 404 separately - might be first-time access
          setError('Your student information is not available yet. Please contact the administrator.');
          setLoading(false);
          return;
        }
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch student information');
        }
        
        const data = await response.json();
        console.log('Student data received:', data);
        setStudentData(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching student data:', error);
        setError(error.message);
        setLoading(false);
      }
    };
    
    fetchStudentInfo();
  }, [authToken]);

  // Helper function to render field values with fallback
  const renderValue = (value) => value || 'Not specified';

  // Helper function to format dates
  const formatDate = (date) => {
    if (!date) return 'Not specified';
    try {
      return new Date(date).toLocaleDateString();
    } catch (error) {
      return 'Invalid date';
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <NavBar />
        <div className={styles.loadingContainer}>
          <div className={styles.loader}></div>
          <p>Loading student information...</p>
          <div className={styles.loadingHint}>This may take a few moments</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <NavBar />
        <div className={styles.errorContainer}>
          <div className={styles.errorIcon}>
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </div>
          <h2>Error Loading Data</h2>
          <p>{error}</p>
          <button 
            className={styles.retryButton}
            onClick={() => window.location.reload()}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '8px'}}>
              <polyline points="1 4 1 10 7 10"></polyline>
              <polyline points="23 20 23 14 17 14"></polyline>
              <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path>
            </svg>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <NavBar />
      <div className={styles.studentInfoContainer}>
        <div className={styles.titleWrapper}>
          <h1 className={styles.pageTitle}>Student Information</h1>
        </div>
        
        {studentData && (
          <div className={styles.infoGrid}>
            {/* Personal Details Section */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '8px'}}>
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                Personal Details
              </h2>
              <div className={styles.card}>
                <div className={styles.fieldGroup}>
                  <div className={styles.field}>
                    <label>Enrollment No</label>
                    <p>{renderValue(studentData.enrollment_no)}</p>
                  </div>
                  <div className={styles.field}>
                    <label>Course</label>
                    <p>{renderValue(studentData.course)}</p>
                  </div>
                </div>
                
                <div className={styles.fieldGroup}>
                  <div className={styles.field}>
                    <label>Roll No</label>
                    <p>{renderValue(studentData.roll_no)}</p>
                  </div>
                  <div className={styles.field}>
                    <label>Full Name</label>
                    <p>{renderValue(studentData.full_name)}</p>
                  </div>
                </div>
                
                <div className={styles.fieldGroup}>
                  <div className={styles.field}>
                    <label>Guardian Name</label>
                    <p>{renderValue(studentData.guardian_name)}</p>
                  </div>
                  <div className={styles.field}>
                    <label>Date of Birth</label>
                    <p>{formatDate(studentData.dob)}</p>
                  </div>
                </div>
                
                <div className={styles.fieldGroup}>
                  <div className={styles.field}>
                    <label>Gender</label>
                    <p>{renderValue(studentData.gender)}</p>
                  </div>
                  <div className={styles.field}>
                    <label>Religion</label>
                    <p>{renderValue(studentData.religion)}</p>
                  </div>
                </div>
                
                <div className={styles.fieldGroup}>
                  <div className={styles.field}>
                    <label>Blood Group</label>
                    <p>{renderValue(studentData.blood_group)}</p>
                  </div>
                  <div className={styles.field}>
                    <label>Adhaar No</label>
                    <p>{renderValue(studentData.adhaar_no)}</p>
                  </div>
                </div>
                
                <div className={styles.fieldGroup}>
                  <div className={styles.field}>
                    <label>Height (cm)</label>
                    <p>{renderValue(studentData.height_cm)}</p>
                  </div>
                  <div className={styles.field}>
                    <label>Weight (kg)</label>
                    <p>{renderValue(studentData.weight_kg)}</p>
                  </div>
                </div>
                
                <div className={styles.fieldGroup}>
                  <div className={styles.field}>
                    <label>Identification Mark</label>
                    <p>{renderValue(studentData.identification_mark)}</p>
                  </div>
                  <div className={styles.field}>
                    <label>Languages</label>
                    <p>{renderValue(studentData.language1) && renderValue(studentData.language2) 
                      ? `${renderValue(studentData.language1)}, ${renderValue(studentData.language2)}`
                      : renderValue(studentData.language1) || renderValue(studentData.language2) || 'Not specified'}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Contact Information Section */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '8px'}}>
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
                Contact Information
              </h2>
              <div className={styles.card}>
                <div className={styles.fieldGroup}>
                  <div className={styles.field}>
                    <label>Mobile Number</label>
                    <p>{renderValue(studentData.mobile_no)}</p>
                  </div>
                  <div className={styles.field}>
                    <label>WhatsApp Number</label>
                    <p>{renderValue(studentData.whatsapp_no)}</p>
                  </div>
                </div>
                
                <div className={styles.fieldGroup}>
                  <div className={styles.field}>
                    <label>Email</label>
                    <p>{renderValue(studentData.email)}</p>
                  </div>
                </div>
                
                <div className={styles.fieldGroup}>
                  <div className={styles.field}>
                    <label>Guardian Mobile</label>
                    <p>{renderValue(studentData.guardian_no)}</p>
                  </div>
                  <div className={styles.field}>
                    <label>Guardian Email</label>
                    <p>{renderValue(studentData.guardian_email)}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Permanent Address Section */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '8px'}}>
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                Permanent Address
              </h2>
              <div className={styles.card}>
                <div className={styles.fieldGroup}>
                  <div className={styles.field}>
                    <label>Address</label>
                    <p>{renderValue(studentData.perm_address)}</p>
                  </div>
                </div>
                
                <div className={styles.fieldGroup}>
                  <div className={styles.field}>
                    <label>City</label>
                    <p>{renderValue(studentData.perm_city)}</p>
                  </div>
                  <div className={styles.field}>
                    <label>District</label>
                    <p>{renderValue(studentData.perm_district)}</p>
                  </div>
                </div>
                
                <div className={styles.fieldGroup}>
                  <div className={styles.field}>
                    <label>State</label>
                    <p>{renderValue(studentData.perm_state)}</p>
                  </div>
                  <div className={styles.field}>
                    <label>PIN Code</label>
                    <p>{renderValue(studentData.perm_pin)}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Local Address Section */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '8px'}}>
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
                Local Address
              </h2>
              <div className={styles.card}>
                <div className={styles.fieldGroup}>
                  <div className={styles.field}>
                    <label>Address</label>
                    <p>{renderValue(studentData.local_address)}</p>
                  </div>
                </div>
                
                <div className={styles.fieldGroup}>
                  <div className={styles.field}>
                    <label>City</label>
                    <p>{renderValue(studentData.local_city)}</p>
                  </div>
                  <div className={styles.field}>
                    <label>District</label>
                    <p>{renderValue(studentData.local_district)}</p>
                  </div>
                </div>
                
                <div className={styles.fieldGroup}>
                  <div className={styles.field}>
                    <label>State</label>
                    <p>{renderValue(studentData.local_state)}</p>
                  </div>
                  <div className={styles.field}>
                    <label>PIN Code</label>
                    <p>{renderValue(studentData.local_pin)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 