export function pickRandom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

export function pickRandomMany<T>(items: T[], min: number, max: number): T[] {
  const count = min + Math.floor(Math.random() * (max - min + 1));
  const shuffled = [...items].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, items.length));
}

export function randomInt(min: number, max: number): number {
  return min + Math.floor(Math.random() * (max - min + 1));
}

export function randomDecimal(min: number, max: number, decimals = 1): number {
  const value = min + Math.random() * (max - min);
  return Number(value.toFixed(decimals));
}

export function randomVin(): string {
  const chars = 'ABCDEFGHJKLMNPRSTUVWXYZ0123456789';
  let vin = '';
  for (let i = 0; i < 17; i++) {
    vin += chars[Math.floor(Math.random() * chars.length)];
  }
  return vin;
}

export function randomPlate(): string {
  const letters = 'ABCDEFGHJKLMNPRSTUVWXYZ';
  const nums = () => String(randomInt(0, 9));
  return `${letters[randomInt(0, letters.length - 1)]}${letters[randomInt(0, letters.length - 1)]}${nums()}${nums()}${nums()}${letters[randomInt(0, letters.length - 1)]}${letters[randomInt(0, letters.length - 1)]}`;
}

export function daysAgo(days: number): Date {
  const date = new Date();
  date.setDate(date.getDate() - days);
  date.setHours(randomInt(0, 23), randomInt(0, 59), randomInt(0, 59));
  return date;
}

export function chunk<T>(items: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
}

export const firstNamesEn = [
  'Giorgi', 'Nino', 'David', 'Mariam', 'Luka', 'Ana', 'Irakli', 'Tamuna',
  'John', 'Emma', 'Michael', 'Sarah', 'James', 'Olivia', 'Robert', 'Sophia',
  'Hans', 'Anna', 'Pierre', 'Marie', 'Ivan', 'Elena', 'Ahmet', 'Ayse',
];

export const lastNamesEn = [
  'Beridze', 'Kapanadze', 'Gelashvili', 'Mchedlishvili', 'Smith', 'Johnson',
  'Brown', 'Mueller', 'Dubois', 'Rossi', 'Kowalski', 'Yilmaz', 'Kim', 'Tanaka',
];

export { dealerNames, dealersSeed } from './dealers';
export type { DealerSeed } from './dealers';

export const listingDescriptionsEn = [
  'Well-maintained vehicle with full service history. Ready to drive.',
  'Single owner, garage kept, non-smoker. Excellent condition inside and out.',
  'Recently serviced, new tires and brakes. Clean title, no accidents.',
  'Imported from Europe, customs cleared. All documents in order.',
  'Premium package with leather, navigation, and panoramic roof.',
  'Low mileage for year, ideal daily driver or family car.',
  'Sport trim with upgraded wheels and exhaust. Fun to drive.',
  'Dealer maintained, warranty available. Test drives welcome.',
  'Perfect for city driving with great fuel economy.',
  'Spacious interior, third row seating, towing package included.',
  'Accident-free, VIN verified, inspection report available.',
  'Fresh import, just cleared customs. Priced to sell quickly.',
  'Luxury features throughout. Must see in person.',
  'Commercial grade, fleet maintained, ready for work.',
  'Classic styling with modern safety features.',
];

export const listingDescriptionsRu = [
  'Ухоженный автомобиль с полной сервисной историей. Готов к поездкам.',
  'Один владелец, хранился в гараже. Отличное состояние.',
  'Недавно обслужен, новые шины и тормоза. Чистый титул.',
  'Импорт из Европы, растаможен. Все документы в порядке.',
  'Премиум комплектация с кожей, навигацией и панорамной крышей.',
  'Низкий пробег для года, идеален для семьи.',
  'Спортивная версия с улучшенными дисками. Приятен в управлении.',
  'Обслуживался у дилера, возможна гарантия.',
  'Отлично подходит для города, экономичный расход.',
  'Просторный салон, третий ряд сидений, фаркоп в комплекте.',
  'Без ДТП, VIN проверен, отчёт осмотра доступен.',
  'Свежий ввоз, только растаможен. Цена для быстрой продажи.',
  'Люксовая комплектация. Стоит посмотреть лично.',
  'Коммерческий класс, обслуживание автопарка.',
  'Классический стиль с современными системами безопасности.',
];
