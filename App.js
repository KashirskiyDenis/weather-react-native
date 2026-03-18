import { useState, useEffect } from 'react';
import {
  Alert,
  Button,
  ImageBackground,
  Modal,
  Platform,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const BASE_URL = 'https://api.openweathermap.org/data/2.5/';
const APP_ID = process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY;
const UNITS = 'metric';
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
const ARRAY_ICON = [
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

const buildUrl = (q = '', lat, lon) => {
  let str = '';
  if (q !== '')
    str = `${BASE_URL}weather?q=${q}&appid=${APP_ID}&units=${UNITS}&lang=ru`;
  else
    str = `${BASE_URL}weather?lat=${lat}&lon=${lon}&appid=${APP_ID}&units=${UNITS}&lang=ru`;

  return str;
};

const changeBackground = (icon) => {
  if (icon === '02d' || icon === '03d' || icon === '04d') icon = '02d';
  if (icon === '09d' || icon === '10d') icon = '09d';

  if (icon === '02n' || icon === '03n' || icon === '04n') icon = '02n';
  if (icon === '09n' || icon === '10n') icon = '09n';

  return icon;
};

const Weather = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [city, setCity] = useState('Astrakhan');
  const [weather, setWeather] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [text, setText] = useState('');
  const [bgImage, setBgImage] = useState(null);
  const [color, setColor] = useState('#000000');

  const pressLocation = () => {
    setText('');
    setModalVisible(true);
  };

  const changeCity = () => {
    if (text.trim().length === 0) {
      setModalVisible(false);
      return;
    }
    setModalVisible(false);
    updateWeather(text.trim());
  };

  useEffect(() => {
    updateWeather(city);
  }, []);

  const formatCityTime = (time, timezone) => {
    let offset = new Date().getTimezoneOffset() * 60;

    return new Date((time + offset + timezone) * 1000).toLocaleTimeString(
      'ru-RU',
      { hour: '2-digit', minute: '2-digit' }
    );
  };

  const updateWeather = async (newCity) => {
    setRefreshing(true);

    try {
      let response = await fetch(buildUrl(newCity));

      if (!response.ok) {
        Alert.alert('Ошибка', 'Город не найден.', [{ text: 'OK' }]);
        return;
      }
      setCity(newCity);

      let data = await response.json();
      let date = new Date(data.dt * 1000);
      let icon = changeBackground(data.weather[0].icon);
      let newWeather = structuredClone(data);

      newWeather.main.pressure = Math.round(data.main.pressure * HPA_TO_MMHG);
      newWeather.sys.sunrise = formatCityTime(data.sys.sunrise, data.timezone);
      newWeather.sys.sunset = formatCityTime(data.sys.sunset, data.timezone);
      newWeather.dt = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;

      setColor(ARRAY_ICON.includes(icon) ? '#ffffff' : '#000000');
      setBgImage(IMAGES['i' + icon]);
      setWeather(newWeather);
    } catch (error) {
      Alert.alert('Ошибка', 'Ошибка сети. Проверьте подключение.', [
        { text: 'OK' },
      ]);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <SafeAreaProvider>
    <ImageBackground
    source={bgImage}
    resizeMode="cover"
    style={styles.background}>
    <SafeAreaView style={styles.droidSafeArea}>
    <ScrollView
    style={styles.container}
    refreshControl={
      <RefreshControl
      refreshing={refreshing}
      onRefresh={() => updateWeather(city)}
      />
    }>
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
    <Button
    title="Отмена"
    onPress={() => setModalVisible(false)}
    />
    </View>
    </View>
    </View>
    </Modal>

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
    {weather?.weather
      ? weather.weather[0].description[0].toUpperCase() +
      weather.weather[0].description.substring(1)
      : ''}
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
      Направление ветра:{' '}
      {weather.wind?.deg
        ? WIND_DEG_TEXT[
          Math.round(weather.wind.deg / DEG_PER_SECTOR) %
          COMPASS_SECTORS
        ]
        : ''}{' '}
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
    height: null,
    resizeMode: 'cover',
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
    marginTop: 8,
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
    margin: 20,
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
  droidSafeArea: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
});

export default Weather;
