import type { AddListingCopy, FormUpdate } from './types';
import type { AddListingFormState } from '@/lib/addListing';
import OptimizedImage from '@/components/OptimizedImage';
import SectionCard from './SectionCard';
import styles from '../AddListingForm.module.css';

export default function MediaSection({
  al,
  form,
  update,
  isUploading,
  onUpload,
  progress,
  isOpen,
  onToggle,
  sectionRef,
}: {
  al: AddListingCopy;
  form: AddListingFormState;
  update: FormUpdate;
  isUploading: boolean;
  onUpload: (files: FileList | null) => void;
  progress: number;
  isOpen: boolean;
  onToggle: () => void;
  sectionRef: React.RefObject<HTMLElement | null>;
}) {
  return (
    <SectionCard
      id="section-media"
      title={al.steps.media}
      icon={
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      }
      progress={progress}
      total={1}
      isOpen={isOpen}
      onToggle={onToggle}>
      <div ref={sectionRef as React.RefObject<HTMLDivElement>}>
        <p className={styles.label}>
          {al.fields.photo} {form.imageUrls.length}/15 <span className={styles.required}>*</span>
        </p>
        <div className={styles.uploadZone}>
          <input
            type="file"
            accept="image/*"
            multiple
            disabled={isUploading || form.imageUrls.length >= 15}
            onChange={(e) => onUpload(e.target.files)}
          />
          <p className={styles.uploadTitle}>{isUploading ? al.uploading : al.uploadPhotos}</p>
          <p className={styles.uploadHint}>{al.maxVolume}</p>
        </div>
        {form.imageUrls.length > 0 ? (
          <div className={styles.photoGrid}>
            {form.imageUrls.map((url, index) => (
              <div key={url} className={styles.photoThumb}>
                <OptimizedImage src={url} alt="" width={160} height={120} sizes="120px" />
                <button
                  type="button"
                  className={styles.photoRemove}
                  onClick={() => update('imageUrls', form.imageUrls.filter((_, i) => i !== index))}>
                  ×
                </button>
              </div>
            ))}
          </div>
        ) : null}
        <div className={styles.field} style={{ marginTop: 20 }}>
          <label className={styles.label}>{al.fields.video}</label>
          <p className={styles.vinDesc}>{al.videoHint}</p>
          <input
            className={styles.input}
            placeholder={al.videoPlaceholder}
            value={form.videoUrl}
            onChange={(e) => update('videoUrl', e.target.value)}
          />
        </div>
      </div>
    </SectionCard>
  );
}
