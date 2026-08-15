import { Suspense } from 'react';
import SearchDashboard from '@/components/SearchDashboard';
import HomeCarSlider from '@/components/HomeCarSlider';
import ServicePromoCards from '@/components/ServicePromoCards';
import CategoryCards from '@/components/CategoryCards';
import StickerSlider from '@/components/StickerSlider';
import MarketplaceOverview from '@/components/MarketplaceOverview';
import BlogSection from '@/components/BlogSection';
import {
  getDealersByType,
  getFeaturedListings,
  getLatestListings,
  getBlogPosts,
  getStickerCounts,
  getVipListings,
} from '@/lib/queries';
import { serializeListingsForSlider } from '@/lib/listingSlider';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const [superVipListings, vipPlusListings, stickerCounts, recentListings, internationalDealers, localDealers, blogPosts] =
    await Promise.all([
      getVipListings(12),
      getFeaturedListings(12),
      getStickerCounts(),
      getLatestListings(5),
      getDealersByType('INTERNATIONAL', 6),
      getDealersByType('LOCAL', 6),
      getBlogPosts(3),
    ]);

  const superVipItems = serializeListingsForSlider(superVipListings);
  const vipPlusItems = serializeListingsForSlider(vipPlusListings);
  const recentItems = serializeListingsForSlider(recentListings);

  return (
    <div className="flex flex-1 flex-col bg-[#f5f5f5] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-[1400px]">
        <Suspense fallback={null}>
          <SearchDashboard />
        </Suspense>
        <HomeCarSlider variant="superVip" listings={superVipItems} />
        <ServicePromoCards />
        <HomeCarSlider variant="vipPlus" listings={vipPlusItems} />
        <CategoryCards />
        <StickerSlider stickers={stickerCounts} />
        <MarketplaceOverview
          recentListings={recentItems}
          internationalDealers={internationalDealers}
          localDealers={localDealers}
        />
        <BlogSection posts={blogPosts} />
      </div>
    </div>
  );
}
