import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// Fetch a specific car by its ID
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = await params;

  try {
    const response = await prisma.car.findUnique({
      where: {
        id,
      },
      include: {
        fuel: true,
        employee: true,
      },
    });
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Error fetching car:", error);
    return NextResponse.json(
      { message: "An error occurred while fetching the car." },
      { status: 500 }
    );
  }
}

// Update a specific car by its ID
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = await params;
  const data = await req.json();

  try {
    const updatedCar = await prisma.car.update({
      where: {
        id,
      },
      data,
    });

    return NextResponse.json(updatedCar, { status: 200 });
  } catch (error) {
    console.error("Error updating car:", error);
    return NextResponse.json(
      { message: "An error occurred while updating the car." },
      { status: 500 }
    );
  }
}

// Delete a specific car by its ID
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = await params;

  try {
    await prisma.car.delete({
      where: {
        id,
      },
    });

    return NextResponse.json(
      { message: "Car deleted successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting car:", error);
    return NextResponse.json(
      { message: "An error occurred while deleting the car." },
      { status: 500 }
    );
  }
}
