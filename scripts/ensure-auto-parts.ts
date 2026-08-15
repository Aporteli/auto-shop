import { prisma } from '../lib/prisma';
import { autoParts } from '../prisma/seed-data/auto-parts';

async function main() {
  const slugs = autoParts.map((part) => part.slug);

  for (const part of autoParts) {
    await prisma.autoPart.upsert({
      where: { slug: part.slug },
      update: {
        nameEn: part.nameEn,
        nameRu: part.nameRu,
        categorySlug: part.categorySlug,
        categoryEn: part.categoryEn,
        categoryRu: part.categoryRu,
        descriptionEn: part.descriptionEn,
        descriptionRu: part.descriptionRu,
        functionEn: part.functionEn,
        functionRu: part.functionRu,
        replacementEn: part.replacementEn,
        replacementRu: part.replacementRu,
      },
      create: part,
    });
  }

  const extra = await prisma.autoPart.deleteMany({
    where: { slug: { notIn: slugs } },
  });

  const total = await prisma.autoPart.count();
  console.log(`upserted ${autoParts.length} auto parts, removed ${extra.count} extras, total=${total}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
