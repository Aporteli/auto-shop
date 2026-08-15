import 'dotenv/config';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import {
  Currency,
  ListingStatus,
  ListingType,
  PrismaClient,
  SteeringWheel,
  UserRole,
} from '@prisma/client';
import { autoParts } from './seed-data/auto-parts';
import { blogPosts } from './seed-data/blog-posts';
import { features, interiorColors, interiorMaterials, stickers } from './seed-data/features-stickers';
import {
  chunk,
  daysAgo,
  dealersSeed,
  firstNamesEn,
  lastNamesEn,
  listingDescriptionsEn,
  listingDescriptionsRu,
  pickRandom,
  pickRandomMany,
  randomDecimal,
  randomInt,
  randomPlate,
  randomVin,
} from './seed-data/helpers';
import { countries } from './seed-data/locations';
import { expandManufacturersWithVariants, manufacturers as baseManufacturers } from './seed-data/manufacturers';
import {
  bodyTypes,
  colors,
  driveTypes,
  fuelTypes,
  transmissions,
  vehicleCategories,
} from './seed-data/reference';

const adapter =
  process.env.DATABASE_URL != null
    ? new PrismaMariaDb(process.env.DATABASE_URL)
    : new PrismaMariaDb({
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT) || 3306,
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'auto_shop_db',
        connectionLimit: 10,
      });

const prisma = new PrismaClient({ adapter });

const LISTING_COUNT = Number(process.env.SEED_LISTING_COUNT) || 3500;
const LISTING_BATCH_SIZE = 25;
const PRIVATE_USER_COUNT = 40;
const DEALER_COUNT = dealersSeed.length;

const ALLOWED_CATEGORY_SLUGS = ['cars', 'custom-vehicles', 'motorcycles'] as const;

const motorcycleBrands = new Set(['Harley-Davidson', 'Yamaha', 'Kawasaki', 'Ducati', 'KTM']);
const customVehicleBrands = new Set(['MAN', 'Scania', 'DAF', 'Iveco', 'Isuzu', 'GAZ', 'Volvo']);

async function clearTransactionalData() {
  console.log('  Clearing existing transactional data...');
  await prisma.auctionBid.deleteMany();
  await prisma.rental.deleteMany();
  await prisma.listingFeature.deleteMany();
  await prisma.listingSticker.deleteMany();
  await prisma.listingImage.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.review.deleteMany();
  await prisma.message.deleteMany();
  await prisma.savedSearch.deleteMany();
  await prisma.listing.deleteMany();
  await prisma.dealer.deleteMany();
  await prisma.vinCheck.deleteMany();
  await prisma.technicalInspection.deleteMany();
  await prisma.blogPost.deleteMany();
  await prisma.user.deleteMany({ where: { email: { not: 'admin@autoshop.com' } } });
}

async function seedReferenceData() {
  await prisma.vehicleCategory.deleteMany({
    where: { slug: { notIn: [...ALLOWED_CATEGORY_SLUGS] } },
  });

  const categories = await Promise.all(
    vehicleCategories.map((c) =>
      prisma.vehicleCategory.upsert({
        where: { slug: c.slug },
        update: { nameEn: c.nameEn, nameRu: c.nameRu },
        create: c,
      }),
    ),
  );

  const bodyTypeRecords = await Promise.all(
    bodyTypes.map((b) =>
      prisma.bodyType.upsert({ where: { nameEn: b.nameEn }, update: {}, create: b }),
    ),
  );

  const fuelTypeRecords = await Promise.all(
    fuelTypes.map((f) =>
      prisma.fuelType.upsert({ where: { nameEn: f.nameEn }, update: {}, create: f }),
    ),
  );

  const transmissionRecords = await Promise.all(
    transmissions.map((t) =>
      prisma.transmission.upsert({ where: { nameEn: t.nameEn }, update: {}, create: t }),
    ),
  );

  const driveTypeRecords = await Promise.all(
    driveTypes.map((d) =>
      prisma.driveType.upsert({ where: { nameEn: d.nameEn }, update: {}, create: d }),
    ),
  );

  const colorRecords = await Promise.all(
    colors.map((c) =>
      prisma.color.upsert({
        where: { nameEn: c.nameEn },
        update: { hex: c.hex },
        create: c,
      }),
    ),
  );

  let cityCount = 0;
  for (const countryData of countries) {
    const country = await prisma.country.upsert({
      where: { code: countryData.code },
      update: { nameEn: countryData.nameEn, nameRu: countryData.nameRu },
      create: {
        nameEn: countryData.nameEn,
        nameRu: countryData.nameRu,
        code: countryData.code,
      },
    });

    for (const cityData of countryData.cities) {
      await prisma.city.upsert({
        where: { countryId_nameEn: { countryId: country.id, nameEn: cityData.nameEn } },
        update: {},
        create: { ...cityData, countryId: country.id },
      });
      cityCount++;
    }
  }

  await prisma.feature.deleteMany();
  const featureRecords = await Promise.all(
    features.map((f) => prisma.feature.create({ data: f })),
  );

  const stickerRecords = await Promise.all(
    stickers.map((s) =>
      prisma.sticker.upsert({ where: { nameEn: s.nameEn }, update: {}, create: s }),
    ),
  );

  console.log(`  ✓ ${categories.length} categories`);
  console.log(`  ✓ ${bodyTypeRecords.length} body types, ${fuelTypeRecords.length} fuel types`);
  console.log(`  ✓ ${transmissionRecords.length} transmissions, ${driveTypeRecords.length} drive types`);
  console.log(`  ✓ ${colorRecords.length} colors`);
  console.log(`  ✓ ${countries.length} countries, ${cityCount} cities`);
  console.log(`  ✓ ${featureRecords.length} features, ${stickerRecords.length} stickers`);

  return {
    categories,
    bodyTypes: bodyTypeRecords,
    fuelTypes: fuelTypeRecords,
    transmissions: transmissionRecords,
    driveTypes: driveTypeRecords,
    colors: colorRecords,
    features: featureRecords,
    stickers: stickerRecords,
  };
}

async function seedManufacturersAndModels() {
  const expanded = expandManufacturersWithVariants(baseManufacturers, 2);
  let modelCount = 0;

  for (const mfr of expanded) {
    const manufacturer = await prisma.manufacturer.upsert({
      where: { nameEn: mfr.nameEn },
      update: { nameRu: mfr.nameRu, country: mfr.country },
      create: { nameEn: mfr.nameEn, nameRu: mfr.nameRu, country: mfr.country },
    });

    for (const mdl of mfr.models) {
      await prisma.model.upsert({
        where: { manufacturerId_nameEn: { manufacturerId: manufacturer.id, nameEn: mdl.nameEn } },
        update: { nameRu: mdl.nameRu },
        create: { ...mdl, manufacturerId: manufacturer.id },
      });
      modelCount++;
    }
  }

  const allModels = await prisma.model.findMany({
    include: { manufacturer: true },
  });

  console.log(`  ✓ ${expanded.length} manufacturers, ${modelCount} models`);
  return allModels;
}

async function seedUsersAndDealers() {
  const admin = await prisma.user.upsert({
    where: { email: 'admin@autoshop.com' },
    update: {},
    create: {
      email: 'admin@autoshop.com',
      passwordHash: '$2b$10$placeholder_hash_replace_later',
      firstName: 'Admin',
      lastName: 'AutoShop',
      role: 'ADMIN',
      language: 'EN',
      isVerified: true,
    },
  });

  const privateUsers = [];
  for (let i = 0; i < PRIVATE_USER_COUNT; i++) {
    const user = await prisma.user.create({
      data: {
        email: `user${i + 1}@autoshop-demo.com`,
        passwordHash: '$2b$10$placeholder_hash_replace_later',
        firstName: pickRandom(firstNamesEn),
        lastName: pickRandom(lastNamesEn),
        phone: `+9955${String(randomInt(1000000, 9999999))}`,
        role: 'USER' as UserRole,
        language: i % 3 === 0 ? 'RU' : 'EN',
        isVerified: Math.random() > 0.3,
      },
    });
    privateUsers.push(user);
  }

  const dealerUsers = [];
  const dealers = [];
  for (let i = 0; i < DEALER_COUNT; i++) {
    const seed = dealersSeed[i];
    const user = await prisma.user.create({
      data: {
        email: `dealer${i + 1}@autoshop-demo.com`,
        passwordHash: '$2b$10$placeholder_hash_replace_later',
        firstName: 'Dealer',
        lastName: seed.en.split(' ')[0],
        phone: seed.phone.replace(/\s+/g, ''),
        role: 'DEALER' as UserRole,
        language: i % 2 === 0 ? 'EN' : 'RU',
        isVerified: true,
      },
    });

    const logoSeed = seed.logoSeed ?? `dealer-${i + 1}`;
    const dealer = await prisma.dealer.create({
      data: {
        userId: user.id,
        companyName: seed.en,
        companyNameRu: seed.ru,
        logo: `https://picsum.photos/seed/${logoSeed}/160/160`,
        descriptionEn: `Trusted ${seed.en} offering quality vehicles across Georgia.`,
        descriptionRu: `Надёжный ${seed.ru} с качественными автомобилями по всей Грузии.`,
        website: `https://dealer${i + 1}.autoshop-demo.ge`,
        address: seed.addressEn,
        addressRu: seed.addressRu,
        phone: seed.phone,
        dealerType: i % 4 === 0 ? 'INTERNATIONAL' : 'LOCAL',
        verified: Math.random() > 0.2,
      },
    });

    dealerUsers.push(user);
    dealers.push(dealer);
  }

  const allUsers = [admin, ...privateUsers, ...dealerUsers];
  console.log(`  ✓ ${allUsers.length} users (${PRIVATE_USER_COUNT} private, ${DEALER_COUNT} dealers, 1 admin)`);
  return { admin, privateUsers, dealerUsers, dealers, allUsers };
}

type SeedContext = {
  categories: Awaited<ReturnType<typeof seedReferenceData>>['categories'];
  bodyTypes: Awaited<ReturnType<typeof seedReferenceData>>['bodyTypes'];
  fuelTypes: Awaited<ReturnType<typeof seedReferenceData>>['fuelTypes'];
  transmissions: Awaited<ReturnType<typeof seedReferenceData>>['transmissions'];
  driveTypes: Awaited<ReturnType<typeof seedReferenceData>>['driveTypes'];
  colors: Awaited<ReturnType<typeof seedReferenceData>>['colors'];
  features: Awaited<ReturnType<typeof seedReferenceData>>['features'];
  stickers: Awaited<ReturnType<typeof seedReferenceData>>['stickers'];
  models: Awaited<ReturnType<typeof seedManufacturersAndModels>>;
  cities: { id: number }[];
  users: { id: number; role: UserRole }[];
};

function resolveCategoryId(
  model: SeedContext['models'][number],
  categories: SeedContext['categories'],
): number {
  const bySlug = (slug: (typeof ALLOWED_CATEGORY_SLUGS)[number]) =>
    categories.find((c) => c.slug === slug)?.id ?? categories[0].id;

  const brand = model.manufacturer.nameEn;

  if (motorcycleBrands.has(brand)) return bySlug('motorcycles');
  if (customVehicleBrands.has(brand)) return bySlug('custom-vehicles');
  if (Math.random() < 0.06) return bySlug('custom-vehicles');
  return bySlug('cars');
}

function buildListingData(ctx: SeedContext, index: number) {
  const model = pickRandom(ctx.models);
  const year = randomInt(2005, 2025);
  const categoryId = resolveCategoryId(model, ctx.categories);
  const user = pickRandom(ctx.users);
  const city = pickRandom(ctx.cities);
  const bodyType = pickRandom(ctx.bodyTypes);
  const fuelType = pickRandom(ctx.fuelTypes);
  const transmission = pickRandom(ctx.transmissions);
  const driveType = pickRandom(ctx.driveTypes);
  const color = pickRandom(ctx.colors);
  const mileage = randomInt(5000, 280000);
  const engineVolume = randomDecimal(1.0, 6.0);
  const enginePower = randomInt(75, 650);
  const doors = pickRandom([2, 3, 4, 5]);
  const seats = pickRandom([2, 4, 5, 7, 8]);
  const priceBase = randomInt(3500, 185000);
  const priceNegotiable = Math.random() < 0.25;
  const listingTypeRoll = Math.random();
  const listingType: ListingType =
    listingTypeRoll < 0.08 ? 'AUCTION' : listingTypeRoll < 0.12 ? 'RENT' : 'SALE';
  const currency: Currency = pickRandom(['USD', 'USD', 'USD', 'EUR', 'GEL']);
  const customsCleared = Math.random() > 0.35;
  const has360 = Math.random() < 0.08;
  const isVip = Math.random() < 0.05;
  const withVin = Math.random() < 0.7;
  const steeringWheel: SteeringWheel = Math.random() < 0.92 ? 'LEFT' : 'RIGHT';
  const status: ListingStatus = Math.random() < 0.97 ? 'ACTIVE' : pickRandom(['SOLD', 'MODERATION', 'DRAFT']);
  const createdAt = daysAgo(randomInt(0, 540));
  const featureIds = pickRandomMany(ctx.features, 4, 14).map((f) => f.id);
  const stickerIds = pickRandomMany(ctx.stickers, 0, 3).map((s) => s.id);
  const imageCount = randomInt(2, 6);
  const descIdx = index % listingDescriptionsEn.length;
  const interiorColor = pickRandom(interiorColors);
  const interiorMaterial = pickRandom(interiorMaterials);
  const isTurbo = Math.random() < 0.35;

  const titleEn = `${year} ${model.manufacturer.nameEn} ${model.nameEn}`;
  const titleRu = `${year} ${model.manufacturer.nameRu} ${model.nameRu}`;

  return {
    userId: user.id,
    modelId: model.id,
    categoryId,
    bodyTypeId: bodyType.id,
    fuelTypeId: fuelType.id,
    transmissionId: transmission.id,
    driveTypeId: driveType.id,
    colorId: color.id,
    cityId: city.id,
    listingType,
    status,
    year,
    price: priceBase,
    currency,
    priceNegotiable,
    mileage,
    mileageUnit: Math.random() < 0.95 ? ('KM' as const) : ('MI' as const),
    engineVolume,
    enginePower,
    cylinders: pickRandom([3, 4, 4, 4, 6, 8, 12]),
    doors,
    seats,
    vin: withVin ? randomVin() : null,
    plateNumber: Math.random() < 0.4 ? randomPlate() : null,
    customsCleared,
    isVip,
    has360,
    damaged: Math.random() < 0.04,
    steeringWheel,
    interiorColorEn: interiorColor.nameEn,
    interiorColorRu: interiorColor.nameRu,
    interiorMaterialEn: interiorMaterial.nameEn,
    interiorMaterialRu: interiorMaterial.nameRu,
    exchange: Math.random() < 0.2,
    techInspection: Math.random() < 0.75,
    catalyst: Math.random() < 0.85,
    thirdRowSeats: Math.random() < 0.15,
    airbags: pickRandom([4, 6, 8, 10, 12]),
    isTurbo,
    titleEn,
    titleRu,
    descriptionEn: listingDescriptionsEn[descIdx],
    descriptionRu: listingDescriptionsRu[descIdx],
    views: randomInt(0, 8500),
    createdAt,
    updatedAt: createdAt,
    featureIds,
    stickerIds,
    images: Array.from({ length: imageCount }, (_, imgIdx) => ({
      url: `https://picsum.photos/seed/autoshop-${index}-${imgIdx}/800/500`,
      position: imgIdx,
      is360: has360 && imgIdx === 0,
    })),
  };
}

async function seedListings(ctx: SeedContext) {
  console.log(`  Generating ${LISTING_COUNT} listings in batches of ${LISTING_BATCH_SIZE}...`);
  let created = 0;

  for (const batchIndexes of chunk(Array.from({ length: LISTING_COUNT }, (_, i) => i), LISTING_BATCH_SIZE)) {
    await prisma.$transaction(
      batchIndexes.map((index) => {
        const data = buildListingData(ctx, index);
        const { featureIds, stickerIds, images, ...listingFields } = data;
        return prisma.listing.create({
          data: {
            ...listingFields,
            images: { create: images },
            features: { create: featureIds.map((featureId) => ({ featureId })) },
            stickers: { create: stickerIds.map((stickerId) => ({ stickerId })) },
          },
        });
      }),
    );
    created += batchIndexes.length;
    if (created % 250 === 0 || created === LISTING_COUNT) {
      console.log(`    ... ${created}/${LISTING_COUNT} listings`);
    }
  }

  console.log(`  ✓ ${created} listings with images, features, and stickers`);
}

async function seedBlogPosts() {
  for (const post of blogPosts) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: {
        titleEn: post.titleEn,
        titleRu: post.titleRu,
        excerptEn: post.excerptEn,
        excerptRu: post.excerptRu,
        contentEn: post.contentEn.trim(),
        contentRu: post.contentRu.trim(),
        coverImage: `https://picsum.photos/seed/blog-${post.slug}/1200/630`,
        published: true,
      },
      create: {
        ...post,
        contentEn: post.contentEn.trim(),
        contentRu: post.contentRu.trim(),
        coverImage: `https://picsum.photos/seed/blog-${post.slug}/1200/630`,
        published: true,
        publishedAt: daysAgo(randomInt(1, 120)),
      },
    });
  }
  console.log(`  ✓ ${blogPosts.length} blog posts`);
}

async function seedAutoParts() {
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
  console.log(`  ✓ ${autoParts.length} auto parts`);
}

async function seedReviewsAndFavorites(
  dealers: { id: number }[],
  privateUsers: { id: number }[],
) {
  const listings = await prisma.listing.findMany({
    select: { id: true },
    take: 500,
    orderBy: { id: 'asc' },
  });

  let reviewCount = 0;
  for (const dealer of dealers) {
    const reviewers = pickRandomMany(privateUsers, 1, 4);
    for (const reviewer of reviewers) {
      try {
        await prisma.review.create({
          data: {
            userId: reviewer.id,
            dealerId: dealer.id,
            rating: randomInt(3, 5),
            comment: pickRandom([
              'Great service and fair prices.',
              'Professional team, smooth purchase.',
              'Wide selection, helpful staff.',
              'Отличный сервис и честные цены.',
              'Профессиональная команда.',
            ]),
            createdAt: daysAgo(randomInt(1, 300)),
          },
        });
        reviewCount++;
      } catch {
        // unique userId+dealerId
      }
    }
  }

  let favoriteCount = 0;
  for (let i = 0; i < 600; i++) {
    const user = pickRandom(privateUsers);
    const listing = pickRandom(listings);
    try {
      await prisma.favorite.create({
        data: { userId: user.id, listingId: listing.id },
      });
      favoriteCount++;
    } catch {
      // duplicate favorite
    }
  }

  console.log(`  ✓ ${reviewCount} reviews, ${favoriteCount} favorites`);
}

async function seedVinChecksAndInspections() {
  const vins = Array.from({ length: 200 }, () => randomVin());
  for (const vin of vins) {
    await prisma.vinCheck.create({
      data: {
        vin,
        result: {
          status: pickRandom(['clean', 'clean', 'clean', 'warning']),
          accidents: randomInt(0, 2),
          owners: randomInt(1, 4),
          country: pickRandom(['USA', 'Germany', 'Japan', 'Georgia']),
        },
        checkedAt: daysAgo(randomInt(0, 90)),
      },
    });
  }

  for (let i = 0; i < 150; i++) {
    const inspectionDate = daysAgo(randomInt(30, 400));
    const expiry = new Date(inspectionDate);
    expiry.setFullYear(expiry.getFullYear() + 1);
    await prisma.technicalInspection.create({
      data: {
        plateNumber: randomPlate(),
        inspectionDate,
        expiryDate: expiry,
        status: pickRandom(['VALID', 'VALID', 'DUE_SOON', 'EXPIRED']),
        checkedAt: daysAgo(randomInt(0, 30)),
      },
    });
  }

  console.log(`  ✓ ${vins.length} VIN checks, 150 technical inspections`);
}

async function seedAuctionBids(listings: { id: number }[], users: { id: number }[]) {
  const auctionListings = await prisma.listing.findMany({
    where: { listingType: 'AUCTION' },
    select: { id: true, price: true },
    take: 80,
  });

  let bidCount = 0;
  for (const listing of auctionListings) {
    const bids = randomInt(1, 6);
    let amount = Number(listing.price) * 0.85;
    for (let b = 0; b < bids; b++) {
      amount += randomInt(200, 2500);
      await prisma.auctionBid.create({
        data: {
          listingId: listing.id,
          userId: pickRandom(users).id,
          amount,
          createdAt: daysAgo(randomInt(0, 14)),
        },
      });
      bidCount++;
    }
  }
  console.log(`  ✓ ${bidCount} auction bids`);
}

async function main() {
  console.log('🌱 Seeding AutoShop database (large dataset)...\n');
  console.log(`   Target listings: ${LISTING_COUNT}\n`);

  await clearTransactionalData();

  console.log('Reference data:');
  const ref = await seedReferenceData();

  console.log('\nManufacturers & models:');
  const models = await seedManufacturersAndModels();

  console.log('\nUsers & dealers:');
  const { privateUsers, dealers, allUsers } = await seedUsersAndDealers();

  const cities = await prisma.city.findMany({ select: { id: true } });

  const ctx: SeedContext = {
    ...ref,
    models,
    cities,
    users: allUsers,
  };

  console.log('\nListings:');
  await seedListings(ctx);

  console.log('\nAdditional content:');
  await seedBlogPosts();
  await seedAutoParts();
  await seedReviewsAndFavorites(dealers, privateUsers);
  await seedVinChecksAndInspections();

  const listingSample = await prisma.listing.findMany({ select: { id: true }, take: 100 });
  await seedAuctionBids(listingSample, allUsers);

  const stats = await Promise.all([
    prisma.vehicleCategory.count(),
    prisma.manufacturer.count(),
    prisma.model.count(),
    prisma.listing.count(),
    prisma.user.count(),
    prisma.dealer.count(),
    prisma.city.count(),
    prisma.feature.count(),
    prisma.sticker.count(),
    prisma.autoPart.count(),
  ]);

  console.log('\n✅ Seed complete!\n');
  console.log('   Database totals:');
  console.log(`   • Categories:     ${stats[0]}`);
  console.log(`   • Manufacturers:  ${stats[1]}`);
  console.log(`   • Models:         ${stats[2]}`);
  console.log(`   • Listings:       ${stats[3]}`);
  console.log(`   • Users:          ${stats[4]}`);
  console.log(`   • Dealers:        ${stats[5]}`);
  console.log(`   • Cities:         ${stats[6]}`);
  console.log(`   • Features:       ${stats[7]}`);
  console.log(`   • Stickers:       ${stats[8]}`);
  console.log(`   • Auto parts:     ${stats[9]}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
