import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    // Fetch all cars where isEaaCar = true and all MaintenanceType concurrently
    const [cars, maintenanceTypes] = await Promise.all([
      prisma.car.findMany({
        where: {
          isEaaCar: true,
        },
      }),
      prisma.maintenanceType.findMany(),
    ]);

    // Combine the results
    const res = {
      cars,
      maintenanceTypes,
    };

    return NextResponse.json(res, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching data:", error);

    return NextResponse.json(
      { message: "Error fetching data", error: error.message },
      { status: 500 }
    );
  }
}
