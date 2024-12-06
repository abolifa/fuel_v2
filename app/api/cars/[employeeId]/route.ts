import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// Fetch all cars for an employee
export async function GET(
  req: Request,
  { params }: { params: { employeeId: string } }
) {
  const { employeeId } = await params;

  try {
    const response = await prisma.car.findMany({
      where: {
        employeeId,
      },
      include: {
        employee: true,
        fuel: true,
      },
      orderBy: {
        created: "desc",
      },
    });

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Error fetching cars:", error);
    return NextResponse.json(
      { message: "An error occurred while fetching cars." },
      { status: 500 }
    );
  }
}

// Create a new car for an employee
export async function POST(
  req: Request,
  { params }: { params: { employeeId: string } }
) {
  const { employeeId } = await params;
  const data = await req.json();

  try {
    const response = await prisma.car.create({
      data: {
        ...data,
        employeeId,
      },
    });

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error("Error creating car:", error);
    return NextResponse.json(
      { message: "An error occurred while creating the car." },
      { status: 500 }
    );
  }
}
