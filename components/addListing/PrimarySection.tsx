import type { AddListingCopy, AddListingFieldsProps, FilterOption } from './types';
import SectionCard from './SectionCard';
import PrimaryIdentityFields from './PrimaryIdentityFields';
import PrimarySpecFields from './PrimarySpecFields';
import PrimaryAppearanceFields from './PrimaryAppearanceFields';
import styles from '../AddListingForm.module.css';

export default function PrimarySection({
  al,
  language,
  form,
  update,
  filters,
  modelsForManufacturer,
  descLang,
  setDescLang,
  toggleFeature,
  progress,
  isOpen,
  onToggle,
  sectionRef,
}: AddListingFieldsProps & {
  modelsForManufacturer: FilterOption[];
  descLang: 'en' | 'ru';
  setDescLang: (lang: 'en' | 'ru') => void;
  toggleFeature: (id: number) => void;
  progress: number;
  isOpen: boolean;
  onToggle: () => void;
  sectionRef: React.RefObject<HTMLElement | null>;
}) {
  const fieldProps = { al, language, form, update, filters };
  return (
    <SectionCard
      id="section-primary"
      title={al.steps.primary}
      icon={
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
      }
      progress={progress}
      total={10}
      isOpen={isOpen}
      onToggle={onToggle}>
      <div ref={sectionRef as React.RefObject<HTMLDivElement>} className={styles.formGrid}>
        <PrimaryIdentityFields {...fieldProps} modelsForManufacturer={modelsForManufacturer} />
        <PrimarySpecFields {...fieldProps} />
        <PrimaryAppearanceFields
          {...fieldProps}
          descLang={descLang}
          setDescLang={setDescLang}
          toggleFeature={toggleFeature}
        />
      </div>
    </SectionCard>
  );
}

export type { AddListingCopy };
