import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { supabase } from '@/lib/db';
import { validateRegister } from '@/lib/validation';

export async function POST(request) {
  try {
    const data = await request.json();
    const validation = validateRegister(data);

    if (!validation.isValid) {
      return NextResponse.json(
        { message: 'Validation failed', errors: validation.errors },
        { status: 400 }
      );
    }

    const { firstName, lastName, email, password, role } = data;

    // Check if user already exists
    const { data: existingUser, error: userCheckError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      return NextResponse.json(
        { message: 'User already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await hash(password, 12);

    // Create user
    const { data: newUser, error: createUserError } = await supabase
      .from('users')
      .insert([
        {
          email,
          password: hashedPassword,
          first_name: firstName,
          last_name: lastName,
          role: role.toLowerCase(),
        }
      ])
      .select()
      .single();

    if (createUserError) {
      throw new Error(createUserError.message);
    }

    const token = await createJWTToken(newUser);

    // Store only necessary user info in localStorage via response (this won't happen though, see notes below)
    // We're just returning to let frontend take action
    return NextResponse.json(
      {
        user: {
          id: newUser.id,
          email: newUser.email,
          firstName: newUser.first_name,
          lastName: newUser.last_name,
          role: newUser.role,
        },
        token
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: 'Registration failed' },
      { status: 500 }
    );
  }
}

// We'll implement the JWT creation function here
import { SignJWT } from 'jose';
import { SECRET_KEY } from '@/lib/jwt';

async function createJWTToken(user) {
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

  return token;
}