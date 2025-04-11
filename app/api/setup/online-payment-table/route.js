import { query } from '../../../lib/mysql';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('Starting online payment setup...');
    
    // First check if student_info table exists
    try {
      const tableCheck = await query(`
        SELECT COUNT(*) as table_exists 
        FROM information_schema.tables 
        WHERE table_schema = DATABASE() 
        AND table_name = 'student_info'
      `);
      
      if (!tableCheck[0].table_exists) {
        console.error('student_info table does not exist');
        return NextResponse.json({
          message: 'student_info table does not exist. Please set up the student_info table first.',
          success: false
        }, { status: 400 });
      }
    } catch (tableCheckError) {
      console.error('Error checking for student_info table:', tableCheckError);
      return NextResponse.json({
        message: 'Error checking for student_info table: ' + tableCheckError.message,
        success: false
      }, { status: 500 });
    }
    
    // 1. Add required columns to student_info table if they don't exist
    try {
      // First, check if the columns already exist
      const checkColumnsQuery = `
        SELECT 
          SUM(COLUMN_NAME = 'bus_facility') as bus_facility_exists,
          SUM(COLUMN_NAME = 'csem') as csem_exists
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE 
          TABLE_NAME = 'student_info' 
          AND TABLE_SCHEMA = DATABASE()
      `;
      
      const columnsExist = await query(checkColumnsQuery);
      
      if (columnsExist[0].bus_facility_exists < 1) {
        console.log('Adding bus_facility column to student_info');
        await query(`
          ALTER TABLE student_info 
          ADD COLUMN bus_facility BOOLEAN DEFAULT false
        `);
      }
      
      if (columnsExist[0].csem_exists < 1) {
        console.log('Adding csem column to student_info');
        await query(`
          ALTER TABLE student_info 
          ADD COLUMN csem INT DEFAULT 1
        `);
      }
    } catch (alterTableError) {
      console.error('Error adding columns to student_info table:', alterTableError);
      return NextResponse.json({
        message: 'Error adding columns to student_info table: ' + alterTableError.message,
        success: false
      }, { status: 500 });
    }
    
    // 2. Create online_payment table if it doesn't exist
    try {
      await query(`
        CREATE TABLE IF NOT EXISTS online_payment (
          payment_id INT AUTO_INCREMENT PRIMARY KEY,
          enrollment_no VARCHAR(30) NOT NULL,
          course VARCHAR(50) NULL,
          total_fees DECIMAL(10,2) DEFAULT 30000.00,
          bus_fee DECIMAL(10,2) DEFAULT 10000.00,
          has_bus_facility TINYINT(1) DEFAULT 0,
          total_semesters INT NOT NULL DEFAULT 8,
          semester1_paid TINYINT(1) DEFAULT 0,
          semester2_paid TINYINT(1) DEFAULT 0,
          semester3_paid TINYINT(1) DEFAULT 0,
          semester4_paid TINYINT(1) DEFAULT 0,
          semester5_paid TINYINT(1) DEFAULT 0,
          semester6_paid TINYINT(1) DEFAULT 0,
          semester7_paid TINYINT(1) DEFAULT 0,
          semester8_paid TINYINT(1) DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          gnd_total DECIMAL(10,2) AS (total_fees + bus_fee),
          FOREIGN KEY (enrollment_no) REFERENCES student_info(enrollment_no)
        )
      `);
      
      console.log('Online_payment table created successfully');
    } catch (createTableError) {
      console.error('Error creating online_payment table:', createTableError);
      return NextResponse.json({
        message: 'Error creating online_payment table: ' + createTableError.message,
        success: false
      }, { status: 500 });
    }
    
    // 3. Check for existing student_info records and create corresponding payment records
    try {
      const studentRecords = await query(`
        SELECT enrollment_no, course, 
               IFNULL(bus_facility, false) as bus_facility, 
               IFNULL(csem, 1) as csem 
        FROM student_info
      `);
      
      console.log(`Found ${studentRecords.length} student records to process`);
      
      // 4. Add payment records for each student if they don't exist
      for (const student of studentRecords) {
        const existingPayment = await query(
          'SELECT COUNT(*) as count FROM online_payment WHERE enrollment_no = ?',
          [student.enrollment_no]
        );
        
        if (existingPayment[0].count === 0) {
          // Create random payment history - some semesters paid, some not
          // For a real system, these would all start as false or be imported from existing records
          const currentSem = student.csem || 1;
          
          // Create random payment statuses for demonstration
          // In a real system, you'd want actual payment data here
          await query(`
            INSERT INTO online_payment (
              enrollment_no, 
              course,
              total_fees,
              bus_fee,
              has_bus_facility,
              total_semesters,
              semester1_paid,
              semester2_paid,
              semester3_paid,
              semester4_paid,
              semester5_paid,
              semester6_paid,
              semester7_paid,
              semester8_paid
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `, [
            student.enrollment_no,
            student.course,
            30000.00, // Default course fee
            10000.00, // Default bus fee
            student.bus_facility ? 1 : 0,
            8, // Default total semesters
            currentSem > 1 ? 1 : 0, // sem1 is paid if student is beyond semester 1
            currentSem > 2 ? 1 : 0, // sem2 is paid if student is beyond semester 2
            currentSem > 3 && Math.random() > 0.3 ? 1 : 0, // 70% chance of being paid if beyond sem3
            0, // sem4 is not paid (for demo purposes)
            0, // sem5 is not paid
            0, // sem6 is not paid
            0, // sem7 is not paid
            0  // sem8 is not paid
          ]);
          
          console.log(`Added payment record for ${student.enrollment_no}`);
        }
      }
    } catch (studentRecordsError) {
      console.error('Error processing student records:', studentRecordsError);
      return NextResponse.json({
        message: 'Error processing student records: ' + studentRecordsError.message,
        success: false
      }, { status: 500 });
    }
    
    // 5. Update student_info with random bus_facility and csem values for demo purposes
    try {
      // In a real system, these would be accurate values
      const studentsWithoutData = await query(`
        SELECT id FROM student_info WHERE csem IS NULL OR csem = 0
      `);
      
      for (const student of studentsWithoutData) {
        await query(`
          UPDATE student_info 
          SET 
            bus_facility = ?,
            csem = ? 
          WHERE id = ?
        `, [
          Math.random() > 0.5, // 50% chance of having bus facility
          Math.floor(Math.random() * 4) + 1, // Random semester between 1-4
          student.id
        ]);
      }
    } catch (updateError) {
      console.error('Error updating student data:', updateError);
      // We don't want to fail the entire operation if this part fails
    }
    
    return NextResponse.json({ 
      message: 'Online payment system initialized successfully',
      success: true 
    });
    
  } catch (error) {
    console.error('Error setting up online payment system:', error);
    return NextResponse.json({ 
      message: 'Failed to set up online payment system: ' + error.message,
      error: error.toString(),
      success: false 
    }, { status: 500 });
  }
} 