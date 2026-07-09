// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const origin = process.env.NODE_ENV === "development" ? "http://localhost:3000" : request.nextUrl.origin;
  const betterAuthSessionUrl = new URL("/api/auth/get-session", origin);
  
  // Note: For Edge middleware, it's often tricky to query DB directly or use the auth object.
  // The recommended approach in Better Auth is to fetch the session API endpoint, passing headers.
  let session = null;
  try {
    const res = await fetch(betterAuthSessionUrl, {
      headers: {
        cookie: request.headers.get("cookie") || "",
      },
    });
    if (res.ok) {
      session = await res.json();
    }
  } catch (e) {
    // If fetching fails, treat as unauthenticated
  }

  const isAuth = !!session?.user;
  const role = session?.user?.role;

  // Protect /admin routes
  if (pathname.startsWith("/admin")) {
    if (!isAuth) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (role !== "ADMIN") {
      // If logged in but not admin, maybe redirect to account or home
      return NextResponse.redirect(new URL("/account", request.url));
    }
  }

  // Protect /account routes
  if (pathname.startsWith("/account")) {
    if (!isAuth) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    // We assume any logged in user can see /account, or we could restrict to CUSTOMER
  }

  // Protect auth routes from already logged-in users
  if (pathname.startsWith("/login") || pathname.startsWith("/register") || pathname.startsWith("/forgot-password")) {
    if (isAuth) {
      if (role === "ADMIN") {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
      return NextResponse.redirect(new URL("/account", request.url));
    }
  }

  return NextResponse.next();
}

// Config to specify which paths the middleware runs on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (handled by better-auth internally)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico).*)",
  ],
};
