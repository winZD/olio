import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Fetch orchards for the user with the specific ID
  const orchards = await prisma.orchardTable.findMany({
    where: {
      userId: "2aff5064-a243-4d74-b01f-68975c0832b7", // Specify the user ID
    },
  });

  console.log(`${orchards.length} orchards found for the user!`);

  // Create employees for each orchard
  const employeePromises = [];
  for (const orchard of orchards) {
    // You can customize these roles and salaries based on your requirements
    const employeeData = [
      { name: "John Doe", role: "Farmer", salary: 3000 },
      { name: "Jane Smith", role: "Supervisor", salary: 4000 },
      { name: "Carlos Garcia", role: "Laborer", salary: 2000 },
    ];

    for (const employee of employeeData) {
      const employeePromise = prisma.employeeTable.create({
        data: {
          name: employee.name,
          role: employee.role,
          salary: employee.salary,
          orchardId: orchard.id,
          orchardUserId: orchard.userId, // Ensure the employee is linked to the orchard
        },
      });
      employeePromises.push(employeePromise);
    }
  }

  await Promise.all(employeePromises);
  console.log("Employees created!");

  // You can continue adding products, refresh tokens, or any other data as needed
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
