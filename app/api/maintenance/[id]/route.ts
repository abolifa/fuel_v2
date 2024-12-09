import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// fetch record
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = await params;
  try {
    const response = await prisma.maintenance.findUnique({
      where: { id },
      include: {
        car: true,
        types: {
          include: {
            maintenanceType: true,
          },
        },
      },
    });

    return NextResponse.json(response, { status: 200 });
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

// delete record
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = await params;
  try {
    const response = await prisma.maintenance.delete({
      where: { id },
    });

    return NextResponse.json(response, { status: 200 });
  } catch (error: any) {
    console.error("Error deleting maintenance record:", error);

    return NextResponse.json(
      {
        message:
          "An unexpected error occurred while deleting maintenance record.",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = await params; // Correct destructuring

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

    console.log("Updating maintenance record.");

    // Step 1: Update the Maintenance record
    const maintenance = await prisma.maintenance.update({
      where: { id },
      data: {
        carId,
        description,
        cost,
        odoMeter,
      },
    });

    console.log("Maintenance updated:", maintenance);

    // Step 2: Remove existing join records
    await prisma.maintenanceTypeOnMaintenance.deleteMany({
      where: { maintenanceId: maintenance.id },
    });

    console.log("Existing join records removed.");

    // Step 3: Insert new join records
    const joinRecords = types.map((typeId: string) => ({
      maintenanceId: maintenance.id,
      maintenanceTypeId: typeId,
    }));

    console.log("New join records to be inserted:", joinRecords);

    const joinResult = await prisma.maintenanceTypeOnMaintenance.createMany({
      data: joinRecords,
    });

    console.log("New join records inserted:", joinResult);

    // Step 4: Fetch the updated Maintenance record with relationships
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

    console.log("Full updated maintenance record fetched:", response);

    return NextResponse.json(response, { status: 200 }); // 200 for update
  } catch (error: any) {
    console.error("Error during maintenance record update:", error);

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
          "An unexpected error occurred while updating the maintenance record.",
        error: errorResponse,
      },
      { status: 500 }
    );
  }
}
