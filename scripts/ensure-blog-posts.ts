import { prisma } from '../lib/prisma';
import { blogPosts } from '../prisma/seed-data/blog-posts';

async function main() {
  const slugs = blogPosts.map((post) => post.slug);

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
        publishedAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000),
      },
    });
  }

  await prisma.blogPost.updateMany({
    where: { slug: { notIn: slugs } },
    data: { published: false },
  });

  const total = await prisma.blogPost.count({ where: { published: true } });
  console.log(`upserted ${blogPosts.length} posts, total published=${total}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
