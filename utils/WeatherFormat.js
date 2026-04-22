import {
  COMPASS_SECTORS,
  DEG_PER_SECTOR,
  HPA_TO_MMHG,
  WIND_DEG_TEXT,
} from '../constants/Weather';

export const formatCityTime = (time, timezone) => {
  const offset = new Date().getTimezoneOffset() * 60;

  return new Date((time + offset + timezone) * 1000).toLocaleTimeString(
    undefined,
    { hour: '2-digit', minute: '2-digit' }
  );
};

export const formatCurrentWeather = (data, date) => {
  return {
    ...data,
    main: {
      ...data.main,
      pressure: Math.round(data.main.pressure * HPA_TO_MMHG),
    },
    sys: {
      ...data.sys,
      sunrise: formatCityTime(data.sys.sunrise, data.timezone),
      sunset: formatCityTime(data.sys.sunset, data.timezone),
    },
    dt: `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`,
    weather:
      data.weather[0].description[0].toUpperCase() +
      data.weather[0].description.substring(1),
    wind: {
      ...data.wind,
      deg: WIND_DEG_TEXT[
        Math.round(data.wind.deg / DEG_PER_SECTOR) % COMPASS_SECTORS
      ],
    },
  };
};

export const formatForecastWeather = (data) => {
  const options = {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  };
  const dataLength = data.list.length;
  const arrayForecast = [];
  for (let i = 0; i < dataLength; i++) {
    let forecast = { ...data.list[i] };
    let date = new Date(data.list[i].dt * 1000);
    forecast.date = `${date.toLocaleDateString(undefined, options)}`;
    forecast.tempMax = Math.round(data.list[i].temp.max);
    forecast.tempMin = Math.round(data.list[i].temp.min);
    forecast.tempNight = Math.round(data.list[i].temp.night);
    forecast.tempMorn = Math.round(data.list[i].temp.morn);
    forecast.tempDay = Math.round(data.list[i].temp.day);
    forecast.tempEve = Math.round(data.list[i].temp.eve);
    forecast.description =
      data.list[i].weather[0].description[0].toUpperCase() +
      data.list[i].weather[0].description.substring(1);
    forecast.pressure = Math.round(data.list[i].pressure * HPA_TO_MMHG);
    forecast.deg =
      WIND_DEG_TEXT[
        Math.round(data.list[i].deg / DEG_PER_SECTOR) % COMPASS_SECTORS
      ];
    forecast.rain = data.list[i]?.rain ?? 0;
    forecast.snow = data.list[i]?.snow ?? 0;

    arrayForecast.push(forecast);
  }
  return arrayForecast;
};
