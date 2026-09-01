import { useCallback, useState, useEffect, useRef } from "react";
import {
  Alert,
  ImageBackground,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import * as Location from "expo-location";
import PromptModal from "./components/PromptModal";
import ForecastModal from "./components/ForecastModal";
import WeatherText from "./components/WeatherText";
import {
  DEFAULT_CITY,
  ICON_MAP,
  IMAGES,
  STYLES,
  WHITE_TEXT_ICON_CODES,
} from "./constants/weather";
import {
  formatCurrentWeather,
  formatForecastWeather,
} from "./utils/weatherFormat";
import { buildUrl, checkResponse } from "./api/weatherApi";
import { saveWeatherCache, loadWeatherCache } from "./utils/weatherCache";

const Weather = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [city, setCity] = useState(DEFAULT_CITY);
  const [weather, setWeather] = useState({});
  const [forecast, setForecast] = useState([]);
  const [promptModalVisible, setPromptModalVisible] = useState(false);
  const [forecastModalVisible, setForecastModalVisible] = useState(false);
  const [forecastModalData, setForecastModalData] = useState(null);
  const [text, setText] = useState("");
  const [bgImage, setBgImage] = useState(null);
  const [isLight, setIsLight] = useState(true);
  const controllerRef = useRef(null);
  const isMountedRef = useRef(true);
  const [statusBarStyle, setStatusBarStyle] = useState(STYLES[0]);

  const changeCityName = () => {
    if (Platform.OS === "ios") {
      Alert.prompt("Изменить локацию", "Введите название города", [
        {
          text: "Отмена",
          style: "cancel",
        },
        {
          text: "ОК",
          onPress: (text) => {
            if (text.trim().length === 0) {
              return;
            }
            updateWeather(text.trim());
          },
        },
      ]);
    } else {
      setText("");
      setPromptModalVisible(true);
    }
  };

  const changeCityLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Ошибка", "Нет доступа к геолокации.", [{ text: "OK" }]);
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      updateWeather("", location.coords.latitude, location.coords.longitude);
    } catch (error) {
      Alert.alert("Ошибка", "Не удалось получить геолокацию.", [
        { text: "OK" },
      ]);
      return;
    }
  };

  const changeCity = () => {
    if (text.trim().length === 0) {
      return;
    }
    setPromptModalVisible(false);
    updateWeather(text.trim());
  };

  const updateWeather = useCallback(async (newCity, lat, lon) => {
    controllerRef.current?.abort();

    const controller = new AbortController();
    controllerRef.current = controller;
    let isTimeout = false;

    const timeoutId = setTimeout(() => {
      isTimeout = true;
      controller.abort();
    }, 15000);

    if (isMountedRef.current) setRefreshing(true);

    const currentUrl = buildUrl(newCity, lat, lon);
    const forecastUrl = buildUrl(newCity, lat, lon, true);

    try {
      const [currentData, forecastData] = await Promise.all([
        fetch(currentUrl, { signal: controller.signal }).then(checkResponse),
        fetch(forecastUrl, { signal: controller.signal }).then(checkResponse),
      ]);

      const date = new Date(currentData.dt * 1000);
      const icon =
        ICON_MAP[currentData.weather[0].icon] || currentData.weather[0].icon;
      const currentWeather = formatCurrentWeather(currentData, date);
      const forecastWeather = formatForecastWeather(forecastData);

      currentWeather.main.temp_min =
        forecastWeather[0]?.tempMin ?? currentWeather.main.temp_min;
      currentWeather.main.temp_max =
        forecastWeather[0]?.tempMax ?? currentWeather.main.temp_max;

      saveWeatherCache(currentData.name, currentWeather, forecastWeather, icon);

      if (!isMountedRef.current) return;

      setCity(currentData.name);
      setIsLight(!WHITE_TEXT_ICON_CODES.includes(icon));
      setStatusBarStyle(
        WHITE_TEXT_ICON_CODES.includes(icon) ? STYLES[2] : STYLES[1],
      );
      setBgImage(IMAGES["i" + icon]);
      setWeather(currentWeather);
      setForecast(forecastWeather);
    } catch (error) {
      if (error.name === "AbortError") {
        if (isTimeout) {
          Alert.alert(
            "Ошибка",
            "Ошибка сети, проверьте доступ к сайту openweathermap.org",
            [{ text: "OK" }],
          );
        }
      } else if (error.name === "Unauthorized") {
        Alert.alert("Ошибка", "Ключ доступа не найден", [{ text: "OK" }]);
      } else if (error.name === "NotFound") {
        Alert.alert("Ошибка", "Город не найден.", [{ text: "OK" }]);
      } else {
        Alert.alert(
          "Ошибка",
          "Ошибка сети, проверьте подключение с сети Интернет.",
          [{ text: "OK" }],
        );
      }
    } finally {
      clearTimeout(timeoutId);
      if (isMountedRef.current) {
        setRefreshing(false);
      }
    }
  }, []);

  useEffect(() => {
    isMountedRef.current = true;

    const loadAndFetch = async () => {
      if (!isMountedRef.current) return;

      const saved = await loadWeatherCache();
      const {
        city: savedCity = null,
        weather: savedWeather = null,
        forecast: savedForecast = null,
        icon: savedIcon = null,
      } = saved || {};

      if (savedCity && savedWeather && savedForecast && savedIcon) {
        setCity(savedCity);
        setWeather(savedWeather);
        setForecast(savedForecast);

        setIsLight(!WHITE_TEXT_ICON_CODES.includes(savedIcon));
        setStatusBarStyle(
          WHITE_TEXT_ICON_CODES.includes(savedIcon) ? STYLES[2] : STYLES[1],
        );
        setBgImage(IMAGES["i" + savedIcon]);
      }

      updateWeather(savedCity ?? DEFAULT_CITY);
    };

    loadAndFetch();

    return () => {
      isMountedRef.current = false;
      controllerRef.current?.abort();
    };
  }, [updateWeather]);

  return (
    <SafeAreaProvider>
      <PromptModal
        visible={promptModalVisible}
        onClose={() => setPromptModalVisible(false)}
        text={text}
        onChangeText={setText}
        onSubmit={changeCity}
      />
      <ForecastModal
        visible={forecastModalVisible}
        onClose={() => setForecastModalVisible(false)}
        forecast={forecastModalData}
      />
      <ImageBackground
        source={bgImage}
        resizeMode="cover"
        style={styles.background}
        blurRadius={2}
      >
        <SafeAreaView
          edges={["top"]}
          style={{
            flex: 1,
            backgroundColor: isLight
              ? "rgba(255, 255, 255, 0.125)"
              : "rgba(0, 0, 0, 0.125)",
          }}
        >
          <StatusBar animated={true} barStyle={statusBarStyle} />
          <ScrollView
            style={styles.container}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => updateWeather(city)}
              />
            }
          >
            <WeatherText style={styles.city} isLight={isLight}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Определить местоположение"
                onPress={changeCityLocation}
              >
                <Text style={[styles.symbolsColor, styles.symbols]}>
                  &#8982;
                </Text>{" "}
              </Pressable>
              {weather?.name ? weather.name : ""}{" "}
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Ввести название города"
                onPress={changeCityName}
              >
                <Text style={[styles.symbolsColor, styles.symbols]}>
                  &#9998;
                </Text>
              </Pressable>
            </WeatherText>
            <WeatherText style={styles.temp} isLight={isLight}>
              {(weather.main?.temp ?? "-") + "°"}
            </WeatherText>
            <WeatherText style={styles.tempMaxMin} isLight={isLight}>
              <Text style={styles.tempMax}>
                {weather.main?.temp_max ?? "-"}° /{" "}
              </Text>
              {weather.main?.temp_min ?? "-"}°C
            </WeatherText>
            <WeatherText style={styles.weather} isLight={isLight}>
              {weather?.weather ?? "-"}
            </WeatherText>

            <View>
              <WeatherText style={styles.title} isLight={isLight}>
                ПРОГНОЗ
              </WeatherText>
              {forecast.map((item) => {
                return (
                  <TouchableOpacity
                    key={item.dt}
                    onPress={() => {
                      setForecastModalData(item);
                      setForecastModalVisible(true);
                    }}
                  >
                    <View style={styles.forecastDay}>
                      <View style={styles.flexOne}>
                        <WeatherText isLight={isLight}>{item.date}</WeatherText>
                      </View>
                      <View style={styles.flexTwo}>
                        <WeatherText
                          isLight={isLight}
                          style={styles.textCenter}
                        >
                          {item.description}
                        </WeatherText>
                      </View>
                      <View style={styles.flexOne}>
                        <WeatherText isLight={isLight} style={styles.textRight}>
                          <Text style={styles.tempMax}>{item.tempMax}° </Text>/{" "}
                          {item.tempMin}°
                        </WeatherText>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View>
              <WeatherText style={styles.title} isLight={isLight}>
                КОМФОРТ
              </WeatherText>
              <WeatherText isLight={isLight}>
                Ощущается как: {weather.main?.feels_like ?? "-"}°C
              </WeatherText>
              <WeatherText isLight={isLight}>
                Влажность: {weather.main?.humidity ?? "-"}%
              </WeatherText>
              <WeatherText isLight={isLight}>
                Облачность: {weather.clouds?.all ?? "-"}%
              </WeatherText>
              <WeatherText isLight={isLight}>
                Давление: {weather.main?.pressure ?? "-"} мм рт.ст.
              </WeatherText>
              <WeatherText isLight={isLight}>
                Видимость: {weather?.visibility ?? "-"} м
              </WeatherText>
            </View>

            <View>
              <WeatherText style={styles.title} isLight={isLight}>
                ВЕТЕР
              </WeatherText>
              <WeatherText isLight={isLight}>
                Направление ветра: {weather.wind?.deg ?? "-"}
              </WeatherText>
              <WeatherText isLight={isLight}>
                Скорость ветра: {weather.wind?.speed ?? "-"} м/с
              </WeatherText>
              <WeatherText isLight={isLight}>
                Порывы ветра: {weather.wind?.gust ?? "-"} м/с
              </WeatherText>
            </View>

            <View>
              <WeatherText style={styles.title} isLight={isLight}>
                ВОСХОД и ЗАКАТ
              </WeatherText>
              <WeatherText isLight={isLight}>
                Восход солнца: {weather.sys?.sunrise ?? "-"}
              </WeatherText>
              <WeatherText isLight={isLight}>
                Закат солнца: {weather.sys?.sunset ?? "-"}
              </WeatherText>
            </View>

            <WeatherText style={styles.updateInfo} isLight={isLight}>
              Данные обновлены: {weather?.dt ?? "dd.mm.yyyy hh:mm:ss"}
            </WeatherText>
          </ScrollView>
        </SafeAreaView>
      </ImageBackground>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 8,
    paddingHorizontal: 12,
  },
  background: {
    flex: 1,
    overflow: "hidden",
  },
  symbols: {
    fontWeight: "400",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 0,
  },
  symbolsColor: {
    color: "#92c2f2",
  },
  city: {
    fontSize: 24,
    textAlign: "center",
    paddingTop: 8,
  },
  temp: {
    textAlign: "center",
    fontSize: 56,
  },
  tempMaxMin: {
    textAlign: "center",
  },
  tempMax: {
    fontWeight: "600",
  },
  weather: {
    textAlign: "center",
  },
  title: {
    marginTop: 12,
    marginBottom: 2,
    fontSize: 20,
    fontWeight: "600",
  },
  forecastDay: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 2,
  },
  flexOne: {
    flex: 1,
  },
  flexTwo: {
    flex: 2,
  },
  textCenter: {
    textAlign: "center",
  },
  textRight: {
    textAlign: "right",
  },
  updateInfo: { fontSize: 12, paddingTop: 8 },
});

export default Weather;
