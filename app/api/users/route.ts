import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// Fetch all records
export async function GET(req: Request) {
  try {
    const response = await prisma.user.findMany();

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "An error occurred" }, { status: 500 });
  }
}
