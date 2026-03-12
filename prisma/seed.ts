import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.approvedUser.upsert({
    where: { email: "joserycarddo2003@gmail.com" },
    update: { role: "ADMIN" },
    create: {
      email: "joserycarddo2003@gmail.com",
      name: "Jose Rycarddo",
      role: "ADMIN",
    },
  });
  console.log("Seeded: joserycarddo2003@gmail.com as ADMIN");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
