import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// Fetch record using params id
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = await params;
  try {
    const response = await prisma.user.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        created: true,
        updated: true,
      },
    });
    return NextResponse.json(response, { status: 200 });
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
    await prisma.user.delete({
      where: {
        id: id,
      },
    });
    return NextResponse.json({ message: "Record deleted" }, { status: 200 });
  } catch (error) {
    console.error(error);
  }
}
