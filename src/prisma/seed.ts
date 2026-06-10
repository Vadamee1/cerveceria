import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
  const adminRole = await prisma.role.upsert({
    where: { id: "role-admin" },
    update: {},
    create: {
      id: "role-admin",
      name: "Administrador",
    },
  });

  await prisma.role.upsert({
    where: { id: "role-seller" },
    update: {},
    create: {
      id: "role-seller",
      name: "Vendedor",
    },
  });

  const hashedPassword = await bcrypt.hash("genesisrojo", 10);

  await prisma.user.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      username: "Genesis",
      password: hashedPassword,
      roleId: adminRole.id,
      isActive: true,
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
