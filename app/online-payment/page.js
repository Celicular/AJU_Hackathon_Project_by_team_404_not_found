'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.css';
import NavBar from '../components/NavBar/NavBar';
import { Progress } from '../components/ui/progress';


export default function OnlinePaymentPage() {
  const [paymentData, setPaymentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSemester, setSelectedSemester] = useState(1);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const [studentEnrollment, setStudentEnrollment] = useState('');
  const [showPaymentWindow, setShowPaymentWindow] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState(null);

  useEffect(() => {
    // Get enrollment number from session storage on component mount
    try {
      const userDataString = sessionStorage.getItem('userData');
      if (userDataString) {
        const userData = JSON.parse(userDataString);
        if (userData.enrollment) {
          setStudentEnrollment(userData.enrollment);
          console.log("Found enrollment number in session:", userData.enrollment);
        }
      }
    } catch (e) {
      console.error("Error getting enrollment from session:", e);
    }
  }, []);

  useEffect(() => {
    async function fetchPaymentData() {
      try {
        setLoading(true);
        
        // Get user data from session storage
        const userDataString = sessionStorage.getItem('userData');
        let enrollment_no = '';
        
        if (userDataString) {
          try {
            const userData = JSON.parse(userDataString);
            enrollment_no = userData.enrollment;
            // Set the enrollment number in component state for displaying test URLs
            setStudentEnrollment(enrollment_no);
          } catch (e) {
            console.error('Error parsing user data from session:', e);
          }
        }
        
        // Build URL with query parameter if enrollment_no exists
        const apiUrl = enrollment_no 
          ? `/api/online-payment?enrollment_no=${encodeURIComponent(enrollment_no)}` 
          : '/api/online-payment';
        
        console.log("Fetching payment data from:", apiUrl);
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch payment data: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (!data.success) {
          throw new Error(data.message || 'Failed to fetch payment data');
        }
        
        // Log the exact data received from the server for debugging
        console.log('Raw payment data from server:', data);
        console.log('Total fees from server:', data.data.total_fees);
        console.log('Bus fee from server:', data.data.bus_fee);
        console.log('Has bus facility:', data.data.has_bus_facility);
        
        setPaymentData(data.data);
        console.log('Payment data after state update:', data.data);
      } catch (err) {
        console.error('Error fetching payment data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    
    fetchPaymentData();
  }, []);

  // Function to open payment window
  const openPaymentWindow = (semester) => {
    setSelectedSemester(semester);
    
    // Get enrollment_no from paymentData or session storage
    const enrollment_no = paymentData?.enrollment_no || studentEnrollment;
    
    if (!enrollment_no) {
      setPaymentError('Enrollment number not available. Please log in again.');
      return;
    }
    
    // Log the values for debugging
    console.log("Payment data for window:", {
      total_fees: paymentData.total_fees,
      bus_fee: paymentData.bus_fee,
      total_semesters: paymentData.total_semesters,
      has_bus_facility: paymentData.has_bus_facility
    });
    
    // Parse values as numbers explicitly to avoid NaN
    const total_fees = parseFloat(paymentData.total_fees) || 0;
    const bus_fee = parseFloat(paymentData.bus_fee) || 0;
    
    // Use the actual values from the database without dividing (fees are already per semester)
    const semesterFee = total_fees;
    const busFee = paymentData.has_bus_facility ? bus_fee : 0;
    const totalAmount = semesterFee + busFee;
    
    console.log("Calculated fees:", {
      semesterFee,
      busFee,
      totalAmount
    });
    
    setPaymentInfo({
      enrollment_no: enrollment_no,
      semester: semester,
      amount: totalAmount,
      formattedAmount: formatCurrency(totalAmount),
      semesterFee: formatCurrency(semesterFee),
      busFee: busFee > 0 ? formatCurrency(busFee) : null
    });
    
    setShowPaymentWindow(true);
  };
  
  // Function to close payment window
  const closePaymentWindow = () => {
    setShowPaymentWindow(false);
    setPaymentInfo(null);
  };

  // Function to handle payment
  const handlePayment = async () => {
    try {
      setProcessingPayment(true);
      setPaymentSuccess(false);
      setPaymentError(null);
      
      // Simulate a delay to show the loading state
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const response = await fetch('/api/online-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          enrollment_no: paymentInfo.enrollment_no,
          semester: paymentInfo.semester,
        }),
      });
      
      const result = await response.json();
      
      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Payment processing failed');
      }
      
      // Update the local payment data with the new payment status
      setPaymentData(result.data);
      setPaymentSuccess(true);
      
      // Close the payment window after successful payment
      setTimeout(() => {
        closePaymentWindow();
      }, 2000);
      
    } catch (err) {
      console.error('Payment error:', err);
      setPaymentError(err.message);
    } finally {
      setProcessingPayment(false);
    }
  };

  // Format currency for display
  const formatCurrency = (amount) => {
    // Ensure amount is a valid number
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount)) {
      console.error("Invalid amount for currency formatting:", amount);
      return "₹0";
    }
    
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(numAmount);
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <NavBar />
        <div className="container mx-auto my-8 p-6 flex flex-col items-center justify-center flex-1">
          <div className="w-full max-w-3xl flex flex-col items-center justify-center">
            <h1 className="text-2xl font-bold mb-8">Loading Payment Information...</h1>
            <Progress value={45} className="w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen">
        <NavBar />
        <div className="container mx-auto my-8 p-6">
          <div className="bg-red-50 border border-red-300 p-4 rounded-md">
            <h1 className="text-2xl font-bold text-red-800 mb-4">Error Loading Payment Information</h1>
            <p className="text-red-700">{error}</p>
            <p className="mt-4 text-gray-700">
              Please try refreshing the page or contact the system administrator if the problem persists.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!paymentData) {
    return (
      <div className="flex flex-col min-h-screen">
        <NavBar />
        <div className="container mx-auto my-8 p-6">
          <div className="bg-yellow-50 border border-yellow-300 p-4 rounded-md">
            <h1 className="text-2xl font-bold text-yellow-800 mb-4">No Payment Information Available</h1>
            <p className="text-yellow-700">
              Payment information could not be found for your account. Please contact the finance department.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Calculate payment summary
  const totalSemesters = paymentData.total_semesters || 8;
  const currentSemester = paymentData.current_semester || 1;
  
  // Debug log to check actual values from API
  console.log("RENDER - Raw payment data:", {
    total_fees: paymentData.total_fees,
    bus_fee: paymentData.bus_fee,
    has_bus_facility: paymentData.has_bus_facility,
    total_semesters: totalSemesters,
    current_semester: currentSemester
  });
  
  // Parse values as numbers explicitly to avoid NaN
  const total_fees = parseFloat(paymentData.total_fees) || 0;
  const bus_fee = parseFloat(paymentData.bus_fee) || 0;
  
  const paidSemesters = Array.from({ length: totalSemesters }, (_, i) => 
    paymentData[`semester${i+1}_paid`]
  ).filter(Boolean).length;
  
  const semesterList = Array.from({ length: totalSemesters }, (_, i) => i + 1);
  
  // Find the lowest unpaid semester
  const lowestUnpaidSemester = semesterList.find(semester => !paymentData[`semester${semester}_paid`]) || (paidSemesters + 1);
  
  // Don't divide by total_semesters - the total_fees is already per semester
  const currentSemesterFee = total_fees;
  const busFeePerSemester = paymentData.has_bus_facility ? bus_fee : 0;
  
  // Debug log to check calculated per-semester fees
  console.log("RENDER - Calculated per semester:", {
    totalSemesters,
    currentSemesterFee,
    busFeePerSemester
  });
  
  // Calculate total paid using real fees
  const totalPaid = paidSemesters * currentSemesterFee;
  const totalPaidBusFee = paymentData.has_bus_facility ? (paidSemesters * busFeePerSemester) : 0;
  
  // Calculate remaining balance only for the lowest unpaid semester
  const remainingBalance = currentSemesterFee + (paymentData.has_bus_facility ? busFeePerSemester : 0);
  
  const semesterTotalFee = currentSemesterFee + busFeePerSemester;

  return (
    <div className={styles.container}>
      <NavBar />
      <div className={styles.paymentContainer}>
        <div className={styles.titleWrapper}>
          <h1 className={styles.pageTitle}>Online Fee Payment</h1>
        </div>

        {/* Student Card */}
        <div className={styles.studentCard}>
          <div className={styles.studentDetails}>
            <div className={styles.studentName}>
              <h2>{paymentData.name || 'Student Name'}</h2>
              <p className={styles.courseInfo}>{paymentData.course || 'Course N/A'}</p>
            </div>
            <div className={styles.studentId}>
              <p>Enrollment: <span>{paymentData.enrollment_no}</span></p>
              <p>Current Semester: <span>Semester {paymentData.current_semester}</span></p>
              <p>Bus Facility: <span>{paymentData.has_bus_facility ? 'Enabled' : 'Not Enabled'}</span></p>
            </div>
          </div>
        </div>

        {/* Summary Card */}
        <div className={styles.summaryCard}>
          <h3 className={styles.summaryTitle}>Payment Summary</h3>
          <div className={styles.summaryGrid}>
            <div className={styles.summaryItem}>
              <div className={styles.summaryIcon}>₹</div>
              <div className={styles.summaryLabel}>Course Fees</div>
              <div className={styles.summaryValue}>{formatCurrency(total_fees)}</div>
            </div>
            
            {paymentData.has_bus_facility && (
              <div className={styles.summaryItem}>
                <div className={styles.summaryIcon}>🚌</div>
                <div className={styles.summaryLabel}>Bus Fees</div>
                <div className={styles.summaryValue}>{formatCurrency(bus_fee)}</div>
              </div>
            )}
            
            <div className={styles.summaryItem}>
              <div className={styles.summaryIcon}>✓</div>
              <div className={styles.summaryLabel}>Total Paid</div>
              <div className={styles.summaryValue}>{formatCurrency(totalPaid + totalPaidBusFee)}</div>
            </div>
            
            {lowestUnpaidSemester <= totalSemesters && (
              <div className={styles.summaryItem}>
                <div className={styles.summaryIcon}>!</div>
                <div className={styles.summaryLabel}>Current Due (Semester {lowestUnpaidSemester})</div>
                <div className={`${styles.summaryValue} ${styles.dueAmount}`}>
                  {formatCurrency(remainingBalance)}
                </div>
              </div>
            )}
          </div>
          
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Payment Progress</span>
              <span className="text-sm font-medium">{Math.round((paidSemesters / totalSemesters) * 100)}%</span>
            </div>
            <Progress value={(paidSemesters / totalSemesters) * 100} className="h-2" />
          </div>
            
          {/* Fees structure */}
          <h3 className={styles.feesTitle}>Fees Structure</h3>
          <div className={styles.feesCard}>
            <div className="overflow-x-auto">
              <table className={styles.feesTable}>
                <thead className={styles.feesHeader}>
                  <tr className={styles.feesRow}>
                    <th className={styles.feesCell}>Semester</th>
                    <th className={styles.feesCell}>Course Fee</th>
                    {paymentData.has_bus_facility && (
                      <th className={styles.feesCell}>Bus Fee</th>
                    )}
                    <th className={styles.feesCell}>Total</th>
                    <th className={styles.feesCell}>Status</th>
                    <th className={styles.feesCell}>Action</th>
                  </tr>
                </thead>
                <tbody className={styles.feesBody}>
                  {semesterList.map((semester) => {
                    const isPaid = paymentData[`semester${semester}_paid`];
                    
                    return (
                      <tr key={`sem-${semester}`} className={styles.feesRow}>
                        <td className={styles.feesCell}>Semester {semester}</td>
                        <td className={styles.feesCell}>{formatCurrency(currentSemesterFee)}</td>
                        {paymentData.has_bus_facility && (
                          <td className={styles.feesCell}>{formatCurrency(busFeePerSemester)}</td>
                        )}
                        <td className={styles.feesCell}>
                          {formatCurrency(semesterTotalFee)}
                        </td>
                        <td className={styles.feesCell}>
                          {isPaid ? (
                            <span className={styles.statusBadge + ' ' + styles.paid}>Paid</span>
                          ) : (
                            <span className={styles.statusBadge + ' ' + styles.due}>Unpaid</span>
                          )}
                        </td>
                        <td className={styles.feesCell}>
                          {!isPaid && (
                            <button
                              onClick={() => openPaymentWindow(semester)}
                              disabled={processingPayment}
                              className={styles.payButton}
                            >
                              Pay Now
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
            
          {/* Payment Result Messages */}
          {paymentSuccess && (
            <div className={styles.paymentSuccess}>
              <h3 className="text-lg font-semibold text-green-800 mb-2">Payment Successful!</h3>
              <p>Your payment has been processed successfully. Thank you for your payment.</p>
            </div>
          )}
          
          {paymentError && (
            <div className={styles.paymentError}>
              <h3 className="text-lg font-semibold text-red-800 mb-2">Payment Failed</h3>
              <p>{paymentError}</p>
              <p className="mt-2 text-gray-700">
                Please try again or contact the finance department if the problem persists.
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* Dummy Payment Window - Modal */}
      {showPaymentWindow && paymentInfo && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>Complete Your Payment</h3>
              <button onClick={closePaymentWindow} className={styles.closeButton}>×</button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.paymentDetails}>
                <div className={styles.paymentRow}>
                  <span>Enrollment Number:</span>
                  <span>{paymentInfo.enrollment_no}</span>
                </div>
                <div className={styles.paymentRow}>
                  <span>Semester:</span>
                  <span>Semester {paymentInfo.semester}</span>
                </div>
                <div className={styles.paymentRow}>
                  <span>Course Fee:</span>
                  <span>{paymentInfo.semesterFee}</span>
                </div>
                {paymentInfo.busFee && (
                  <div className={styles.paymentRow}>
                    <span>Bus Fee:</span>
                    <span>{paymentInfo.busFee}</span>
                  </div>
                )}
                <div className={styles.paymentRowTotal}>
                  <span>Total Amount:</span>
                  <span>{paymentInfo.formattedAmount}</span>
                </div>
              </div>
              
              <div className={styles.paymentNote}>
                <p>This is a dummy payment window for demonstration purposes.</p>
                <p>In a real application, this would connect to a payment gateway.</p>
              </div>
              
              <button 
                onClick={handlePayment} 
                disabled={processingPayment} 
                className={styles.paymentButton}
              >
                {processingPayment ? (
                  <span className={styles.buttonLoader}></span>
                ) : (
                  'Dummy Payment - Pay Now'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 