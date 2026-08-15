import type { Bilingual } from './reference';

export const specificationFeatures: Array<Bilingual & { groupEn: string; groupRu: string }> = [
  // Comfort
  { nameEn: 'Steering hydraulics', nameRu: 'Гидроусилитель руля', groupEn: 'Comfort', groupRu: 'Комфорт' },
  { nameEn: 'On-board computer', nameRu: 'Бортовой компьютер', groupEn: 'Comfort', groupRu: 'Комфорт' },
  { nameEn: 'Air conditioning', nameRu: 'Кондиционер', groupEn: 'Comfort', groupRu: 'Комфорт' },
  { nameEn: 'Parking control', nameRu: 'Парковочный контроль', groupEn: 'Comfort', groupRu: 'Комфорт' },
  { nameEn: 'Rear view camera', nameRu: 'Камера заднего вида', groupEn: 'Comfort', groupRu: 'Комфорт' },
  { nameEn: 'Electric side mirrors', nameRu: 'Электрозеркала', groupEn: 'Comfort', groupRu: 'Комфорт' },
  { nameEn: 'Climate control', nameRu: 'Климат-контроль', groupEn: 'Comfort', groupRu: 'Комфорт' },
  { nameEn: 'Cruise control', nameRu: 'Круиз-контроль', groupEn: 'Comfort', groupRu: 'Комфорт' },
  { nameEn: 'Start-stop system', nameRu: 'Система Start-stop', groupEn: 'Comfort', groupRu: 'Комфорт' },
  // Interior
  { nameEn: 'Sunroof', nameRu: 'Люк', groupEn: 'Interior', groupRu: 'Интерьер' },
  { nameEn: 'Heated seats', nameRu: 'Подогрев сидений', groupEn: 'Interior', groupRu: 'Интерьер' },
  { nameEn: 'Memory seats', nameRu: 'Память сидений', groupEn: 'Interior', groupRu: 'Интерьер' },
  // Safety
  { nameEn: 'ABS', nameRu: 'ABS', groupEn: 'Safety', groupRu: 'Безопасность' },
  { nameEn: 'ESP', nameRu: 'ESP', groupEn: 'Safety', groupRu: 'Безопасность' },
  { nameEn: 'Central locking', nameRu: 'Центральный замок', groupEn: 'Safety', groupRu: 'Безопасность' },
  { nameEn: 'Alarm system', nameRu: 'Сигнализация', groupEn: 'Safety', groupRu: 'Безопасность' },
  { nameEn: 'Fog lamp', nameRu: 'Противотуманные фары', groupEn: 'Safety', groupRu: 'Безопасность' },
  // Multimedia
  { nameEn: 'Central screen (navigation)', nameRu: 'Центральный экран (навигация)', groupEn: 'Multimedia', groupRu: 'Мультимедиа' },
  { nameEn: 'AUX', nameRu: 'AUX', groupEn: 'Multimedia', groupRu: 'Мультимедиа' },
  { nameEn: 'Bluetooth', nameRu: 'Bluetooth', groupEn: 'Multimedia', groupRu: 'Мультимедиа' },
  { nameEn: 'Multifunction steering wheel', nameRu: 'Мультируль', groupEn: 'Multimedia', groupRu: 'Мультимедиа' },
  // Other
  { nameEn: 'Rims', nameRu: 'Диски', groupEn: 'Other', groupRu: 'Прочее' },
  { nameEn: 'Spare tyre', nameRu: 'Запасное колесо', groupEn: 'Other', groupRu: 'Прочее' },
  { nameEn: 'Accessible for PWD', nameRu: 'Адаптирован для людей с ОВЗ', groupEn: 'Other', groupRu: 'Прочее' },
];

export const legacyFeatures: Array<Bilingual & { groupEn: string; groupRu: string }> = [
  { nameEn: 'Parking sensors', nameRu: 'Парктроник', groupEn: 'Comfort', groupRu: 'Комфорт' },
  { nameEn: 'Panoramic roof', nameRu: 'Панорамная крыша', groupEn: 'Interior', groupRu: 'Интерьер' },
  { nameEn: 'Apple CarPlay', nameRu: 'Apple CarPlay', groupEn: 'Multimedia', groupRu: 'Мультимедиа' },
  { nameEn: 'Android Auto', nameRu: 'Android Auto', groupEn: 'Multimedia', groupRu: 'Мультимедиа' },
  { nameEn: 'Alloy wheels', nameRu: 'Литые диски', groupEn: 'Other', groupRu: 'Прочее' },
];

export const features = [...specificationFeatures, ...legacyFeatures];

export const interiorColors = [
  { nameEn: 'Black', nameRu: 'Чёрный' },
  { nameEn: 'White', nameRu: 'Белый' },
  { nameEn: 'Grey', nameRu: 'Серый' },
  { nameEn: 'Brown', nameRu: 'Коричневый' },
  { nameEn: 'Beige', nameRu: 'Бежевый' },
  { nameEn: 'Red', nameRu: 'Красный' },
];

export const interiorMaterials = [
  { nameEn: 'Fabric', nameRu: 'Ткань' },
  { nameEn: 'Leather', nameRu: 'Кожа' },
  { nameEn: 'Artificial leather', nameRu: 'Искусственная кожа' },
  { nameEn: 'Combined', nameRu: 'Комбинированный' },
  { nameEn: 'Alcantara', nameRu: 'Алькантара' },
];

export const stickers: Array<Bilingual & { color: string; icon: string }> = [
  { nameEn: 'Urgently', nameRu: 'Срочно', color: '#ff5d5d', icon: 'alert' },
  { nameEn: 'Perfect condition', nameRu: 'Идеальное состояние', color: '#14b8ff', icon: 'sparkle' },
  { nameEn: 'Undamaged', nameRu: 'Без повреждений', color: '#31d18a', icon: 'car' },
  { nameEn: 'Clean History', nameRu: 'Чистая история', color: '#10b8f8', icon: 'history' },
  { nameEn: 'From USA', nameRu: 'Из США', color: '#1b8fff', icon: 'usa' },
  { nameEn: 'From Europe', nameRu: 'Из Европы', color: '#6366f1', icon: 'europe' },
  { nameEn: 'Newly Imported', nameRu: 'Новый ввоз', color: '#8b5cf6', icon: 'import' },
  { nameEn: 'Unpainted', nameRu: 'Без окраса', color: '#22c55e', icon: 'paint' },
  { nameEn: 'Center Car', nameRu: 'Center Car', color: '#4d56df', icon: 'center' },
  { nameEn: 'Low Consumption', nameRu: 'Низкий расход', color: '#129060', icon: 'eco' },
  { nameEn: 'Warranty', nameRu: 'Гарантия', color: '#0ea5e9', icon: 'shield' },
  { nameEn: 'One Owner', nameRu: 'Один владелец', color: '#64748b', icon: 'user' },
  { nameEn: 'Full Service', nameRu: 'Полное ТО', color: '#0891b2', icon: 'service' },
  { nameEn: 'Trade-in OK', nameRu: 'Обмен возможен', color: '#f59e0b', icon: 'swap' },
  { nameEn: 'Dealer Certified', nameRu: 'Сертификат дилера', color: '#7c3aed', icon: 'cert' },
  { nameEn: 'Price Reduced', nameRu: 'Снижена цена', color: '#ef4444', icon: 'price' },
  { nameEn: 'Hot Deal', nameRu: 'Горячее предложение', color: '#dc2626', icon: 'fire' },
  { nameEn: 'Premium Package', nameRu: 'Премиум пакет', color: '#a855f7', icon: 'star' },
  { nameEn: 'Winter Ready', nameRu: 'Зимняя комплектация', color: '#0284c7', icon: 'snow' },
  { nameEn: 'Summer Ready', nameRu: 'Летняя комплектация', color: '#eab308', icon: 'sun' },
  { nameEn: 'Fleet Vehicle', nameRu: 'Корпоративный', color: '#475569', icon: 'fleet' },
  { nameEn: 'Demo Car', nameRu: 'Демо авто', color: '#06b6d4', icon: 'demo' },
  { nameEn: 'Leasing Available', nameRu: 'Лизинг доступен', color: '#2563eb', icon: 'lease' },
  { nameEn: 'Credit Available', nameRu: 'Кредит доступен', color: '#059669', icon: 'credit' },
];
