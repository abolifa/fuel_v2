import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// Fetch all records
export async function GET(req: Request) {
  try {
    const response = await prisma.transaction.findMany({
      include: {
        car: true,
        employee: true,
        tank: true,
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
    const response = await prisma.$transaction(async (prisma) => {
      // Deduct amount from tank and employee quota
      await prisma.tank.update({
        where: { id: data.tankId },
        data: {
          currentLevel: { decrement: data.amount },
        },
      });

      await prisma.employee.update({
        where: { id: data.employeeId },
        data: {
          quota: { decrement: data.amount },
        },
      });

      // Create the transaction
      return prisma.transaction.create({
        data,
      });
    });

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "An error occurred" }, { status: 500 });
  }
}
