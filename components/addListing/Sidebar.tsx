import type { AddListingCopy, SectionKey } from './types';
import OptimizedImage from '@/components/OptimizedImage';
import styles from '../AddListingForm.module.css';

type Step = { key: SectionKey; label: string; done: boolean };

export default function AddListingSidebar({
  al,
  steps,
  activeStep,
  previewTitle,
  previewImage,
  onScrollToStep,
}: {
  al: AddListingCopy;
  steps: Step[];
  activeStep: SectionKey;
  previewTitle: string;
  previewImage: string | undefined;
  onScrollToStep: (step: SectionKey) => void;
}) {
  return (
    <aside className={styles.sidebar}>
      <button type="button" className={styles.savedBtn}>
        {al.savedListings}
      </button>

      <div className={styles.stepperCard}>
        <div className={styles.stepper}>
          {steps.map((step, index) => (
            <div key={step.key}>
              <button type="button" className={styles.stepItem} onClick={() => onScrollToStep(step.key)}>
                <div className={styles.stepIndicator}>
                  <span
                    className={`${styles.stepCircle} ${
                      activeStep === step.key ? styles.stepCircleActive : ''
                    } ${step.done ? styles.stepCircleDone : ''}`}>
                    {step.done ? (
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : null}
                  </span>
                  {index < steps.length - 1 ? <span className={styles.stepLine} /> : null}
                </div>
                <span className={`${styles.stepLabel} ${activeStep === step.key ? styles.stepLabelActive : ''}`}>
                  {step.label}
                </span>
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.previewCard}>
        <div className={styles.previewImage}>
          {previewImage ? (
            <OptimizedImage src={previewImage} alt="" width={280} height={160} sizes="240px" />
          ) : (
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9ca3af">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10m10 0H4m10 0h2a1 1 0 001-1v-3.5a1 1 0 00-.3-.7l-2.2-2.2A1 1 0 0014.4 9H13"
              />
            </svg>
          )}
        </div>
        <div className={styles.previewSkeleton}>
          {previewTitle ? (
            <p style={{ fontSize: 13, fontWeight: 600, color: '#374151', margin: 0 }}>{previewTitle}</p>
          ) : (
            <>
              <span />
              <span />
            </>
          )}
        </div>
        <div className={styles.previewSpecs}>
          {['engine', 'km', 'transmission', 'wheel'].map((spec) => (
            <div key={spec} className={styles.previewSpecRow}>
              <span>{spec === 'km' ? 'Km' : '•'}</span>
              <span className={styles.previewSpecBar} />
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
