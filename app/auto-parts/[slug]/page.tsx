import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import AutoPartDetailPage from '@/components/AutoPartDetailPage';
import { getAutoPartBySlug, getRelatedAutoParts } from '@/lib/queries';

type AutoPartRouteProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: AutoPartRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const part = await getAutoPartBySlug(slug);

  if (!part) {
    return { title: 'Auto Part | AutoShop' };
  }

  return {
    title: `${part.nameEn} | AutoShop`,
    description: part.descriptionEn,
  };
}

export default async function AutoPartRoutePage({ params }: AutoPartRouteProps) {
  const { slug } = await params;
  const part = await getAutoPartBySlug(slug);

  if (!part) notFound();

  const related = await getRelatedAutoParts(part.categorySlug, part.slug);

  return (
    <div className="flex flex-1 flex-col bg-[#f3f5f8] px-4 py-6 sm:px-6 lg:px-8">
      <AutoPartDetailPage part={part} related={related} />
    </div>
  );
}
