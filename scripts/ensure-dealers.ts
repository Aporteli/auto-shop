/**
 * Ensures at least dealersSeed.length dealers exist without wiping the DB.
 * Updates existing dealer*@autoshop-demo.com records and creates missing ones.
 */
import { prisma } from '../lib/prisma';
import { dealersSeed } from '../prisma/seed-data/dealers';

async function main() {
  let created = 0;
  let updated = 0;

  for (let i = 0; i < dealersSeed.length; i++) {
    const seed = dealersSeed[i];
    const email = `dealer${i + 1}@autoshop-demo.com`;
    const logoSeed = seed.logoSeed ?? `dealer-${i + 1}`;
    const logo = `https://picsum.photos/seed/${logoSeed}/160/160`;
    const phoneDigits = seed.phone.replace(/\s+/g, '');

    const user = await prisma.user.upsert({
      where: { email },
      update: {
        firstName: 'Dealer',
        lastName: seed.en.split(' ')[0],
        phone: phoneDigits,
        role: 'DEALER',
        isVerified: true,
      },
      create: {
        email,
        passwordHash: '$2b$10$placeholder_hash_replace_later',
        firstName: 'Dealer',
        lastName: seed.en.split(' ')[0],
        phone: phoneDigits,
        role: 'DEALER',
        language: i % 2 === 0 ? 'EN' : 'RU',
        isVerified: true,
      },
    });

    const existing = await prisma.dealer.findUnique({ where: { userId: user.id } });
    if (existing) {
      await prisma.dealer.update({
        where: { id: existing.id },
        data: {
          companyName: seed.en,
          companyNameRu: seed.ru,
          logo,
          descriptionEn: `Trusted ${seed.en} offering quality vehicles across Georgia.`,
          descriptionRu: `Надёжный ${seed.ru} с качественными автомобилями по всей Грузии.`,
          website: `https://dealer${i + 1}.autoshop-demo.ge`,
          address: seed.addressEn,
          addressRu: seed.addressRu,
          phone: seed.phone,
          dealerType: i % 4 === 0 ? 'INTERNATIONAL' : 'LOCAL',
          verified: true,
        },
      });
      updated++;
    } else {
      await prisma.dealer.create({
        data: {
          userId: user.id,
          companyName: seed.en,
          companyNameRu: seed.ru,
          logo,
          descriptionEn: `Trusted ${seed.en} offering quality vehicles across Georgia.`,
          descriptionRu: `Надёжный ${seed.ru} с качественными автомобилями по всей Грузии.`,
          website: `https://dealer${i + 1}.autoshop-demo.ge`,
          address: seed.addressEn,
          addressRu: seed.addressRu,
          phone: seed.phone,
          dealerType: i % 4 === 0 ? 'INTERNATIONAL' : 'LOCAL',
          verified: true,
        },
      });
      created++;
    }
  }

  const total = await prisma.dealer.count();
  console.log(`dealers upserted: created=${created}, updated=${updated}, total=${total}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
