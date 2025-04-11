import { query } from '../../../lib/mysql';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('Starting student_info table setup...');
    
    // Create student_info table if it doesn't exist
    await query(`
      CREATE TABLE IF NOT EXISTS student_info (
        id INT AUTO_INCREMENT PRIMARY KEY,
        student_id INT NOT NULL,
        enrollment_no VARCHAR(20) NOT NULL,
        course VARCHAR(100) NOT NULL,
        roll_no VARCHAR(20) NOT NULL,
        first_name VARCHAR(50) NOT NULL,
        full_name VARCHAR(100) NOT NULL,
        guardian_name VARCHAR(100) NOT NULL,
        dob DATE NOT NULL,
        gender ENUM('Male', 'Female', 'Other') NOT NULL,
        religion VARCHAR(50),
        blood_group VARCHAR(10),
        adhaar_no VARCHAR(20),
        mobile_no VARCHAR(15) NOT NULL,
        whatsapp_no VARCHAR(15),
        email VARCHAR(100) NOT NULL,
        guardian_email VARCHAR(100),
        guardian_no VARCHAR(15),
        perm_address TEXT NOT NULL,
        perm_city VARCHAR(50) NOT NULL,
        perm_state VARCHAR(50) NOT NULL,
        perm_district VARCHAR(50) NOT NULL,
        perm_pin VARCHAR(10) NOT NULL,
        local_address TEXT,
        local_city VARCHAR(50),
        local_state VARCHAR(50),
        local_district VARCHAR(50),
        local_pin VARCHAR(10),
        language1 VARCHAR(50),
        language2 VARCHAR(50),
        height_cm DECIMAL(5,2),
        weight_kg DECIMAL(5,2),
        identification_mark TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (student_id) REFERENCES users(id)
      )
    `);
    
    console.log('Student_info table created successfully');
    
    // Check for existing users
    const users = await query('SELECT * FROM users');
    console.log(`Found ${users.length} users in the database`);
    
    // Example dummy data (optional)
    const hasData = await query('SELECT COUNT(*) as count FROM student_info');
    console.log(`Current student_info records: ${hasData[0].count}`);
    
    if (hasData[0].count === 0 && users.length > 0) {
      console.log('Adding sample data for users...');
      
      // Add data for each user instead of just one
      for (const user of users) {
        await query(`
          INSERT INTO student_info (
            student_id, enrollment_no, course, roll_no, first_name, full_name, 
            guardian_name, dob, gender, religion, blood_group, adhaar_no, 
            mobile_no, whatsapp_no, email, guardian_email, guardian_no, 
            perm_address, perm_city, perm_state, perm_district, perm_pin, 
            local_address, local_city, local_state, local_district, local_pin, 
            language1, language2, height_cm, weight_kg, identification_mark
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          user.id,
          user.enrollment,
          user.course,
          user.rollNo,
          user.name.split(' ')[0],
          user.name,
          `Mr. ${user.name.split(' ')[1] || 'Parent'} (Father)`,
          new Date(Date.now() - 20 * 365 * 24 * 60 * 60 * 1000), // ~20 years ago
          'Male',
          'Hindu',
          'B+',
          `XXXX XXXX ${Math.floor(1000 + Math.random() * 9000)}`,
          `+91 ${Math.floor(6000000000 + Math.random() * 3999999999)}`,
          `+91 ${Math.floor(6000000000 + Math.random() * 3999999999)}`,
          user.email,
          `parent_${user.email}`,
          `+91 ${Math.floor(6000000000 + Math.random() * 3999999999)}`,
          'Plot No. 123, ABC Colony',
          'New Delhi',
          'Delhi',
          'New Delhi',
          '110001',
          'Hostel Block A, Room 101, University Campus',
          'New Delhi',
          'Delhi',
          'New Delhi',
          '110001',
          'English',
          'Hindi',
          170.5,
          65.0,
          'Mole on right cheek'
        ]);
        console.log(`Added student info for user ID: ${user.id}`);
      }
    }
    
    // Verify data was added
    const finalCount = await query('SELECT COUNT(*) as count FROM student_info');
    console.log(`Final student_info record count: ${finalCount[0].count}`);
    
    return NextResponse.json({ 
      message: 'Student info table initialized successfully',
      recordCount: finalCount[0].count,
      success: true 
    });
    
  } catch (error) {
    console.error('Error setting up student_info table:', error);
    return NextResponse.json({ 
      message: 'Failed to set up student_info table: ' + error.message,
      error: error.stack,
      success: false 
    }, { status: 500 });
  }
} 