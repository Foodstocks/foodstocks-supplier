import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import type { JWTPayload, AuthUser } from './types'

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'foodstocks-supplier-dashboard-secret-key-2026'
)
const COOKIE_NAME = 'fs_token'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7 // 7 days

// ─── Sign & Verify ─────────────────────────────────────────────────────────

export async function signToken(payload: JWTPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(SECRET)
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET)
    return payload as unknown as JWTPayload
  } catch {
    return null
  }
}

// ─── Cookie helpers ────────────────────────────────────────────────────────

export async function setAuthCookie(token: string) {
  const cookieStore = cookies()
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: COOKIE_MAX_AGE,
    path: '/',
  })
}

export async function clearAuthCookie() {
  const cookieStore = cookies()
  cookieStore.delete(COOKIE_NAME)
}

export async function getAuthUser(): Promise<AuthUser | null> {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get(COOKIE_NAME)?.value
    if (!token) return null
    const payload = await verifyToken(token)
    if (!payload) return null
    return {
      id:         payload.userId,
      email:      payload.email,
      name:       payload.name,
      role:       payload.role,
      supplierId: payload.supplierId,
    }
  } catch {
    return null
  }
}

export async function getTokenFromCookie(): Promise<string | null> {
  const cookieStore = cookies()
  return cookieStore.get(COOKIE_NAME)?.value || null
}
