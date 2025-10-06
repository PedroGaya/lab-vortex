import { PrismaClient } from "../generated/prisma";

async function initializePrisma() {
  try {
    const prisma = new PrismaClient();

    console.info(
      "PrismaClient has been initialized and connected successfully."
    );
    return prisma;
  } catch (error) {
    console.error("Error connecting to the database:", error);
    process.exit(1);
  }
}

export const prisma = await initializePrisma();
