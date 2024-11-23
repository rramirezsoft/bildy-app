import { NextResponse } from 'next/server';

export function middleware(request) {
 
  const token = request.cookies.get('bytoken')?.value;
  const { pathname } = request.nextUrl;

  // Redirigimos al login si no hay token y el usuario intenta acceder a una página protegida
  if (!token && pathname !== '/login' && pathname !== '/register') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Redirigimos al dashboard si hay token y el usuario intenta acceder a paginas de acceso
  if (token && (pathname === '/login' || pathname === '/register')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}
  
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"], 
};