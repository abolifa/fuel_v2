import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const [employees, tanks, cars] = await Promise.all([
      prisma.employee.findMany({
        include: {
          Car: true,
        },
      }),
      prisma.tank.findMany({
        include: {
          fuel: true,
        },
      }),
      prisma.car.findMany({
        include: {
          employee: true,
        },
      }),
    ]);

    const res = {
      employees,
      tanks,
      cars,
    };

    return NextResponse.json(res, { status: 200 });
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { message: "An error occurred while fetching data." },
      { status: 500 }
    );
  }
}
