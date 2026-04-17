import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'foodstocks-supplier-dashboard-secret-key-2026'
)

const PUBLIC_PATHS = ['/login', '/api/auth/login']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow public paths
  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next()
  }

  // Allow static files and Next.js internals
  if (pathname.startsWith('/_next') || pathname.startsWith('/favicon')) {
    return NextResponse.next()
  }

  const token = request.cookies.get('fs_token')?.value

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  try {
    const { payload } = await jwtVerify(token, SECRET)
    const role = payload.role as string

    // Admin routes — only admins
    if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
      if (role !== 'admin') {
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
    }

    // Supplier routes — only suppliers
    if (pathname.startsWith('/dashboard') || pathname.startsWith('/api/supplier')) {
      if (role !== 'supplier') {
        return NextResponse.redirect(new URL('/admin', request.url))
      }
    }

    // Root redirect
    if (pathname === '/') {
      return NextResponse.redirect(new URL(role === 'admin' ? '/admin' : '/dashboard', request.url))
    }

    return NextResponse.next()
  } catch {
    // Invalid token
    const response = NextResponse.redirect(new URL('/login', request.url))
    response.cookies.delete('fs_token')
    return response
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|brands/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
