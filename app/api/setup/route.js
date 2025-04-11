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