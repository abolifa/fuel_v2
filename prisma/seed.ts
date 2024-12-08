import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const MaintenanceTypes = [
  { name: "زيت محرك" },
  { name: "فلتر زيت" },
  { name: "فلتر وقود" },
  { name: "فلتر هواء" },
  { name: "شماعي" },
  { name: "كاتينه" },
  { name: "شدادات" },
  { name: "باطيات" },
  { name: "ديسكو باطني" },
  { name: "زيت فرامل" },
  { name: "صالة" },
  { name: "كهرباء" },
  { name: "أخرى" },
];

async function main() {
  const createdMaintenanceTypes = [];
  for (const maintenanceType of MaintenanceTypes) {
    const createdMaintenanceType = await prisma.maintenanceType.create({
      data: maintenanceType,
    });
    createdMaintenanceTypes.push(createdMaintenanceType);
  }
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
