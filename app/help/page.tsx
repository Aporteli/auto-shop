import HelpPage from '@/components/HelpPage';

export const metadata = {
  title: 'Help Center | AutoShop',
  description: 'Find answers about buying, selling, listings, customs, title transfer, and AutoShop services.',
};

export default function HelpRoutePage() {
  return (
    <div className="flex flex-1 flex-col bg-[#f3f5f8] px-4 py-8 sm:px-6 lg:px-8">
      <HelpPage />
    </div>
  );
}
