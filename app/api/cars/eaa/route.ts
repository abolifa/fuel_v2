import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const cars = await prisma.car.findMany({
      where: {
        isEaaCar: true,
      },
    });
    return NextResponse.json(cars, { status: 200 });
  } catch (error) {
    console.error("Error fetching cars:", error);
    return NextResponse.json(
      { error: "فشل في تحميل المركبات" },
      { status: 500 }
    );
  }
}
