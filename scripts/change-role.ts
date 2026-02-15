import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Get email from command line argument
  const email = process.argv[2];

  if (!email) {
    console.log("❌ Please provide an email address");
    console.log("Usage: npx tsx scripts/make-admin.ts your@email.com");
    process.exit(1);
  }

  // Find user by email
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (!user) {
    console.log(`❌ User not found: ${email}`);
    process.exit(1);
  }

  // Update user role to ADMIN
  await prisma.user.update({
    where: { id: user.id },
    data: { role: "ADMIN" },
  });

  console.log(`✅ Successfully made ${user.email} an ADMIN!`);
  console.log(`   Name: ${user.name}`);
  console.log(`   Role: ADMIN`);
}

main()
  .catch((error) => {
    console.error("Error:", error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());