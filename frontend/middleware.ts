// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const publicRoutes = [
  '/',            // Root home page
  '',             // Empty path fallback
  '/login',       // Login page
  '/join',        // Register/Join page
  '/logout',      // Logout page
]

export function middleware(request: NextRequest) {
  // 1. Try to read your authentication or session cookie
  const { pathname } = request.nextUrl
  const token = request.cookies.get('access_token')?.value
  const isPublicRoute = publicRoutes.includes(pathname.trim())

  console.log('pathname', pathname);
  console.log('isPublicRoute', isPublicRoute);
  console.log('token', token);


  if (isPublicRoute) {
    return NextResponse.next()
  }

  // 2. If the cookie does not exist, redirect to the login page
  if (!token) {
    // Construct an absolute URL for redirection
    const loginUrl = new URL('/login', request.url)

    // Optional: Pass the original target URL to redirect back after login
    loginUrl.searchParams.set('from', request.nextUrl.pathname)

    return NextResponse.redirect(loginUrl)
  }

  // 3. If the cookie exists, allow the request to proceed normally
  return NextResponse.next()
}

// 4. Configure which routes this middleware should protect
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with or ending with:
     * - api, _next/static, _next/image
     * - Common static file extensions (svg, png, jpg, jpeg, gif, ico, webp)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|site.webmanifest|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
