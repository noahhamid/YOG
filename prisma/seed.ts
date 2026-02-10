import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create admin user
  const hashedPassword = await bcrypt.hash("admin123", 10);

  const admin = await prisma.user.upsert({
    where: { phone: "+251911111111" },
    update: {},
    create: {
      name: "YOG Admin",
      phone: "+251911111111",
      email: "admin@yog.com",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  console.log("✅ Admin user created:", {
    phone: admin.phone,
    role: admin.role,
  });

  // Create test seller
  const sellerPassword = await bcrypt.hash("seller123", 10);

  const sellerUser = await prisma.user.upsert({
    where: { phone: "+251922222222" },
    update: {},
    create: {
      name: "Urban Addis Owner",
      phone: "+251922222222",
      email: "seller@urbanaddis.com",
      password: sellerPassword,
      role: "SELLER",
    },
  });

  const seller = await prisma.seller.upsert({
    where: { userId: sellerUser.id },
    update: {},
    create: {
      userId: sellerUser.id,
      brandName: "Urban Addis",
      location: "Addis Ababa, Ethiopia",
      instagram: "@urbanaddis",
      approved: true,
    },
  });

  console.log("✅ Test seller created:", {
    phone: sellerUser.phone,
    brandName: seller.brandName,
  });

  console.log("\n📝 LOGIN CREDENTIALS:");
  console.log("Admin - Phone: +251911111111, Password: admin123");
  console.log("Seller - Phone: +251922222222, Password: seller123");
}

main()
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });