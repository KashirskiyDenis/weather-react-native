import { APP_ID, BASE_URL, UNITS } from "../constants/Weather";

export const buildUrl = (q = "", lat, lon, forecast = false) => {
  let str = forecast ? `${BASE_URL}forecast/daily?` : `${BASE_URL}weather?`;
  if (q !== "") {
    str += `appid=${APP_ID}&units=${UNITS}&lang=ru&q=${q}`;
  } else {
    str += `appid=${APP_ID}&units=${UNITS}&lang=ru&lat=${lat}&lon=${lon}`;
  }

  return str;
};

export const checkResponse = (response) => {
  if (response.status != 200) {
    const error = new Error();
    error.name = "NotFound";
    throw error;
  }
  return response.json();
};
