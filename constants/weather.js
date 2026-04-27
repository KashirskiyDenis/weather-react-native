export const APP_ID = process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY;
export const BASE_URL = 'https://api.openweathermap.org/data/2.5/';
export const COMPASS_SECTORS = 16;
export const DEFAULT_CITY = 'Astrakhan';
export const DEG_PER_SECTOR = 360 / COMPASS_SECTORS;
export const HPA_TO_MMHG = 0.750062;
export const ICON_MAP = {
  '03d': '02d',
  '04d': '02d',
  '10d': '09d',
  '03n': '02n',
  '04n': '02n',
  '10n': '09n',
};
export const IMAGES = {
  i01d: require('../images/01d.jpg'),
  i01n: require('../images/01n.jpg'),
  i02d: require('../images/02d.jpg'),
  i02n: require('../images/02n.jpg'),
  i09d: require('../images/09d.jpg'),
  i09n: require('../images/09n.jpg'),
  i11d: require('../images/11d.jpg'),
  i11n: require('../images/11n.jpg'),
  i13d: require('../images/13d.jpg'),
  i13n: require('../images/13n.jpg'),
  i50d: require('../images/50d.jpg'),
  i50n: require('../images/50n.jpg'),
};
export const STYLES = ['default', 'dark-content', 'light-content'];
export const UNITS = 'metric';
export const WHITE_TEXT_ICON_CODES = [
  '01n',
  '50d',
  '50n',
  '11n',
  '13n',
  '02n',
  '09n',
  '09d',
  '10d',
];
export const WIND_DEG_TEXT = [
  'Северный',
  'ССВ',
  'Северо-восточный',
  'ВСВ',
  'Восточный',
  'ВЮВ',
  'Юго-восточный',
  'ЮЮВ',
  'Южный',
  'ЮЮЗ',
  'Юго-западный',
  'ЗЮЗ',
  'Западный',
  'ЗСЗ',
  'Северо-западный',
  'ССЗ',
];
