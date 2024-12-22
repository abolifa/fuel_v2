import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ message: "Logged out" });
  response.cookies.set("authToken", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(0), // Expire the cookie
  });
  return response;
}
