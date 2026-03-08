import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('auth-token')?.value;
    const pathname = request.nextUrl.pathname;

    const isAuthPage = pathname === '/login' || pathname === '/register' || pathname === '/forgot-password';
    const isAdminPage = pathname.startsWith('/admin');
    const isStudentPage = pathname.startsWith('/student');
    const isProfilePage = pathname === '/profile';

    // Already logged in → redirect away from auth pages
    if (isAuthPage && token) {
        return NextResponse.redirect(new URL('/student/dashboard', request.url));
    }

    // Not logged in → redirect to login from protected pages
    if ((isAdminPage || isStudentPage || isProfilePage) && !token) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public files (images, etc)
         */
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
