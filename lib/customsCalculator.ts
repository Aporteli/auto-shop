export type VehicleKind = 'car' | 'motorcycle';
export type FuelKind = 'petrol' | 'electric' | 'hybrid';
export type WheelSide = 'left' | 'right';
export type RegistrationKind = 'single' | 'double';
export type RateKind = 'current' | 'previous';

export type CustomsInput = {
  vehicle: VehicleKind;
  fuel: FuelKind;
  registration: RegistrationKind;
  issueYear: number;
  engineLiters: number;
  rate: RateKind;
};

export type CustomsLine = {
  key: 'excise' | 'customsService' | 'registration' | 'importTax' | 'expert' | 'declaration' | 'transit';
  amount: number;
};

export type CustomsResult = {
  age: number;
  cubicCapacity: number;
  lines: CustomsLine[];
  total: number;
};

const CURRENT_YEAR = new Date().getFullYear();

function roundMoney(value: number) {
  return Math.max(0, Math.round(value));
}

export function vehicleAge(issueYear: number, now = CURRENT_YEAR) {
  return Math.max(0, now - issueYear);
}

export function importTaxUsd(cubicCapacityCc: number, age: number, rate: RateKind) {
  const capacityRate = rate === 'current' ? 0.05 : 0.04;
  const ageRate = rate === 'current' ? 0.0025 : 0.002;
  return roundMoney(cubicCapacityCc * capacityRate + cubicCapacityCc * age * ageRate);
}

export function calculateCustoms(input: CustomsInput): CustomsResult {
  const age = vehicleAge(input.issueYear);
  const cubicCapacity = input.fuel === 'electric' ? 0 : Math.round(input.engineLiters * 1000);
  const motorcycle = input.vehicle === 'motorcycle';

  let importTax = importTaxUsd(cubicCapacity, age, input.rate);
  if (input.fuel === 'hybrid') importTax = roundMoney(importTax * 0.6);
  if (input.fuel === 'electric') importTax = 0;

  const excise = input.fuel === 'electric' ? 0 : input.fuel === 'hybrid' ? 100 : motorcycle ? 80 : 150;
  const customsService = 150;
  const registrationBase = motorcycle ? 150 : 200;
  const registration = input.registration === 'double' ? registrationBase * 2 : registrationBase;
  const expert = 30;
  const declaration = 50;
  const transit = 50;

  const lines: CustomsLine[] = [
    { key: 'excise', amount: excise },
    { key: 'customsService', amount: customsService },
    { key: 'registration', amount: registration },
    { key: 'importTax', amount: importTax },
    { key: 'expert', amount: expert },
    { key: 'declaration', amount: declaration },
    { key: 'transit', amount: transit },
  ];

  return {
    age,
    cubicCapacity,
    lines,
    total: lines.reduce((sum, line) => sum + line.amount, 0),
  };
}
