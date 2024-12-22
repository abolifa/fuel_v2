import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { SignJWT } from "jose";

const JWT_SECRET = process.env.JWT_SECRET;
const TOKEN_EXPIRY = "30d";

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables.");
}

// Convert secret to a Uint8Array
const encoder = new TextEncoder();
const jwtSecret = encoder.encode(JWT_SECRET);

export async function POST(req: Request) {
  try {
    const { emailOrUsername, password } = await req.json();

    if (!emailOrUsername || !password) {
      return NextResponse.json(
        { error: "Email/username and password are required." },
        { status: 400 }
      );
    }

    // Fetch user by email or username from the database
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: emailOrUsername }, { username: emailOrUsername }],
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email/username or password." },
        { status: 401 }
      );
    }

    // Compare the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid email/username or password." },
        { status: 401 }
      );
    }

    // Generate JWT token using `jose`
    const token = await new SignJWT({ id: user.id, email: user.email })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime(TOKEN_EXPIRY)
      .sign(jwtSecret);

    // Set the token in cookies
    const response = NextResponse.json({
      message: "Login successful.",
      token,
    });
    response.cookies.set("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
