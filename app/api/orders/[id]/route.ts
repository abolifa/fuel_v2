import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// Fetch record using params id
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = await params;
  try {
    const response = await prisma.order.findUnique({
      where: {
        id: id,
      },
      include: {
        fuel: true,
        tank: true,
      },
    });
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "An error occurred" }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const data = await req.json();

  try {
    const existingOrder = await prisma.order.findUnique({
      where: { id },
      include: { tank: true },
    });

    if (!existingOrder) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    const tankId = existingOrder.tankId;
    const oldAmount = existingOrder.amount;
    const newAmount = data.amount;

    // Update the order and adjust currentLevel based on the difference
    await prisma.$transaction([
      prisma.order.update({
        where: { id },
        data,
      }),
      prisma.tank.update({
        where: { id: tankId },
        data: {
          currentLevel: {
            increment: newAmount - oldAmount, // Adjust by the difference
          },
        },
      }),
    ]);

    return NextResponse.json(
      { message: "Order updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "An error occurred" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const existingOrder = await prisma.order.findUnique({
      where: { id },
      include: { tank: true },
    });

    if (!existingOrder) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    const tankId = existingOrder.tankId;
    const orderAmount = existingOrder.amount;

    // Delete the order and decrement currentLevel
    await prisma.$transaction([
      prisma.order.delete({ where: { id } }),
      prisma.tank.update({
        where: { id: tankId },
        data: {
          currentLevel: {
            decrement: orderAmount, // Subtract the order amount from currentLevel
          },
        },
      }),
    ]);

    return NextResponse.json(
      { message: "Order deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "An error occurred" }, { status: 500 });
  }
}
