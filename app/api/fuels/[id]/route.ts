import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// Fetch record using params id
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = await params;
  try {
    const response = await prisma.fuel.findUnique({
      where: {
        id: id,
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
    await prisma.fuel.update({
      where: {
        id: id,
      },
      data: data,
    });

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error(error);
  }
}

// Delete record using params id
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = await params;

  try {
    await prisma.fuel.delete({
      where: {
        id: id,
      },
    });
    return NextResponse.json({ message: "Record deleted" }, { status: 200 });
  } catch (error) {
    console.error(error);
  }
}
