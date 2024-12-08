import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function testPrisma() {
  try {
    const maintenance = await prisma.maintenance.create({
      data: {
        carId: "cm4g1a3tt0001n6ic94u99l7q",
        description: "Changed engine oil and filter",
        cost: 150,
        odoMeter: 5000,
      },
    });

    console.log("Maintenance created:", maintenance);

    const joinRecords = [
      {
        maintenanceId: maintenance.id,
        maintenanceTypeId: "cm4g481mv0000n6655nko4j3m",
      },
      {
        maintenanceId: maintenance.id,
        maintenanceTypeId: "cm4g481n40001n665sksd1jh2",
      },
    ];

    console.log("Join records:", joinRecords);

    await prisma.maintenanceTypeOnMaintenance.createMany({
      data: joinRecords,
    });

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

    console.log("Full maintenance record:", response);
  } catch (error) {
    console.error("Error in Prisma query:", error);
  }
}

testPrisma();
