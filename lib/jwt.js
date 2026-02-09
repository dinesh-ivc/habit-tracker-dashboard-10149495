import { SignJWT, jwtVerify } from 'jose';

// Secret key for signing tokens
export const SECRET_KEY = process.env.JWT_SECRET || 'fallback_secret_for_development';

export async function createJWTToken(payload) {
  const secret = new TextEncoder().encode(SECRET_KEY);
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret);

  return token;
}

export async function verifyJWTToken(token) {
  try {
    const secret = new TextEncoder().encode(SECRET_KEY);
    const verified = await jwtVerify(token, secret);
    return verified.payload;
  } catch (error) {
    console.error('JWT verification error:', error);
    return null;
  }
}