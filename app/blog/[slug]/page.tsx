import { notFound } from 'next/navigation';
import BlogPostPage from '@/components/BlogPostPage';
import { getBlogPostBySlug } from '@/lib/queries';

type BlogPostRouteProps = {
  params: Promise<{ slug: string }>;
};

export default async function BlogPostRoutePage({ params }: BlogPostRouteProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) notFound();

  return (
    <div className="flex flex-1 flex-col bg-[#f5f5f5] px-4 py-6 sm:px-6 lg:px-8">
      <BlogPostPage post={post} />
    </div>
  );
}
