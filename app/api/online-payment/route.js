import { NextResponse } from 'next/server';
import { query } from '../../lib/mysql';

// GET handler to fetch payment data for a user
export async function GET(request) {
  try {
    // Get enrollment number from query params only - session storage can't be accessed server-side
    const { searchParams } = new URL(request.url);
    const enrollment_no = searchParams.get('enrollment_no');
    
    // If no enrollment_no provided, return an error
    if (!enrollment_no) {
      return NextResponse.json(
        { success: false, message: 'No enrollment number provided in the request' },
        { status: 400 }
      );
    }
    
    console.log(`Processing payment data request for enrollment: ${enrollment_no}`);
    
    // First, check if the tables exist
    const tablesExist = await checkTables();
    if (!tablesExist.success) {
      return NextResponse.json(
        { success: false, message: tablesExist.message },
        { status: 500 }
      );
    }
    
    // Get payment data from the database
    const paymentData = await getPaymentData(enrollment_no);
    
    if (!paymentData) {
      return NextResponse.json(
        { success: false, message: 'Payment data not found for this student' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: paymentData });
    
  } catch (error) {
    console.error('Error in online payment GET handler:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch payment data: ' + error.message },
      { status: 500 }
    );
  }
}

// POST handler to process a payment
export async function POST(request) {
  try {
    const data = await request.json();
    const { enrollment_no, semester } = data;
    
    if (!enrollment_no || !semester) {
      return NextResponse.json(
        { success: false, message: 'Enrollment number and semester are required' },
        { status: 400 }
      );
    }
    
    // Update the payment status
    await updatePaymentStatus(enrollment_no, semester);
    
    // Get updated payment data
    const updatedPaymentData = await getPaymentData(enrollment_no);
    
    return NextResponse.json({
      success: true,
      message: `Payment for semester ${semester} processed successfully`,
      data: updatedPaymentData
    });
    
  } catch (error) {
    console.error('Error in online payment POST handler:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to process payment: ' + error.message },
      { status: 500 }
    );
  }
}

// Helper function to check if required tables exist
async function checkTables() {
  try {
    // Check if the online_payment table exists
    const [onlinePaymentTable] = await query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = DATABASE() AND table_name = 'online_payment'
    `);
    
    if (!onlinePaymentTable) {
      return { success: false, message: 'Online payment system is not initialized. Please run the setup first.' };
    }
    
    // Check if the student_info table exists
    const [studentInfoTable] = await query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = DATABASE() AND table_name = 'student_info'
    `);
    
    if (!studentInfoTable) {
      return { success: false, message: 'Student information system is not initialized. Please run the setup first.' };
    }
    
    return { success: true };
    
  } catch (error) {
    console.error('Error checking tables:', error);
    return { success: false, message: 'Database error: ' + error.message };
  }
}

// Helper function to get payment data
async function getPaymentData(enrollment_no) {
  try {
    // First check if student exists
    const studentResult = await query(`
      SELECT * FROM student_info WHERE enrollment_no = ?
    `, [enrollment_no]);
    
    if (!studentResult || studentResult.length === 0) {
      console.error(`Student with enrollment_no ${enrollment_no} not found`);
      return null;
    }
    
    const studentInfo = studentResult[0];
    
    // Check if payment record exists, if not create a default one
    const paymentResult = await query(`
      SELECT * FROM online_payment WHERE enrollment_no = ?
    `, [enrollment_no]);
    
    let paymentInfo;
    
    if (!paymentResult || paymentResult.length === 0) {
      // Payment record doesn't exist, create a default one
      console.log(`Creating default payment record for ${enrollment_no}`);
      
      // Set default values based on student info
      const hasBusFacility = studentInfo.bus_facility ? 1 : 0;
      const busFee = hasBusFacility ? 10000.00 : 0.00; // Use actual bus fee amount
      const courseFee = 30000.00; // Use actual course fee amount
      
      // Insert a new payment record
      await query(`
        INSERT INTO online_payment (
          enrollment_no, course, total_fees, bus_fee, has_bus_facility,
          total_semesters, semester1_paid, semester2_paid, semester3_paid,
          semester4_paid, semester5_paid, semester6_paid, semester7_paid,
          semester8_paid
        ) VALUES (?, ?, ?, ?, ?, ?, 0, 0, 0, 0, 0, 0, 0, 0)
      `, [
        enrollment_no, 
        studentInfo.course, 
        courseFee, 
        busFee, 
        hasBusFacility,
        8 // Default total semesters
      ]);
      
      // Get the newly created payment record
      const newPaymentResult = await query(`
        SELECT * FROM online_payment WHERE enrollment_no = ?
      `, [enrollment_no]);
      
      if (!newPaymentResult || newPaymentResult.length === 0) {
        throw new Error('Failed to create payment record');
      }
      
      paymentInfo = newPaymentResult[0];
    } else {
      paymentInfo = paymentResult[0];
    }
    
    // Log the real values from database for debugging
    console.log("Database values:", {
      total_fees: paymentInfo.total_fees,
      bus_fee: paymentInfo.bus_fee,
      has_bus_facility: Boolean(studentInfo.bus_facility)
    });
    
    // Combine the data for the frontend WITHOUT any default values
    return {
      enrollment_no: studentInfo.enrollment_no,
      name: studentInfo.full_name,
      course: studentInfo.course || paymentInfo.course,
      total_fees: paymentInfo.total_fees,
      bus_fee: paymentInfo.bus_fee,
      has_bus_facility: Boolean(studentInfo.bus_facility),
      total_semesters: paymentInfo.total_semesters || 8,
      current_semester: studentInfo.csem || 1,
      gnd_total: paymentInfo.gnd_total || (paymentInfo.total_fees + (studentInfo.bus_facility ? paymentInfo.bus_fee : 0)),
      
      // Semester payment statuses
      semester1_paid: Boolean(paymentInfo.semester1_paid),
      semester2_paid: Boolean(paymentInfo.semester2_paid),
      semester3_paid: Boolean(paymentInfo.semester3_paid),
      semester4_paid: Boolean(paymentInfo.semester4_paid),
      semester5_paid: Boolean(paymentInfo.semester5_paid),
      semester6_paid: Boolean(paymentInfo.semester6_paid),
      semester7_paid: Boolean(paymentInfo.semester7_paid),
      semester8_paid: Boolean(paymentInfo.semester8_paid),
    };
    
  } catch (error) {
    console.error('Error getting payment data:', error);
    throw new Error('Database error: ' + error.message);
  }
}

// Helper function to update payment status
async function updatePaymentStatus(enrollment_no, semester) {
  try {
    // Update the payment status for the specific semester
    await query(`
      UPDATE online_payment 
      SET semester${semester}_paid = 1 
      WHERE enrollment_no = ?
    `, [enrollment_no]);
    
    return true;
  } catch (error) {
    console.error('Error updating payment status:', error);
    throw new Error('Failed to update payment status: ' + error.message);
  }
} 