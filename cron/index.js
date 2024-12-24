import { PrismaClient } from "@prisma/client";
import cron from "node-cron";

const prisma = new PrismaClient();
// Schedule the task
cron.schedule("0 0 1 * *", async () => {
  console.log("Resetting quotas to initialQuota for all employees");

  try {
    await prisma.$executeRawUnsafe(`
      UPDATE "Employee"
      SET "quota" = "initialQuota"
    `);
    console.log("Employee quotas reset successfully.");
  } catch (error) {
    console.error("Error resetting quotas:", error);
  }
});

console.log("Cron job scheduled for the 1st of every month.");
