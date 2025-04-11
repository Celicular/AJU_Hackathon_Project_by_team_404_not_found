import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { query, getOne } from '../../lib/mysql';

export async function POST(request) {
  try {
    const { userId, currentPassword, newPassword } = await request.json();
    
    // Validate input
    if (!userId || !currentPassword || !newPassword) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      );
    }
    
    // Find user by userId (enrollment number)
    const user = await getOne('SELECT * FROM users WHERE enrollment = ?', [userId]);
    
    // If user not found
    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }
    
    // Check current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: 'Current password is incorrect' },
        { status: 401 }
      );
    }
    
    // Hash the new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    
    // Update the password in the database
    await query(
      'UPDATE users SET password = ? WHERE id = ?',
      [hashedNewPassword, user.id]
    );
    
    // Return success response
    return NextResponse.json({
      message: 'Password changed successfully'
    });
    
  } catch (error) {
    console.error('Change password error:', error);
    return NextResponse.json(
      { message: 'Server error, please try again later' },
      { status: 500 }
    );
  }
} 