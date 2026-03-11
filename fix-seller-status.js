const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fixStatuses() {
  console.log('🔄 Fixing seller statuses...');

  // Update approved sellers
  const approved = await prisma.seller.updateMany({
    where: { approved: true },
    data: { status: 'APPROVED' },
  });
  console.log(`✅ Set ${approved.count} sellers to APPROVED`);

  // Update rejected sellers
  const rejected = await prisma.seller.updateMany({
    where: {
      approved: false,
      rejectionReason: { not: null },
    },
    data: { status: 'REJECTED' },
  });
  console.log(`✅ Set ${rejected.count} sellers to REJECTED`);

  // Update pending sellers
  const pending = await prisma.seller.updateMany({
    where: {
      approved: false,
      rejectionReason: null,
    },
    data: { status: 'PENDING' },
  });
  console.log(`✅ Set ${pending.count} sellers to PENDING`);

  // Show all sellers
  const all = await prisma.seller.findMany({
    select: {
      brandName: true,
      status: true,
      approved: true,
    },
  });

  console.log('\n📊 Current sellers:');
  all.forEach(s => {
    console.log(`  - ${s.brandName}: ${s.status} (approved: ${s.approved})`);
  });

  await prisma.$disconnect();
  console.log('\n✨ Done!');
}

fixStatuses().catch((e) => {
  console.error('❌ Error:', e);
  process.exit(1);
});