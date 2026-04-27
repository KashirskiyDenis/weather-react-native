import AsyncStorage from "@react-native-async-storage/async-storage";

export const saveWeatherCache = async (cityName, weather, forecast, icon) => {
  try {
    await AsyncStorage.multiSet([
      ["city", cityName],
      ["weather", JSON.stringify(weather)],
      ["forecast", JSON.stringify(forecast)],
      ["icon", icon],
    ]);
  } catch (error) {
    console.error("Ошибка сохранения кэша погоды:", error);
  }
};

export const loadWeatherCache = async () => {
  try {
    const values = await AsyncStorage.multiGet([
      "city",
      "weather",
      "forecast",
      "icon",
    ]);

    const city = values[0][1];
    const weather = values[1][1] ? JSON.parse(values[1][1]) : null;
    const forecast = values[2][1] ? JSON.parse(values[2][1]) : null;
    const icon = values[3][1];

    return { city, weather, forecast, icon };
  } catch (error) {
    console.error("Ошибка загрузки кэша:", error);
    return null;
  }
};
