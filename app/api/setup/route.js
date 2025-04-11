import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { query, initDatabase, hasUsers } from '../../lib/mysql';

export async function GET() {
  try {
    // Initialize database tables if they don't exist
    await initDatabase();
    
    // Check if users table already has data
    const usersExist = await hasUsers();
    
    if (usersExist) {
      return NextResponse.json({ 
        message: 'Database already contains users. Setup skipped.' 
      });
    }
    
    // Sample users data
    const sampleUsers = [
      {
        name: 'Himadri Shekhar',
        enrollment: 'AJU/231350',
        email: 'hsg090907.jsr@gmail.com',
        password: await bcrypt.hash('Himadri@123', 10),
        course: 'Polytechnic Computer Science',
        rollNo: 'DECS/082',
        startYear: 2023,
        endYear: 2026,
        batch: '2023-2026'
      },
      {
        name: 'Zaid Khan',
        enrollment: 'AJU/220269',
        email: 'zainabkhank595@gmail.com',
        password: await bcrypt.hash('Zaid@123', 10),
        course: 'Polytechnic Computer Science',
        rollNo: 'DECS/088',
        startYear: 2023,
        endYear: 2026,
        batch: '2023-2026'
      },
      {
        name: 'Sibtain Raza',
        enrollment: 'AJU/221722',
        email: 'khanbhai14063@gmail.com',
        password: await bcrypt.hash('Sibtain@123', 10),
        course: 'Polytechnic Computer Science',
        rollNo: 'DECS/082',
        startYear: 2022,
        endYear: 2025,
        batch: '2022-2025'
      }
    ];
    
    // Insert sample users
    for (const user of sampleUsers) {
      await query(
        `INSERT INTO users (name, enrollment, email, password, course, rollNo, startYear, endYear, batch) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          user.name,
          user.enrollment,
          user.email,
          user.password,
          user.course,
          user.rollNo,
          user.startYear,
          user.endYear,
          user.batch
        ]
      );
    }
    
    // Setup student_info table
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
    
    // Add sample student info data
    await query(`
      INSERT INTO student_info (
        student_id, enrollment_no, course, roll_no, first_name, full_name, 
        guardian_name, dob, gender, religion, blood_group, adhaar_no, 
        mobile_no, whatsapp_no, email, guardian_email, guardian_no, 
        perm_address, perm_city, perm_state, perm_district, perm_pin, 
        local_address, local_city, local_state, local_district, local_pin, 
        language1, language2, height_cm, weight_kg, identification_mark
      ) 
      SELECT 
        id, enrollment, course, rollNo, 
        SUBSTRING_INDEX(name, ' ', 1), name, 
        CONCAT('Mr. ', UPPER(SUBSTRING(SUBSTRING_INDEX(name, ' ', -1), 1, 1)), SUBSTRING(SUBSTRING_INDEX(name, ' ', -1), 2), ' (Father)'),
        DATE_SUB(CURDATE(), INTERVAL 20 YEAR), 'Male', 'Hindu', 'B+', 
        CONCAT('XXXX XXXX ', FLOOR(1000 + RAND() * 9000)),
        CONCAT('+91 ', FLOOR(6000000000 + RAND() * 3999999999)), 
        CONCAT('+91 ', FLOOR(6000000000 + RAND() * 3999999999)),
        email, CONCAT('parent_', email), CONCAT('+91 ', FLOOR(6000000000 + RAND() * 3999999999)),
        'Plot No. 123, ABC Colony', 'New Delhi', 'Delhi', 'New Delhi', '110001',
        'Hostel Block A, Room 101, University Campus', 'New Delhi', 'Delhi', 'New Delhi', '110001',
        'English', 'Hindi', 170.5, 65.0, 'Mole on right cheek'
      FROM users
    `);
    
    return NextResponse.json({ 
      message: 'Database setup completed successfully',
      usersCreated: sampleUsers.length
    });
    
  } catch (error) {
    console.error('Setup error:', error);
    return NextResponse.json(
      { message: 'Server error during setup', error: error.message },
      { status: 500 }
    );
  }
} 