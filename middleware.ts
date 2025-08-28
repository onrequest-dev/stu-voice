import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'


export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const jwt = request.cookies.get('jwt')?.value
//   console.log(jwt)

  // السماح بالوصول للمسارات المفتوحة للجميع
  const openPaths = ['/', '/sign-up', '/log-in', '/privacy-and-terms']
  if (openPaths.includes(pathname)) {
    if (pathname === '/' && jwt) {
      return NextResponse.rewrite(new URL('/main', request.url))
    }
    return NextResponse.next()
  }

  // التحقق من المسارات الخاصة بالمسؤول
  if (!jwt) {
    return NextResponse.redirect(new URL('/sign-up', request.url))
  }

  if (pathname.startsWith('/stu-voice-private')) {
    if (!jwt) {
        return NextResponse.rewrite(new URL('/not-found', request.url))

    }

    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
