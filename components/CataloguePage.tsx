'use client';

import CatalogueBrandsSection from './catalogue/CatalogueBrandsSection';
import CatalogueFilterGrid from './catalogue/CatalogueFilterGrid';
import { useCataloguePage } from './catalogue/useCataloguePage';
import styles from './CataloguePage.module.css';

export default function CataloguePage() {
  const {
    c,
    language,
    t,
    filters,
    setFilters,
    filterOptions,
    brands,
    resultCount,
    isCountLoading,
    showAllBrands,
    setShowAllBrands,
    showAllPopular,
    setShowAllPopular,
    activeLetter,
    setActiveLetter,
    label,
    modelsForManufacturer,
    locationOptions,
    yearOptions,
    engineOptions,
    visiblePopular,
    letters,
    visibleGroupedBrands,
    goToSearch,
    openBrand,
  } = useCataloguePage();

  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <p className={styles.kicker}>{c.kicker}</p>
        <h1 className={styles.title}>{c.title}</h1>
        <p className={styles.subtitle}>{c.subtitle}</p>
      </header>

      <CatalogueFilterGrid
        filters={filters}
        setFilters={setFilters}
        filterOptions={filterOptions}
        modelsForManufacturer={modelsForManufacturer}
        locationOptions={locationOptions}
        yearOptions={yearOptions}
        engineOptions={engineOptions}
        isCountLoading={isCountLoading}
        resultCount={resultCount}
        language={language}
        label={label}
        c={c}
        fromLabel={t.additionalFiltersModal.from}
        toLabel={t.additionalFiltersModal.to}
        clearLabel={t.searchDashboard.clearFilters}
        applyLabel={t.additionalFiltersModal.apply}
        onSearch={() => goToSearch()}
      />

      <CatalogueBrandsSection
        language={language}
        brands={brands}
        visiblePopular={visiblePopular}
        letters={letters}
        visibleGroupedBrands={visibleGroupedBrands}
        showAllPopular={showAllPopular}
        showAllBrands={showAllBrands}
        activeLetter={activeLetter}
        setShowAllPopular={setShowAllPopular}
        setShowAllBrands={setShowAllBrands}
        setActiveLetter={setActiveLetter}
        openBrand={openBrand}
        c={c}
      />
    </div>
  );
}
