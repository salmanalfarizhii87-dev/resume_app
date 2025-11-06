import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Check if the route needs authentication
  if (pathname.startsWith("/app")) {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      // Redirect to sign-in page if not authenticated
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
  }

  // Allow public routes and authenticated /app routes
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
     * - sign-in, sign-up (auth pages)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sign-in|sign-up).*)",
  ],
};
