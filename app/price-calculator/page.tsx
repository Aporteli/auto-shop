import PriceCalculatorPage from '@/components/PriceCalculatorPage';

export const metadata = {
  title: 'Price calculator | AutoShop',
  description: 'Get a market price estimate from similar cars listed by users.',
};

export default function PriceCalculatorRoutePage() {
  return (
    <div className="flex flex-1 flex-col bg-[#f3f5f8] px-4 py-8 sm:px-6 lg:px-8">
      <PriceCalculatorPage />
    </div>
  );
}
