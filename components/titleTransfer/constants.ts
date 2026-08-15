export const RESERVATION_FEE = 49;
export const CAR_FEE = 375;
export const MOTORCYCLE_FEE = 310;
export const BOOKING_PHONE = '+995 32 2 80 00 45';

export type VehicleType = 'car' | 'motorcycle';
export type Step = 1 | 2 | 3;

export type FormState = {
  vehicle: VehicleType;
  fullName: string;
  personalId: string;
  phone: string;
  date: string;
  time: string;
};

export function formatUsd(value: number) {
  return `$${value}`;
}

export function upcomingDates(locale: string, count = 8) {
  const dates: Array<{ value: string; label: string }> = [];
  const start = new Date();
  start.setHours(12, 0, 0, 0);
  for (let offset = 1; dates.length < count; offset += 1) {
    const date = new Date(start);
    date.setDate(start.getDate() + offset);
    dates.push({
      value: date.toISOString().slice(0, 10),
      label: date.toLocaleDateString(locale === 'ru' ? 'ru-RU' : 'en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      }),
    });
  }
  return dates;
}

export const TIME_SLOTS = ['10:00', '11:00', '12:00', '14:00', '15:00', '16:00'];
