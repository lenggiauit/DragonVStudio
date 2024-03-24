import { auth } from 'auth'

export const middleware = auth

export const config = {
  matcher: ['/admin', '/admin/:path*', '/user', '/user/:path*'],
}
