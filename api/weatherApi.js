import { APP_ID, BASE_URL, UNITS } from "../constants/weather";

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
  if (!response.ok) {
    const error = new Error();
    if (response.status === 401) error.name = "Unauthorized";
    else if (response.status === 404) error.name = "NotFound";
    else error.name = "NetworkError";

    throw error;
  }

  return response.json();
};
