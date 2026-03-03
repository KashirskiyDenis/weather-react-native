import { useState, useEffect } from 'react';
import {
  Alert,
  Button,
  ImageBackground,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
  RefreshControl,
} from 'react-native';
import Config from 'react-native-config'

const BASE_URL = 'https://api.openweathermap.org/data/2.5/';
const APP_ID = Config.OPENWEATHER_API_KEY;
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
  'Северный',
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

const Weather = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [city, setCity] = useState('Astrakhan');
  const [weather, setWeather] = useState({});
  const [url, setUrl] = useState(
    `${BASE_URL}weather?q=Astrakhan&appid=${APP_ID}&units=${UNITS}&lang=ru`
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [text, setText] = useState('');
  const [bgImage, setBgImage] = useState(0);
  const [color, setColor] = useState('#000000');
  const [shadow, setShadow] = useState('#ffffff');

  const changeUrl = (q = '', lat, lon) => {
    let str = '';
    if (q !== '')
      str = `${BASE_URL}weather?q=${q}&appid=${APP_ID}&units=${UNITS}&lang=ru`;
    else
      str = `${BASE_URL}weather?lat=${lat}&lon=${lon}&appid=${APP_ID}&units=${UNITS}&lang=ru`;

    setUrl(str);
  };

  const pressLocation = () => {
    setText('');
    setModalVisible(true);
  };

  const changeCity = () => {
    if (text.trim().length === 0) {
      setModalVisible(!modalVisible);
      return;
    }
    setCity(text.trim());
    changeUrl(text.trim());
    setModalVisible(!modalVisible);
  };

  useEffect(() => {
    console.log(url);
    updateWeather();
  }, [url]);

  const addZero = (num) => (num < 10 ? '0' + num : num);

  const toHumanDate = (dt) => {
    let date = new Date(dt * 1000);
    let dateStr = `${date.getDate()}/${
      date.getMonth() + 1
    }/${date.getFullYear()} ${date.getHours()}:${addZero(date.getMinutes())}`;
    return dateStr;
  };

  const changeBackground = (icon) => {
    if (icon === '02d' || icon === '03d' || icon === '04d') icon = '02d';
    if (icon === '09d' || icon === '10d') icon = '09d';

    if (icon === '02n' || icon === '03n' || icon === '04n') icon = '02n';
    if (icon === '09n' || icon === '10n') icon = '09n';
    setBgImage(IMAGES['i' + icon]);
    return icon;
  };

  const changeColor = (icon) => {
    if (
      icon === '01n' ||
      icon === '50d' ||
      icon === '50n' ||
      icon === '11n' ||
      icon === '13n' ||
      icon === '02n' ||
      icon === '09n' ||
      icon === '09d' ||
      icon === '10d'
    ) {
      setColor('#ffffff');
      setShadow('#000000');
    } else {
      setColor('#000000');
      setShadow('#ffffff');
    }
  };

  const updateWeather = async () => {
    setRefreshing(true);

    try {
      let response = await fetch(url);

      if (!response.ok) {
        Alert.alert('Ошибка', 'Город не найден. 2,0');
        return;
      }

      let data = await response.json();
      let date = new Date();
      let offset = Math.abs(date.getTimezoneOffset() * 60);
      let weather = {};
      weather.dt = toHumanDate(data.dt);
      weather.main.pressure = Math.round(data.main.pressure * HPA_TO_MMHG);
      weather.sys.sunrise = toHumanDate(
        data.sys.sunrise - offset + data.timezone
      ).split(' ')[1];
      weather.sys.sunset = toHumanDate(
        data.sys.sunset - offset + data.timezone
      ).split(' ')[1];
      weather.weather[0].icon = changeBackground(data.weather[0].icon);
      changeColor(data.weather[0].icon);
      setWeather(weather);
    } catch (error) {
      Alert.alert('Ошибка', 'Ошибка сети. Проверьте подключение.');

      console.log(error.message);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <ImageBackground
      source={IMAGES['i01d']}//bgImage}
      resizeMode="cover"
      style={{
        height: null,
        resizeMode: 'cover',
        overflow: 'hidden',
        flex: 1,
      }}>
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={updateWeather} />
        }>
        <SafeAreaView style={styles.droidSafeArea}>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(!modalVisible);
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
                    onPress={() => setModalVisible(!modalVisible)}
                  />
                </View>
              </View>
            </View>
          </Modal>

          <Text
            style={[
              styles.sectionParam,
              { fontSize: 16 },
              styles.sectionParamShadow,
            ]}>
            Текущее место{' '}
            <Text style={styles.currentCity} onPress={pressLocation}>
              {city}
            </Text>
            . Нажмите чтобы изменить.
          </Text>
          <Text
            style={[
              styles.city,
              styles.sectionParamShadow,
              { color: color, textShadowColor: shadow },
            ]}>
            {weather?.name ? weather.name : ''}
          </Text>
          <Text
            style={[
              styles.temp,
              styles.sectionParamShadow,
              { color: color, textShadowColor: shadow },
            ]}>
            {weather.main?.temp ? weather.main.temp + '°' : '-'}
          </Text>
          <Text
            style={[
              styles.tempMaxMin,
              styles.sectionParamShadow,
              { color: color, textShadowColor: shadow },
            ]}>
            {weather.main?.temp_max ? weather.main.temp_max : 0}°C /{' '}
            <Text style={styles.tempMin}>
              {weather.main?.temp_min ? weather.main.temp_min : 0}°C
            </Text>
          </Text>
          <Text
            style={[
              styles.weather,
              styles.sectionParamShadow,
              { color: color, textShadowColor: shadow },
            ]}>
            {weather?.weather
              ? weather.weather[0].description[0].toUpperCase() +
                weather.weather[0].description.substring(1)
              : ''}
          </Text>

          <View>
            <WeatherText
              style={[styles.titleSection, styles.sectionParamShadow]}
              color={color}
              shadow={shadow}>
              КОМФОРТ
            </WeatherText>
            <WeatherText color={color} shadow={shadow}>
              Ощущается как:
              {weather.main?.feels_like ? weather.main.feels_like : 0}
              °C
            </WeatherText>
            <WeatherText color={color} shadow={shadow}>
              Влажность: {weather.main?.humidity ?? 0}%
            </WeatherText>
            <WeatherText color={color} shadow={shadow}>
              Облачность: {weather.clouds?.all ? weather.clouds.all : 0}%
            </WeatherText>
            <WeatherText color={color} shadow={shadow}>
              Давление : {weather.main?.pressure ? weather.main.pressure : 0} мм
              рт.ст.
            </WeatherText>
            <WeatherText color={color} shadow={shadow}>
              Видимость : {weather?.visibility ? weather.visibility : 0} м
            </WeatherText>
          </View>

          <View>
            <WeatherText
              style={[styles.titleSection, styles.sectionParamShadow]}
              color={color}
              shadow={shadow}>
              ВЕТЕР
            </WeatherText>
            <WeatherText color={color} shadow={shadow}>
              Направление ветра:{' '}
              {weather.wind?.deg
                ? WIND_DEG_TEXT[Math.trunc(weather.wind.deg / DEG_PER_SECTOR)]
                : ''}{' '}
            </WeatherText>
            <WeatherText color={color} shadow={shadow}>
              Скорость ветра: {weather.wind?.speed ? weather.wind.speed : 0} м/с
            </WeatherText>
          </View>

          <View>
            <WeatherText
              style={[styles.titleSection, styles.sectionParamShadow]}
              color={color}
              shadow={shadow}>
              ВОСХОД и ЗАКАТ
            </WeatherText>
            <WeatherText color={color} shadow={shadow}>
              Восход солнца: {weather.sys?.sunrise ? weather.sys.sunrise : ''}
            </WeatherText>
            <WeatherText color={color} shadow={shadow}>
              Закат солнца: {weather.sys?.sunset ? weather.sys.sunset : ''}
            </WeatherText>
          </View>

          <WeatherText color={color} shadow={shadow}>
            Данные обновлены: {weather?.dt ? weather.dt : 'dd/mm/yyyy hh:mm:ss'}
          </WeatherText>
        </SafeAreaView>
      </ScrollView>
    </ImageBackground>
  );
};

const WeatherText = ({ children, style, color, shadow }) => (
  <Text
    style={[
      style,
      styles.sectionParam,
      styles.sectionParamShadow,
      { color, textShadowColor: shadow },
    ]}>
    {children}
  </Text>
);

const styles = StyleSheet.create({
  container: {
    margin: 8,
  },
  currentCity: {
    color: '#92c2f2',
  },
  city: {
    fontSize: 24,
    textAlign: 'center',
    marginTop: 8,
  },
  temp: {
    textAlign: 'center',
    fontSize: 70,
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
  titleSection: {
    fontWeight: '600',
    marginTop: 12,
    fontSize: 24,
  },
  sectionParam: {
    paddingTop: 4,
    fontSize: 20,
  },
  sectionParamShadow: {
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 20,
  },

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
