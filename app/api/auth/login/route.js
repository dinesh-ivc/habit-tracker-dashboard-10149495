import { NextResponse } from 'next/server';
import { compare } from 'bcryptjs';
import { supabase } from '@/lib/db';
import { SECRET_KEY } from '@/lib/jwt';
import { SignJWT } from 'jose';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await compare(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Create JWT token
    const secret = new TextEncoder().encode(SECRET_KEY);
    const token = await new SignJWT({
      sub: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      role: user.role
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(secret);

    localStorage.setItem('firstName', user.first_name);
    localStorage.setItem('lastName', user.last_name);
    localStorage.setItem('email', user.email);

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Login failed' },
      { status: 500 }
    );
  }
}