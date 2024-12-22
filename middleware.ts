import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

// Environment variables
const JWT_SECRET = process.env.JWT_SECRET || "";

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables.");
}

// Convert secret to a Uint8Array
const encoder = new TextEncoder();
const jwtSecret = encoder.encode(JWT_SECRET);

export async function middleware(req: NextRequest) {
  const cookie = req.cookies.get("authToken");
  const url = req.nextUrl;

  // Allow `/login` page and `/api/auth/login` API route
  if (url.pathname === "/login" || url.pathname === "/api/auth/login") {
    return NextResponse.next();
  }

  // Check for the authentication token
  if (!cookie) {
    console.log("No auth token found in cookies.");
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const authToken = cookie.value;

  try {
    // Verify the token using jose
    const { payload } = await jwtVerify(authToken, jwtSecret);
    console.log("Decoded token payload:", payload);

    // Proceed to the requested page
    return NextResponse.next();
  } catch (error: any) {
    console.error("Token verification failed:", error.message);
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

// Middleware matcher
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)", // Block all routes
  ],
};
