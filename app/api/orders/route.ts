import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// Fetch all records
export async function GET(req: Request) {
  try {
    const response = await prisma.order.findMany({
      include: {
        fuel: true,
        tank: true,
      },
      orderBy: {
        created: "desc",
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
    await prisma.$transaction([
      prisma.order.create({ data }),
      prisma.tank.update({
        where: { id: data.tankId },
        data: {
          currentLevel: {
            increment: data.amount, // Add the order amount to currentLevel
          },
        },
      }),
    ]);

    return NextResponse.json(
      { message: "Order created successfully" },
      { status: 201 }
    );
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { message: error.message || "An error occurred" },
      { status: 500 }
    );
  }
}
