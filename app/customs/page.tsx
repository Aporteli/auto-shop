import CustomsCalculatorPage from '@/components/CustomsCalculatorPage';

export const metadata = {
  title: 'Customs calculator | AutoShop',
  description: 'Estimate customs, import tax, and vehicle registration costs in US dollars.',
};

export default function CustomsRoutePage() {
  return (
    <div className="flex flex-1 flex-col bg-[#f3f5f8] px-4 py-8 sm:px-6 lg:px-8">
      <CustomsCalculatorPage />
    </div>
  );
}
