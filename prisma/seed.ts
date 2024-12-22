import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

// Maintenance types data
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

// User data
const User = {
  name: "Admin User",
  username: "admin",
  email: "admin@example.com",
  password: "123456",
};

async function main() {
  // Seed maintenance types
  console.log("Seeding maintenance types...");
  for (const maintenanceType of MaintenanceTypes) {
    await prisma.maintenanceType.create({
      data: maintenanceType,
    });
  }

  // Seed user
  console.log("Seeding user...");
  const hashedPassword = await bcrypt.hash(User.password, 10);
  await prisma.user.upsert({
    where: { email: User.email },
    update: {},
    create: {
      name: User.name,
      username: User.username,
      email: User.email,
      password: hashedPassword,
    },
  });

  console.log("Seeding completed.");
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
