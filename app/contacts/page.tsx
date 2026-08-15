import ContactPage from '@/components/ContactPage';

export const metadata = {
  title: 'Contacts | AutoShop',
  description: 'Visit AutoShop in Tbilisi, call or email us, or send a message. Find us on the map.',
};

export default function ContactsRoutePage() {
  return (
    <div className="flex flex-1 flex-col bg-[#f3f5f8] px-4 py-8 sm:px-6 lg:px-8">
      <ContactPage />
    </div>
  );
}
