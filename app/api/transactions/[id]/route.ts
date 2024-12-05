import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// Fetch record using params id
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = await params;
  try {
    const response = await prisma.transaction.findUnique({
      where: {
        id,
      },
      include: {
        car: true,
        employee: true,
        tank: true,
      },
    });
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error(error);
  }
}

// Update record using params id
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = await params;
  const data = await req.json();

  try {
    const response = await prisma.$transaction(async (prisma) => {
      // Get the existing transaction
      const existingTransaction = await prisma.transaction.findUnique({
        where: { id },
      });

      if (!existingTransaction) {
        throw new Error("Transaction not found");
      }

      // Reverse previous changes to tank and employee quota
      await prisma.tank.update({
        where: { id: existingTransaction.tankId },
        data: {
          currentLevel: { increment: existingTransaction.amount ?? 0 },
        },
      });

      await prisma.employee.update({
        where: { id: existingTransaction.employeeId },
        data: {
          quota: { increment: existingTransaction.amount ?? 0 },
        },
      });

      // Apply new changes
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

      // Update the transaction
      return prisma.transaction.update({
        where: { id },
        data,
      });
    });

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "An error occurred" }, { status: 500 });
  }
}

// Delete record using params id
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = await params;

  try {
    const response = await prisma.$transaction(async (prisma) => {
      // Get the existing transaction
      const existingTransaction = await prisma.transaction.findUnique({
        where: { id },
      });

      if (!existingTransaction) {
        throw new Error("Transaction not found");
      }

      // Reverse the changes to tank and employee quota
      await prisma.tank.update({
        where: { id: existingTransaction.tankId },
        data: {
          currentLevel: { increment: existingTransaction.amount ?? 0 },
        },
      });

      await prisma.employee.update({
        where: { id: existingTransaction.employeeId },
        data: {
          quota: { increment: existingTransaction.amount ?? 0 },
        },
      });

      // Delete the transaction
      return prisma.transaction.delete({
        where: { id },
      });
    });

    return NextResponse.json({ message: "Record deleted" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "An error occurred" }, { status: 500 });
  }
}
