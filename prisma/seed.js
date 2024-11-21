import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.tenantTable.deleteMany();
  console.log("Existing tenants cleared!");

  // Generate 100 tenants
  const tenants = [];
  for (let i = 0; i < 100; i++) {
    const tenant = await prisma.tenantTable.create({
      data: {
        id: uuidv4(),
        name: `Tenant-${i + 1}`,
        contact: `+1-800-${Math.floor(1000000 + Math.random() * 9000000)}`, // Random 7-digit phone number
        email: `tenant${i + 1}@example.com`,
        password: `password${i + 1}`, // Simple password for demonstration
      },
    });
    tenants.push(tenant);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
