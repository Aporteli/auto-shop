import AddListingForm from '@/components/AddListingForm';
import RequireAuth from '@/components/RequireAuth';

export default function AddListingPage() {
  return (
    <RequireAuth>
      <div className="flex flex-1 flex-col bg-[#f3f4f6]">
        <AddListingForm />
      </div>
    </RequireAuth>
  );
}
