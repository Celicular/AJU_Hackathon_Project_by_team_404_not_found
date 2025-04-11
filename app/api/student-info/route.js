import { query } from '../../lib/mysql';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-for-development-only';

export async function GET(request) {
  try {
    // Try to get the authorization header
    const authHeader = request.headers.get('authorization');
    let userId = null;
    
    // If we have an auth header, try to use it to get a specific user
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET);
        userId = decoded.userId;
        console.log('Using authenticated user ID:', userId);
      } catch (tokenError) {
        console.log('Token verification failed, falling back to default behavior');
      }
    }
    
    // If we have a valid user ID, fetch that specific user's info
    let studentInfo;
    if (userId) {
      studentInfo = await query(
        'SELECT * FROM student_info WHERE student_id = ?',
        [userId]
      );
      
      if (studentInfo && studentInfo.length > 0) {
        console.log('Found student info for authenticated user');
        return NextResponse.json(studentInfo[0]);
      }
    }
    
    // If no auth or no specific user data found, fallback to first record
    console.log('Fetching first student record as fallback');
    studentInfo = await query('SELECT * FROM student_info LIMIT 1');
    
    if (!studentInfo || studentInfo.length === 0) {
      // If no student info exists at all
      console.log('No student information found in the database');
      
      // Get any user to create a placeholder
      const userData = await query('SELECT * FROM users LIMIT 1');
      
      if (userData && userData.length > 0) {
        const user = userData[0];
        console.log('Found user to create placeholder student info:', user.id);
        
        // Create a basic student info record
        try {
          await query(`
            INSERT INTO student_info (
              student_id, enrollment_no, course, roll_no, first_name, full_name, 
              gender, email, mobile_no, dob, perm_address, perm_city, perm_state, 
              perm_district, perm_pin, guardian_name
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `, [
            user.id,
            user.enrollment,
            user.course,
            user.rollNo,
            user.name.split(' ')[0],
            user.name,
            'Male',
            user.email,
            '9876543210',
            new Date(),
            'Default Address',
            'Default City',
            'Default State',
            'Default District',
            '123456',
            `Mr. ${user.name.split(' ')[1] || 'Parent'} (Father)`
          ]);
          
          console.log('Created new student info record for first user');
          
          // Fetch the newly created record
          const newStudentInfo = await query(
            'SELECT * FROM student_info LIMIT 1'
          );
          
          if (newStudentInfo && newStudentInfo.length > 0) {
            console.log('Returning newly created student info');
            return NextResponse.json(newStudentInfo[0]);
          }
        } catch (dbError) {
          console.error('Error creating student info record:', dbError);
        }
      }
      
      return NextResponse.json({ message: 'No student information available' }, { status: 404 });
    }
    
    console.log('Returning existing student info');
    return NextResponse.json(studentInfo[0]);
    
  } catch (error) {
    console.error('Error in student-info API:', error);
    return NextResponse.json(
      { message: 'Failed to fetch student information', error: error.message },
      { status: 500 }
    );
  }
} 