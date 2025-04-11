'use client';

import { useState, useEffect } from 'react';
import styles from './Receipt.module.css';

export default function Receipt() {
  const [studentInfo, setStudentInfo] = useState(null);
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [selectedSemester, setSelectedSemester] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get enrollment number from session storage
        const userDataStr = sessionStorage.getItem('userData');
        if (!userDataStr) {
          setError('User data not found. Please login again.');
          setLoading(false);
          return;
        }

        const userData = JSON.parse(userDataStr);
        const enrollment = userData.enrollment;

        if (!enrollment) {
          setError('Enrollment number not found. Please login again.');
          setLoading(false);
          return;
        }

        // Fetch student info
        const studentResponse = await fetch(`/api/student-info?enrollment_no=${enrollment}`);
        if (!studentResponse.ok) {
          throw new Error('Failed to fetch student information');
        }
        const studentData = await studentResponse.json();

        // Fetch payment info
        const paymentResponse = await fetch(`/api/online-payment?enrollment_no=${enrollment}`);
        if (!paymentResponse.ok) {
          throw new Error('Failed to fetch payment information');
        }
        const paymentData = await paymentResponse.json();

        if (paymentData.success && paymentData.data) {
          setPaymentInfo(paymentData.data);
          setSelectedSemester(paymentData.data.current_semester || 1);
        } else {
          setError('Payment data not available');
        }

        setStudentInfo(studentData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSemesterChange = (e) => {
    setSelectedSemester(parseInt(e.target.value, 10));
  };

  const calculatePerSemesterFee = () => {
    if (!paymentInfo) return 0;
    return paymentInfo.total_fees / 1;
  };

  const calculateBusFeePerSemester = () => {
    if (!paymentInfo || !paymentInfo.has_bus_facility) return 0;
    return paymentInfo.bus_fee / 1;
  };

  const calculateTotalPerSemester = () => {
    return calculatePerSemesterFee() + calculateBusFeePerSemester();
  };

  const calculateTotalDues = () => {
    if (!paymentInfo) return 0;
    
    const totalPerSemester = calculateTotalPerSemester();
    let unpaidSemesters = 0;
    
    for (let i = 1; i <= paymentInfo.total_semesters; i++) {
      if (!paymentInfo[`semester${i}_paid`]) {
        unpaidSemesters++;
      }
    }
    
    return totalPerSemester * unpaidSemesters;
  };

  const handlePrint = () => {
    const printContent = document.getElementById('receipt-to-print');
    const originalContents = document.body.innerHTML;
    
    document.body.innerHTML = printContent.innerHTML;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload();
  };

  if (loading) return <div className={styles.loading}>Loading receipt information...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.receiptContainer}>
      <div className={styles.receiptHeader}>
        <h1>Fee Receipt Generator</h1>
        <div className={styles.actions}>
          <div className={styles.selectWrapper}>
            <label htmlFor="semester-select">Select Semester: </label>
            <select 
              id="semester-select" 
              value={selectedSemester} 
              onChange={handleSemesterChange}
              className={styles.semesterSelect}
            >
              {paymentInfo && [...Array(paymentInfo.total_semesters)].map((_, index) => (
                <option key={index + 1} value={index + 1}>
                  Semester {index + 1}
                </option>
              ))}
            </select>
          </div>
          <button 
            onClick={handlePrint} 
            className={styles.printButton}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.printIcon}>
              <polyline points="6 9 6 2 18 2 18 9"></polyline>
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
              <rect x="6" y="14" width="12" height="8"></rect>
            </svg>
            Generate Receipt
          </button>
        </div>
      </div>

      {studentInfo && paymentInfo && (
        <div className={styles.receiptWrapper}>
          <div className={styles.receipt} id="receipt-to-print">
            <div className={styles.receiptTitle}>
              <h2>Fee Receipt - Semester {selectedSemester}</h2>
              <div className={paymentInfo[`semester${selectedSemester}_paid`] ? styles.paidStatus : styles.unpaidStatus}>
                {paymentInfo[`semester${selectedSemester}_paid`] ? 'PAID' : 'UNPAID'}
              </div>
            </div>
            
            <div className={styles.receiptContent}>
              <div className={styles.studentDetails}>
                <h3>Student Information</h3>
                <div className={styles.detailsGrid}>
                  <div className={styles.detailItem}>
                    <span className={styles.label}>Student Name:</span>
                    <span className={styles.value}>{studentInfo.full_name}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.label}>Enrollment Number:</span>
                    <span className={styles.value}>{studentInfo.enrollment_no}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.label}>Course:</span>
                    <span className={styles.value}>{studentInfo.course}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.label}>Current Semester:</span>
                    <span className={styles.value}>{studentInfo.csem} of {paymentInfo.total_semesters}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.label}>Bus Facility:</span>
                    <span className={styles.value}>{paymentInfo.has_bus_facility ? 'Yes' : 'No'}</span>
                  </div>
                </div>
              </div>
              
              <div className={styles.feesDetails}>
                <h3>Fee Details</h3>
                <div className={styles.feeTable}>
                  <div className={styles.feeRow}>
                    <div className={styles.feeItem}>Course Fee (per semester)</div>
                    <div className={styles.feeAmount}>
                      ₹{calculatePerSemesterFee().toFixed(2)}
                    </div>
                  </div>
                  
                  {paymentInfo.has_bus_facility && (
                    <div className={styles.feeRow}>
                      <div className={styles.feeItem}>Bus Fee (per semester)</div>
                      <div className={styles.feeAmount}>
                        ₹{calculateBusFeePerSemester().toFixed(2)}
                      </div>
                    </div>
                  )}
                  
                  <div className={`${styles.feeRow} ${styles.totalRow}`}>
                    <div className={styles.feeItem}>Total Fee (for Semester {selectedSemester})</div>
                    <div className={styles.feeAmount}>
                      ₹{calculateTotalPerSemester().toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className={styles.paymentSummary}>
                <h3>Payment Summary</h3>
                <div className={styles.summaryGrid}>
                  <div className={styles.summaryRow}>
                    <div className={styles.summaryLabel}>Total Semesters:</div>
                    <div className={styles.summaryValue}>{paymentInfo.total_semesters}</div>
                  </div>
                  <div className={styles.summaryRow}>
                    <div className={styles.summaryLabel}>Semesters Paid:</div>
                    <div className={styles.summaryValue}>
                      {
                        [...Array(paymentInfo.total_semesters)].filter((_, index) => 
                          paymentInfo[`semester${index + 1}_paid`]
                        ).length
                      }
                    </div>
                  </div>
                  <div className={styles.summaryRow}>
                    <div className={styles.summaryLabel}>Semesters Pending:</div>
                    <div className={styles.summaryValue}>
                      {
                        [...Array(paymentInfo.total_semesters)].filter((_, index) => 
                          !paymentInfo[`semester${index + 1}_paid`]
                        ).length
                      }
                    </div>
                  </div>
                  <div className={`${styles.summaryRow} ${styles.outstandingDues}`}>
                    <div className={styles.summaryLabel}>Total Outstanding Dues:</div>
                    <div className={styles.summaryValue}>₹{calculateTotalDues().toFixed(2)}</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className={styles.receiptFooter}>
              <div className={styles.collegeInfo}>
                <p className={styles.collegeName}>College of Engineering</p>
                <p className={styles.collegeAddress}>123 Education Street, Academic City</p>
              </div>
              <p className={styles.disclaimer}>This is a computer-generated receipt and does not require a signature.</p>
              <p className={styles.receiptDate}>Date: {new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 