import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// Fetch all records
export async function GET(req: Request) {
  try {
    const response = await prisma.employee.findMany({
      include: {
        Car: true,
      },
    });

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "An error occurred" }, { status: 500 });
  }
}

// Create a new record
export async function POST(req: Request) {
  const data = await req.json();
  try {
    const response = await prisma.employee.create({
      data: data,
    });

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "An error occurred" }, { status: 500 });
  }
}
