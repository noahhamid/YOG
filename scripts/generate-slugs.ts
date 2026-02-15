import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function generateSlug(brandName: string): string {
  return brandName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function main() {
  const sellers = await prisma.seller.findMany({
    where: {
      OR: [
        { storeSlug: null },
        { storeSlug: "" }
      ]
    },
  });

  console.log(`Found ${sellers.length} sellers without slugs\n`);

  for (const seller of sellers) {
    let slug = generateSlug(seller.brandName);
    
    // Check if slug already exists
    const existingSeller = await prisma.seller.findUnique({
      where: { storeSlug: slug }
    });

    // If slug exists, add a number
    if (existingSeller) {
      slug = `${slug}-${seller.id.substring(0, 5)}`;
    }

    await prisma.seller.update({
      where: { id: seller.id },
      data: { storeSlug: slug },
    });

    console.log(`✅ Generated slug for "${seller.brandName}": ${slug}`);
  }

  console.log("\nDone! All sellers now have slugs.");
}

main()
  .catch((error) => {
    console.error("Error:", error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());