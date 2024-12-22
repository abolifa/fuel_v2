import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

interface JwtPayload {
  id: string;
  email: string;
  iat: number;
  exp: number;
}

const JWT_SECRET = process.env.JWT_SECRET || "";

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables.");
}

const encoder = new TextEncoder();
const jwtSecret = encoder.encode(JWT_SECRET);

export async function middleware(req: NextRequest) {
  const cookie = req.cookies.get("authToken");
  const url = req.nextUrl;

  if (url.pathname === "/login" || url.pathname === "/api/auth/login") {
    return NextResponse.next();
  }

  if (!cookie) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const authToken = cookie.value;

  try {
    // Add type annotation for the payload
    const { payload } = await jwtVerify<JwtPayload>(authToken, jwtSecret);
    console.log("Decoded token payload:", payload);

    const response = NextResponse.next();

    // Ensure payload.id is a string before setting it
    response.cookies.set("userId", payload.id as string);

    return response;
  } catch (error: any) {
    console.error("Token verification failed:", error.message);
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
