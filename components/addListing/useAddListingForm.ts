import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  buildListingPayload,
  defaultAddListingForm,
  type AddListingFormState,
} from '@/lib/addListing';
import { label } from './label';
import { countPrimaryProgress } from './progress';
import type { ApiFilters, SectionKey } from './types';

export function useAddListingForm() {
  const { t, language } = useLanguage();
  const router = useRouter();
  const al = t.addListing;

  const [filters, setFilters] = useState<ApiFilters | null>(null);
  const [form, setForm] = useState<AddListingFormState>(defaultAddListingForm);
  const [openSections, setOpenSections] = useState<Record<SectionKey, boolean>>({
    primary: true,
    location: true,
    media: true,
    price: true,
    contact: true,
  });
  const [descLang, setDescLang] = useState<'en' | 'ru'>('en');
  const [activeStep, setActiveStep] = useState<SectionKey>('primary');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');

  const primaryRef = useRef<HTMLElement>(null);
  const locationRef = useRef<HTMLElement>(null);
  const mediaRef = useRef<HTMLElement>(null);
  const priceRef = useRef<HTMLElement>(null);
  const contactRef = useRef<HTMLElement>(null);

  useEffect(() => {
    fetch('/api/filters')
      .then((res) => res.json())
      .then((data: ApiFilters) => {
        setFilters(data);
        const carsCategory = data.categories.find((c) => c.slug === 'cars');
        if (carsCategory) {
          setForm((prev) => ({ ...prev, categoryId: carsCategory.id }));
        }
      })
      .catch(() => setError(al.loadError))
      .finally(() => setIsLoading(false));
  }, [al.loadError]);

  const modelsForManufacturer = useMemo(() => {
    if (!filters || form.manufacturerId === '') return [];
    const manufacturer = filters.manufacturers.find((m) => m.id === form.manufacturerId);
    return manufacturer?.models ?? [];
  }, [filters, form.manufacturerId]);

  const cities = useMemo(() => filters?.countries.flatMap((c) => c.cities) ?? [], [filters]);

  const previewTitle = useMemo(() => {
    if (!filters || form.modelId === '') return '';
    const model = modelsForManufacturer.find((m) => m.id === form.modelId);
    if (!model || form.year === '') return '';
    const manufacturer = filters.manufacturers.find((m) => m.id === form.manufacturerId);
    const make = manufacturer ? label(manufacturer, language) : '';
    const trim = form.trim ? ` ${form.trim}` : '';
    return `${form.year} ${make} ${label(model, language)}${trim}`;
  }, [filters, form, language, modelsForManufacturer]);

  const primaryProgress = useMemo(() => countPrimaryProgress(form), [form]);

  const locationProgress = form.cityId ? 1 : 0;
  const mediaProgress = form.imageUrls.length > 0 ? 1 : 0;
  const priceProgress = form.price ? 1 : 0;
  const contactProgress = (form.contactName ? 1 : 0) + (form.contactPhone ? 1 : 0);

  function update<K extends keyof AddListingFormState>(key: K, value: AddListingFormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function toggleSection(key: SectionKey) {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function scrollToStep(step: SectionKey) {
    setActiveStep(step);
    const map: Record<SectionKey, React.RefObject<HTMLElement | null>> = {
      primary: primaryRef,
      location: locationRef,
      media: mediaRef,
      price: priceRef,
      contact: contactRef,
    };
    map[step].current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function toggleFeature(id: number) {
    setForm((prev) => ({
      ...prev,
      featureIds: prev.featureIds.includes(id)
        ? prev.featureIds.filter((f) => f !== id)
        : [...prev.featureIds, id],
    }));
  }

  function toggleSticker(id: number) {
    setForm((prev) => {
      if (prev.stickerIds.includes(id)) {
        return { ...prev, stickerIds: prev.stickerIds.filter((s) => s !== id) };
      }
      if (prev.stickerIds.length >= 3) return prev;
      return { ...prev, stickerIds: [...prev.stickerIds, id] };
    });
  }

  async function handlePhotoUpload(fileList: FileList | null) {
    if (!fileList?.length) return;
    setIsUploading(true);
    setError('');
    try {
      const formData = new FormData();
      Array.from(fileList).forEach((file) => formData.append('files', file));
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || al.uploadError);
      update('imageUrls', [...form.imageUrls, ...(data.urls as string[])].slice(0, 15));
    } catch (err) {
      setError(err instanceof Error ? err.message : al.uploadError);
    } finally {
      setIsUploading(false);
    }
  }

  async function submitListing(status: 'ACTIVE' | 'DRAFT') {
    setIsSubmitting(true);
    setError('');
    try {
      const payload = buildListingPayload(form, status);
      const res = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || al.submitError);
      router.push(`/listings/${data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : al.submitError);
    } finally {
      setIsSubmitting(false);
    }
  }

  const steps: { key: SectionKey; label: string; done: boolean }[] = [
    { key: 'primary', label: al.steps.primary, done: primaryProgress >= 5 },
    { key: 'location', label: al.steps.location, done: locationProgress > 0 },
    { key: 'media', label: al.steps.media, done: mediaProgress > 0 },
    { key: 'price', label: al.steps.price, done: priceProgress > 0 },
    { key: 'contact', label: al.steps.contact, done: contactProgress >= 2 },
  ];

  return {
    al,
    language,
    filters,
    form,
    update,
    openSections,
    toggleSection,
    descLang,
    setDescLang,
    activeStep,
    isLoading,
    isSubmitting,
    isUploading,
    error,
    primaryRef,
    locationRef,
    mediaRef,
    priceRef,
    contactRef,
    modelsForManufacturer,
    cities,
    previewTitle,
    primaryProgress,
    locationProgress,
    mediaProgress,
    priceProgress,
    contactProgress,
    steps,
    scrollToStep,
    toggleFeature,
    toggleSticker,
    handlePhotoUpload,
    submitListing,
  };
}
