import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// fetch all records
export async function GET() {
  try {
    const maintenanceRecords = await prisma.maintenance.findMany({
      include: {
        car: true,
        types: {
          include: {
            maintenanceType: true,
          },
        },
      },
    });

    return NextResponse.json(maintenanceRecords, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching maintenance records:", error);

    return NextResponse.json(
      {
        message:
          "An unexpected error occurred while fetching maintenance records.",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("Request body received:", body);

    const { carId, description, cost, odoMeter, types } = body;

    if (!carId || !Array.isArray(types) || types.length === 0) {
      console.error("Validation failed: 'carId' or 'types' are missing.");
      return NextResponse.json(
        { message: "'carId' and 'types' are required fields." },
        { status: 400 }
      );
    }

    console.log("Creating maintenance record.");

    // Step 1: Create Maintenance record
    const maintenance = await prisma.maintenance.create({
      data: {
        carId,
        description,
        cost,
        odoMeter,
      },
    });

    console.log("Maintenance created:", maintenance);

    // Step 2: Populate the join table
    const joinRecords = types.map((typeId: string) => ({
      maintenanceId: maintenance.id,
      maintenanceTypeId: typeId,
    }));

    console.log("Join records to be inserted:", joinRecords);

    // Insert join records into the join table
    const joinResult = await prisma.maintenanceTypeOnMaintenance.createMany({
      data: joinRecords,
      skipDuplicates: true, // Prevent duplicate entries
    });

    console.log("Join records inserted:", joinResult);

    // Step 3: Fetch the complete Maintenance record with relationships
    const response = await prisma.maintenance.findUnique({
      where: { id: maintenance.id },
      include: {
        types: {
          include: {
            maintenanceType: true,
          },
        },
      },
    });

    console.log("Full maintenance record with types fetched:", response);

    return NextResponse.json(response, { status: 201 });
  } catch (error: any) {
    console.error("Error during maintenance record creation:", error);

    // Ensure valid error payload for NextResponse.json
    const errorResponse = {
      message:
        error instanceof Error ? error.message : "An unknown error occurred",
      stack: error instanceof Error ? error.stack : null,
      rawError: error,
    };

    console.log("Formatted error response for debugging:", errorResponse);

    return NextResponse.json(
      {
        message:
          "An unexpected error occurred while creating the maintenance record.",
        error: errorResponse,
      },
      { status: 500 }
    );
  }
}
