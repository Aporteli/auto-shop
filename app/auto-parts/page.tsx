import AutoPartsPage from '@/components/AutoPartsPage';
import { getAutoParts } from '@/lib/queries';

export const metadata = {
  title: 'Auto Parts | AutoShop',
  description:
    'Learn the main parts of a car: what they do, when to replace them, and how they are grouped by system.',
};

export default async function AutoPartsRoutePage() {
  const parts = await getAutoParts();

  return (
    <div className="flex flex-1 flex-col bg-[#f3f5f8] px-4 py-6 sm:px-6 lg:px-8">
      <AutoPartsPage parts={parts} />
    </div>
  );
}
