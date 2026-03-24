import { useState, useEffect, useRef } from 'react';
import {
  Alert,
  Button,
  ImageBackground,
  Modal,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'https://api.openweathermap.org/data/2.5/';
const APP_ID = process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY;
const UNITS = 'metric';
const DEFAULT_CITY = 'Astrakhan';
const HPA_TO_MMHG = 0.750062; // 1 гПа = 0.750062 мм рт.ст.
const COMPASS_SECTORS = 16;
const DEG_PER_SECTOR = 360 / COMPASS_SECTORS; // 22.5°
const WIND_DEG_TEXT = [
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
const IMAGES = {
  i01d: require('./images/01d.jpg'),
  i01n: require('./images/01n.jpg'),
  i02d: require('./images/02d.jpg'),
  i02n: require('./images/02n.jpg'),
  i09d: require('./images/09d.jpg'),
  i09n: require('./images/09n.jpg'),
  i11d: require('./images/11d.jpg'),
  i11n: require('./images/11n.jpg'),
  i13d: require('./images/13d.jpg'),
  i13n: require('./images/13n.jpg'),
  i50d: require('./images/50d.jpg'),
  i50n: require('./images/50n.jpg'),
};
const WHITE_TEXT_ICON_CODES = [
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
const ICON_MAP = {
  '03d': '02d',
  '04d': '02d',
  '10d': '09d',
  '03n': '02n',
  '04n': '02n',
  '10n': '09n',
};

const buildUrl = (q = '', lat, lon) => {
  let str = '';
  if (q !== '')
    str = `${BASE_URL}weather?q=${q}&appid=${APP_ID}&units=${UNITS}&lang=ru`;
  else
    str = `${BASE_URL}weather?lat=${lat}&lon=${lon}&appid=${APP_ID}&units=${UNITS}&lang=ru`;

  return str;
};

const formatCityTime = (time, timezone) => {
  const offset = new Date().getTimezoneOffset() * 60;

  return new Date((time + offset + timezone) * 1000).toLocaleTimeString(
    'ru-RU',
    { hour: '2-digit', minute: '2-digit' }
  );
};

const Weather = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [city, setCity] = useState(DEFAULT_CITY);
  const [weather, setWeather] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [text, setText] = useState('');
  const [bgImage, setBgImage] = useState(null);
  const [color, setColor] = useState('#000000');
  const controllerRef = useRef(null);

  const pressLocation = () => {
    setText('');
    setModalVisible(true);
  };

  const changeCity = () => {
    if (text.trim().length === 0) {
      return;
    }
    setModalVisible(false);
    updateWeather(text.trim());
  };

  useEffect(() => {
    const loadData = async () => {
      const saved = await getSettings('city');
      if (saved !== null)
        Alert.alert('Последний город', saved, [{ text: 'OK' }]);
    };
    loadData();

    updateWeather(DEFAULT_CITY);
  }, []);

  const updateWeather = async (newCity) => {
    controllerRef.current?.abort();

    const controller = new AbortController();
    controllerRef.current = controller;
    let isTimeout = false;

    const timeoutId = setTimeout(() => {
      isTimeout = true;
      controller.abort();
    }, 15000);

    setRefreshing(true);

    try {
      const response = await fetch(buildUrl(newCity), {
        signal: controller.signal,
      });

      if (!response.ok) {
        Alert.alert('Ошибка', 'Город не найден.', [{ text: 'OK' }]);
        return;
      }

      await AsyncStorage.setItem('city', newCity);

      const data = await response.json();
      const date = new Date(data.dt * 1000);
      const icon = ICON_MAP[data.weather[0].icon] || data.weather[0].icon;
      const formatWeather = {
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

      setCity(newCity);
      setColor(WHITE_TEXT_ICON_CODES.includes(icon) ? '#ffffff' : '#000000');
      setBgImage(IMAGES['i' + icon]);
      setWeather(formatWeather);
    } catch (error) {
      if (error.name === 'AbortError') {
        if (isTimeout) {
          Alert.alert(
            'Ошибка',
            'Ошибка сети, проверьте доступ к сайту openweathermap.org',
            [{ text: 'OK' }]
          );
        }
      } else {
        Alert.alert(
          'Ошибка',
          'Ошибка сети, проверьте подключение с сети Интернет',
          [{ text: 'OK' }]
        );
      }
    } finally {
      clearTimeout(timeoutId);
      if (!controller.signal.aborted || isTimeout) {
        setRefreshing(false);
      }
    }
  };

  return (
    <SafeAreaProvider>
    <Modal
    animationType="slide"
    transparent={true}
    visible={modalVisible}
    onRequestClose={() => {
      setModalVisible(false);
    }}>
    <View style={styles.centeredView}>
    <View style={styles.modalView}>
    <Text style={{ fontWeight: '600' }}>Изменение локации</Text>
    <TextInput
    style={styles.modalText}
    placeholder="Введите название города"
    onChangeText={setText}
    value={text}
    />
    <View style={styles.fixToText}>
    <Button title="ОК" onPress={changeCity} />
    <Button title="Отмена" onPress={() => setModalVisible(false)} />
    </View>
    </View>
    </View>
    </Modal>
    <ImageBackground
    source={bgImage}
    resizeMode="cover"
    style={styles.background}>
    <SafeAreaView edges={['top']} style={{ flex: 1 }}>
    <ScrollView
    style={styles.container}
    refreshControl={
      <RefreshControl
      refreshing={refreshing}
      onRefresh={() => updateWeather(city)}
      />
    }>
    <WeatherText style={styles.city} color={color}>
    {weather?.name ? weather.name : ''}{' '}
    <Text
    style={[
      styles.positionIndicatorColor,
      { textShadowColor: 'transparent' },
    ]}
    onPress={pressLocation}>
    &#8982;
    </Text>
    </WeatherText>
    <WeatherText style={styles.temp} color={color}>
    {(weather.main?.temp ?? '-') + '°'}
    </WeatherText>
    <WeatherText style={styles.tempMaxMin} color={color}>
    {weather.main?.temp_max ?? '-'}°C /{' '}
    <Text style={styles.tempMin}>
    {weather.main?.temp_min ?? '-'}°C
    </Text>
    </WeatherText>
    <WeatherText style={styles.weather} color={color}>
    {weather?.weather ?? '-'}
    </WeatherText>

    <View>
    <WeatherText style={styles.title} color={color}>
    КОМФОРТ
    </WeatherText>
    <WeatherText color={color}>
    Ощущается как: {weather.main?.feels_like ?? '-'}°C
    </WeatherText>
    <WeatherText color={color}>
    Влажность: {weather.main?.humidity ?? '-'}%
    </WeatherText>
    <WeatherText color={color}>
    Облачность: {weather.clouds?.all ?? '-'}%
    </WeatherText>
    <WeatherText color={color}>
    Давление : {weather.main?.pressure ?? '-'} мм рт.ст.
    </WeatherText>
    <WeatherText color={color}>
    Видимость : {weather?.visibility ?? '-'} м
    </WeatherText>
    </View>

    <View>
    <WeatherText style={styles.title} color={color}>
    ВЕТЕР
    </WeatherText>
    <WeatherText color={color}>
    Направление ветра: {weather.wind?.deg ?? '-'}
    </WeatherText>
    <WeatherText color={color}>
    Скорость ветра: {weather.wind?.speed ?? '-'} м/с
    </WeatherText>
    </View>

    <View>
    <WeatherText style={styles.title} color={color}>
    ВОСХОД и ЗАКАТ
    </WeatherText>
    <WeatherText color={color}>
    Восход солнца: {weather.sys?.sunrise ?? '-'}
    </WeatherText>
    <WeatherText color={color}>
    Закат солнца: {weather.sys?.sunset ?? '-'}
    </WeatherText>
    </View>

    <WeatherText style={styles.updateInfo} color={color}>
    Данные обновлены: {weather?.dt ?? 'dd.mm.yyyy hh:mm:ss'}
    </WeatherText>
    </ScrollView>
    </SafeAreaView>
    </ImageBackground>
    </SafeAreaProvider>
  );
};

const WeatherText = ({ style, color, children }) => (
  <Text
  style={[
    { marginBottom: 2 },
    color === '#ffffff' ? styles.whiteFont : styles.blackFont,
    style,
  ]}>
  {children}
  </Text>
);

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
  background: {
    overflow: 'hidden',
    flex: 1,
  },
  whiteFont: {
    color: '#ffffff',
    textShadowColor: '#000000',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  blackFont: {
    color: '#000000',
    textShadowColor: '#ffffff',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 5,
  },
  positionIndicatorColor: {
    color: '#92c2f2',
  },
  city: {
    fontSize: 24,
    textAlign: 'center',
    paddingTop: 8,
  },
  temp: {
    textAlign: 'center',
    fontSize: 72,
    fontWeight: '600',
  },
  tempMaxMin: {
    textAlign: 'center',
    fontWeight: '600',
  },
  tempMin: {
    textAlign: 'center',
    fontWeight: '400',
  },
  weather: {
    textAlign: 'center',
  },
  title: {
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 2,
    fontSize: 24,
  },
  updateInfo: { fontSize: 12, paddingTop: 8 },

  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0000007d',
  },
  modalView: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 15,
  },
  modalText: {
    marginTop: 8,
    marginBottom: 8,
  },
  fixToText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default Weather;
