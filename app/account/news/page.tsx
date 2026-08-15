import RequireAuth from '@/components/RequireAuth';
import AccountNewsPage from '@/components/AccountNewsPage';
import { getBlogPosts } from '@/lib/queries';

export default async function NewsPage() {
  const posts = await getBlogPosts();

  return (
    <RequireAuth>
      <AccountNewsPage posts={posts} />
    </RequireAuth>
  );
}
