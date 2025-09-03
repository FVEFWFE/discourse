import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Protected routes that require authentication and subscription
const protectedRoutes = ["/dashboard", "/map", "/intel-database", "/venue"];
const authRoutes = ["/auth/signin", "/auth/signup"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));
  
  // Get session token from cookies
  const sessionToken = request.cookies.get("next-auth.session-token") || 
                      request.cookies.get("__Secure-next-auth.session-token");
  
  // If accessing protected route without session, redirect to homepage
  if (isProtectedRoute && !sessionToken) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  
  // If accessing auth routes with session, redirect to dashboard
  if (isAuthRoute && sessionToken) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all routes except static files and api routes
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};