/**
 * @file frontend/proxy.ts
 * @description Next.js 16+ Proxy to protect admin routes.
 * Acts as a network boundary before requests reach the application.
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * The main proxy function that Next.js runs on matched routes.
 */
export function proxy(request: NextRequest) {
    // 1. Check if the user has an authentication token in their cookies
    const token = request.cookies.get('token')?.value;

    // 2. Check if the user is trying to access an /admin route
    const isAccessingAdmin = request.nextUrl.pathname.startsWith('/admin');

    // 3. If they want admin access but have no token, redirect to login
    if (isAccessingAdmin && !token) {
        // Create a URL for the login page, preserving the original URL base
        const loginUrl = new URL('/auth/login', request.url);
        return NextResponse.redirect(loginUrl);
    }

    // 4. Otherwise, let them proceed normally
    return NextResponse.next();
}

// Fallback for Turbopack strict export requirements
export default proxy;

/**
 * Configuration object to tell Next.js exactly which routes this proxy should run on.
 */
export const config = {
    matcher: [
        /*
         * Match all request paths starting with /admin
         * This regex ignores API routes and static files inside /admin if you ever add them.
         */
        '/admin/:path*',
    ],
};