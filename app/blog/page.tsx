import BlogListPage from '@/components/BlogListPage';
import { getBlogPosts } from '@/lib/queries';

export default async function BlogRoutePage() {
  const posts = await getBlogPosts();

  return (
    <div className="flex flex-1 flex-col bg-[#f5f5f5] px-4 py-6 sm:px-6 lg:px-8">
      <BlogListPage posts={posts} />
    </div>
  );
}
