import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const oliveVarieties = [
  {
    name: "Arbequina",
    description: "A small, brownish variety used for oil.",
    origin: "Spain",
  },
  {
    name: "Koroneiki",
    description: "A Greek variety known for its high-quality oil.",
    origin: "Greece",
  },
  {
    name: "Picual",
    description: "A Spanish variety, high yield and high oil content.",
    origin: "Spain",
  },
  {
    name: "Frantoio",
    description: "An Italian variety known for its fruity and intense oil.",
    origin: "Italy",
  },
  {
    name: "Leccino",
    description: "An Italian variety, known for its delicate flavor.",
    origin: "Italy",
  },
];

async function main() {
  // Fetch existing users
  const users = await prisma.userTable.findMany();
  console.log(`${users.length} users found!`);

  // Create orchards for each user
  const orchardPromises = [];
  for (const user of users) {
    const orchardPromise = prisma.orchardTable.create({
      data: {
        userId: user.id,
        name: `Orchard of ${user.name}`,
        location: `Location-${Math.floor(Math.random() * 100)}`,
        area: Math.floor(5 + Math.random() * 20), // Random area between 5 and 25 hectares
        soilType: ["Sandy", "Clay", "Loam"][Math.floor(Math.random() * 3)],
        irrigation: Math.random() > 0.5, // Random irrigation status
      },
    });
    orchardPromises.push(orchardPromise);
  }

  const orchards = await Promise.all(orchardPromises);
  console.log("Orchards created!");

  // Create varieties for each orchard
  const varietyPromises = [];
  for (const orchard of orchards) {
    for (const variety of oliveVarieties) {
      const varietyPromise = prisma.varietyTable.create({
        data: {
          name: variety.name,
          description: variety.description,
          origin: variety.origin,
          orchardId: orchard.id,
          orchardUserId: orchard.userId, // Ensure proper foreign key relation
        },
      });
      varietyPromises.push(varietyPromise);
    }
  }

  await Promise.all(varietyPromises);
  console.log("Varieties created!");

  // Create trees for each orchard (assuming each orchard gets 20-50 trees)
  const treePromises = [];
  for (const orchard of orchards) {
    const numTrees = Math.floor(20 + Math.random() * 30); // Random number of trees per orchard
    for (let i = 0; i < numTrees; i++) {
      const variety = await prisma.varietyTable.findFirst({
        where: { orchardId: orchard.id },
      });

      const treePromise = prisma.treeTable.create({
        data: {
          plantedDate: new Date(),
          age: 0, // Assuming trees are newly planted
          varietyId: variety.id,
          orchardId: orchard.id,
          orchardUserId: orchard.userId,
        },
      });
      treePromises.push(treePromise);
    }
  }

  await Promise.all(treePromises);
  console.log("Trees created!");

  // Create harvests for each tree (random data)
  const harvestPromises = [];
  for (const orchard of orchards) {
    const trees = await prisma.treeTable.findMany({
      where: { orchardId: orchard.id },
    });

    for (const tree of trees) {
      const harvestPromise = prisma.harvestTable.create({
        data: {
          year: new Date().getFullYear(),
          quantity: Math.random() * 50, // Random quantity between 0 and 50 kg
          quality: ["Extra Virgin", "Virgin", "Standard"][
            Math.floor(Math.random() * 3)
          ],
          treeId: tree.id,
          orchardId: orchard.id,
          orchardUserId: orchard.userId,
        },
      });
      harvestPromises.push(harvestPromise);
    }
  }

  await Promise.all(harvestPromises);
  console.log("Harvests created!");

  // You can continue adding employees, products, and refresh tokens as needed
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
