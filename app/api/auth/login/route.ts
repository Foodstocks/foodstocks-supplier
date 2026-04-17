import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { signToken, setAuthCookie } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email dan password wajib diisi' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where:   { email: email.toLowerCase().trim() },
      include: { supplier: { select: { id: true } } },
    })

    if (!user || !user.isActive) {
      return NextResponse.json({ error: 'Email atau password salah' }, { status: 401 })
    }

    const passwordMatch = await bcrypt.compare(password, user.password)
    if (!passwordMatch) {
      return NextResponse.json({ error: 'Email atau password salah' }, { status: 401 })
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data:  { lastLogin: new Date() },
    })

    const role = user.role.toLowerCase() as 'supplier' | 'admin'

    const token = await signToken({
      userId:     user.id,
      email:      user.email,
      name:       user.name,
      role,
      supplierId: user.supplier?.id,
    })

    await setAuthCookie(token)

    return NextResponse.json({
      user: {
        id:         user.id,
        email:      user.email,
        name:       user.name,
        role,
        supplierId: user.supplier?.id,
      },
    })
  } catch (err) {
    console.error('[/api/auth/login]', err)
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 })
  }
}
