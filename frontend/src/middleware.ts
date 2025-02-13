import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  // get the token from the request ehader (JWT from cookies via NextAuth)
  const token = await getToken({ req, secret: process.env.AUTH_SECRET });

  // get the current request pathname
  const { pathname } = req.nextUrl;

  // 2. if there is a token, and we are on the session page, redirect to the dashboard page
  if (pathname === "/login" && token) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = "/dashboard";
    return NextResponse.redirect(redirectUrl);
  }
  if (pathname === "/registration" && token) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = "/dashboard";
    return NextResponse.redirect(redirectUrl);
  }

  if (pathname === "/dashboard" && !token) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = "/login";
    return NextResponse.redirect(redirectUrl);
  }

  //TODO: Addd workout page and challenge page

  // 5. continue with the request, if no other condition is met
  return NextResponse.next();
}

// Configuration to match all paths except API routes, static files, images, etc.
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
