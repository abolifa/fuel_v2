import { jwtVerify } from "jose";
import { NextResponse } from "next/server";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function POST(req: Request) {
  const { token } = await req.json();

  if (!token) {
    return NextResponse.json("No token provided.", { status: 404 });
  }

  try {
    // Verify the token
    const { payload } = await jwtVerify(token, JWT_SECRET);

    // Optionally, check expiration or other claims
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return NextResponse.json(
        { valid: false, error: "Token expired" },
        { status: 401 }
      );
    }

    // Token is valid
    return NextResponse.json({ valid: true, payload }, { status: 200 });
  } catch (error) {
    console.error("Token verification error:", error);
    return NextResponse.json(
      { valid: false, error: "Invalid token" },
      { status: 201 }
    );
  }
}
