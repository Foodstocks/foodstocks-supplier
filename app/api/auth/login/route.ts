import { NextRequest, NextResponse } from 'next/server'
import { signToken, setAuthCookie } from '@/lib/auth'
import { DEMO_USERS } from '@/lib/mock-data'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email dan password wajib diisi' }, { status: 400 })
    }

    const user = DEMO_USERS.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    )

    if (!user) {
      return NextResponse.json({ error: 'Email atau password salah' }, { status: 401 })
    }

    const token = await signToken({
      userId:     user.id,
      email:      user.email,
      name:       user.name,
      role:       user.role,
      supplierId: user.supplierId,
    })

    await setAuthCookie(token)

    return NextResponse.json({
      user: {
        id:         user.id,
        email:      user.email,
        name:       user.name,
        role:       user.role,
        supplierId: user.supplierId,
      },
    })
  } catch {
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 })
  }
}
