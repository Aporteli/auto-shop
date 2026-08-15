'use client';

import styles from './AddListingForm.module.css';
import { useAddListingForm } from './addListing/useAddListingForm';
import AddListingSidebar from './addListing/Sidebar';
import AddListingTopBar from './addListing/TopBar';
import AddListingVinCard from './addListing/VinCard';
import PrimarySection from './addListing/PrimarySection';
import LocationSection from './addListing/LocationSection';
import MediaSection from './addListing/MediaSection';
import PriceSection from './addListing/PriceSection';
import ContactSection from './addListing/ContactSection';

export default function AddListingForm() {
  const listing = useAddListingForm();

  if (listing.isLoading) {
    return <div className={styles.loading}>{listing.al.loading}</div>;
  }

  if (!listing.filters) {
    return <div className={styles.loading}>{listing.al.loadError}</div>;
  }

  const fieldProps = {
    al: listing.al,
    language: listing.language,
    form: listing.form,
    update: listing.update,
    filters: listing.filters,
  };

  return (
    <div className={styles.page}>
      {listing.error ? <div className={styles.errorBanner}>{listing.error}</div> : null}

      <div className={styles.layout}>
        <AddListingSidebar
          al={listing.al}
          steps={listing.steps}
          activeStep={listing.activeStep}
          previewTitle={listing.previewTitle}
          previewImage={listing.form.imageUrls[0]}
          onScrollToStep={listing.scrollToStep}
        />

        <div className={styles.main}>
          <AddListingTopBar {...fieldProps} />
          <AddListingVinCard al={listing.al} vin={listing.form.vin} update={listing.update} />

          <PrimarySection
            {...fieldProps}
            modelsForManufacturer={listing.modelsForManufacturer}
            descLang={listing.descLang}
            setDescLang={listing.setDescLang}
            toggleFeature={listing.toggleFeature}
            progress={listing.primaryProgress}
            isOpen={listing.openSections.primary}
            onToggle={() => listing.toggleSection('primary')}
            sectionRef={listing.primaryRef}
          />
          <LocationSection
            al={listing.al}
            language={listing.language}
            form={listing.form}
            update={listing.update}
            cities={listing.cities}
            progress={listing.locationProgress}
            isOpen={listing.openSections.location}
            onToggle={() => listing.toggleSection('location')}
            sectionRef={listing.locationRef}
          /> 
          <MediaSection
            al={listing.al}
            form={listing.form}
            update={listing.update}
            isUploading={listing.isUploading}
            onUpload={listing.handlePhotoUpload}
            progress={listing.mediaProgress}
            isOpen={listing.openSections.media}
            onToggle={() => listing.toggleSection('media')}
            sectionRef={listing.mediaRef}
          />
          <PriceSection
            al={listing.al}
            form={listing.form}
            update={listing.update}
            progress={listing.priceProgress}
            isOpen={listing.openSections.price}
            onToggle={() => listing.toggleSection('price')}
            sectionRef={listing.priceRef}
          />
          <ContactSection
            {...fieldProps}
            toggleSticker={listing.toggleSticker}
            progress={listing.contactProgress}
            isOpen={listing.openSections.contact}
            onToggle={() => listing.toggleSection('contact')}
            sectionRef={listing.contactRef}
          />

          <div className={styles.footer}>
            <button
              type="button"
              className={styles.saveBtn}
              disabled={listing.isSubmitting}
              onClick={() => listing.submitListing('DRAFT')}>
              <span>{listing.al.save}</span>
              <span className={styles.saveHint}>{listing.al.saveHint}</span>
            </button>
            <button
              type="button"
              className={styles.publishBtn}
              disabled={listing.isSubmitting}
              onClick={() => listing.submitListing('ACTIVE')}>
              {listing.isSubmitting ? listing.al.submitting : listing.al.publish}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
