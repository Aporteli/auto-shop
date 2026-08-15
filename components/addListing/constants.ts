export const ENGINE_VOLUMES = [
  '0.8',
  '1.0',
  '1.2',
  '1.4',
  '1.5',
  '1.6',
  '1.8',
  '2.0',
  '2.2',
  '2.4',
  '2.5',
  '2.7',
  '3.0',
  '3.5',
  '4.0',
  '4.4',
  '5.0',
  '6.0',
];

export const CYLINDER_OPTIONS = [3, 4, 5, 6, 8, 10, 12];
export const CURRENT_YEAR = new Date().getFullYear();
export const YEARS = Array.from({ length: CURRENT_YEAR - 1989 }, (_, i) => CURRENT_YEAR - i);
export const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);
