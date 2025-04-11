import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getOne } from '../../lib/mysql';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-for-development-only';

export async function POST(request) {
  try {
    const { userId, password } = await request.json();
    
    // Validate input
    if (!userId || !password) {
      return NextResponse.json(
        { message: 'User ID and password are required' },
        { status: 400 }
      );
    }
    
    // Find user by userId (enrollment number)
    const user = await getOne('SELECT * FROM users WHERE enrollment = ?', [userId]);
    
    // If user not found
    if (!user) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }
    
    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id,
        enrollment: user.enrollment,
        name: user.name,
        email: user.email
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    // Prepare user data (excluding sensitive information)
    const userData = {
      name: user.name,
      enrollment: user.enrollment,
      email: user.email,
      course: user.course,
      rollNo: user.rollNo,
      batch: user.batch || `${user.startYear}-${user.endYear}`
    };
    
    // Return success response with token and user data
    return NextResponse.json({
      message: 'Login successful',
      token,
      user: userData
    });
    
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Server error, please try again later' },
      { status: 500 }
    );
  }
} 