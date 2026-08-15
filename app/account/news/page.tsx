import RequireAuth from '@/components/RequireAuth';
import AccountNewsPage from '@/components/AccountNewsPage';
import { getBlogPosts } from '@/lib/queries';

export const dynamic = 'force-dynamic';
export const dynamicParams = true;
export const revalidate = 0;

export default async function NewsPage() {
  let posts: any[] = [];

  try {
    const fetchedPosts = await getBlogPosts();
    if (Array.isArray(fetchedPosts)) {
      posts = fetchedPosts;
    }
  } catch (error) {
    console.error('Error fetching blog posts in NewsPage:', error);
    posts = [];
  }

  return (
    <RequireAuth>
      <AccountNewsPage posts={posts} />
    </RequireAuth>
  );
}