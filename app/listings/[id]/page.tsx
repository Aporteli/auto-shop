import ListingDetail from '@/components/ListingDetail';

type ListingPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ListingPage({ params }: ListingPageProps) {
  const { id } = await params;
  const listingId = Number(id);

  if (!Number.isFinite(listingId)) {
    return (
      <div className="flex flex-1 items-center justify-center px-4 py-12 text-[#6b7280]">
        Invalid listing id
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col bg-[#f5f5f5]">
      <ListingDetail listingId={listingId} />
    </div>
  );
}
