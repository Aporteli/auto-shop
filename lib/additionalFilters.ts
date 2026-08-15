export type DoorsFilter = '2-3' | '4-5' | '5+' | '';
export type YesNoFilter = 'yes' | 'no' | '';
export type SteeringWheelFilter = 'LEFT' | 'RIGHT' | '';
export type ApplicantFilter = 'private' | 'dealer' | 'showroom' | '';

export type AdditionalFilterFields = {
  engineFrom: string;
  engineTo: string;
  mileageFrom: string;
  mileageTo: string;
  steeringWheel: SteeringWheelFilter;
  doors: DoorsFilter;
  thirdRowSeats: YesNoFilter;
  isNew: YesNoFilter;
  techInspection: YesNoFilter;
  catalyst: YesNoFilter;
  featureIds: number[];
  colorIds: number[];
  interiorMaterial: string;
  interiorColor: string;
  applicant: ApplicantFilter;
  publishedWithin: string;
  exchange: boolean;
  auction: boolean;
  withVideo: boolean;
  stickerIds: number[];
};

export const defaultAdditionalFilterFields = (): AdditionalFilterFields => ({
  engineFrom: '',
  engineTo: '',
  mileageFrom: '',
  mileageTo: '',
  steeringWheel: '',
  doors: '',
  thirdRowSeats: '',
  isNew: '',
  techInspection: '',
  catalyst: '',
  featureIds: [],
  colorIds: [],
  interiorMaterial: '',
  interiorColor: '',
  applicant: '',
  publishedWithin: '',
  exchange: false,
  auction: false,
  withVideo: false,
  stickerIds: [],
});

export const PRIMARY_COLOR_NAMES = ['White', 'Black', 'Silver', 'Grey', 'Red', 'Blue'] as const;

export const FEATURE_OPTION_KEYS = [
  'conditioner',
  'climateControl',
  'rims',
  'electricWindows',
  'rearViewCamera',
  'boardComputer',
  'seatHeater',
  'hydraulics',
  'turbo',
  'navigation',
  'parkingControl',
  'adaptedPsn',
  'startStop',
  'hatch',
  'cruiseControl',
  'multiSteeringWheel',
  'alarm',
] as const;

export const FEATURE_NAME_BY_KEY: Record<(typeof FEATURE_OPTION_KEYS)[number], string> = {
  conditioner: 'Air conditioning',
  climateControl: 'Climate control',
  rims: 'Rims',
  electricWindows: 'Electric side mirrors',
  rearViewCamera: 'Rear view camera',
  boardComputer: 'On-board computer',
  seatHeater: 'Heated seats',
  hydraulics: 'Steering hydraulics',
  turbo: 'Turbo engine',
  navigation: 'Central screen (navigation)',
  parkingControl: 'Parking control',
  adaptedPsn: 'Accessible for PWD',
  startStop: 'Start-stop system',
  hatch: 'Sunroof',
  cruiseControl: 'Cruise control',
  multiSteeringWheel: 'Multifunction steering wheel',
  alarm: 'Alarm system',
};
