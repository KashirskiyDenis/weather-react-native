import React, { useState, useEffect } from 'react';
import {
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

const BASE_URL = 'https://api.openweathermap.org/data/2.5/';
const APP_ID = '';
const UNITS = 'metric';
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
  const [refreshing, setRefreshing] = React.useState(false);
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
    if (q != '')
      str = `${BASE_URL}weather?q=${q}&appid=${APP_ID}&units=${UNITS}&lang=ru`;
    else
      str = `${BASE_URL}weather?lat=${lat}&lon=${lon}&appid=${APP_ID}&units=${UNITS}&lang=ru`;

    setUrl(str);
    return str;
  };

  const onChangeText = (text) => {
    setText(text);
  };

  const pressLocation = () => {
    setText('');
    setModalVisible(true);
  };

  const changeCity = async () => {
    if (text.trim().length == 0) {
      setModalVisible(!modalVisible);
      return;
    }
    setCity(text.trim());
    changeUrl(text.trim());
    setModalVisible(!modalVisible);
  };

  useEffect(() => {
    updateWeather();
  }, [url]);

  const addZero = (num) => (num < 10 ? '0' + num : num);

  const toHumanDate = (dt) => {
    date = new Date(dt * 1000);
    let dateStr = `${date.getDate()}/${
      date.getMonth() + 1
    }/${date.getFullYear()} ${date.getHours()}:${addZero(date.getMinutes())}`;
    return dateStr;
  };

  const changeBackground = (icon) => {
    if (icon == '02d' || icon == '03d' || icon == '04d') icon = '02d';
    if (icon == '09d' || icon == '10d') icon = '09d';

    if (icon == '02n' || icon == '03n' || icon == '04n') icon = '02n';
    if (icon == '09n' || icon == '10n') icon = '09n';
    setBgImage(IMAGES['i' + icon]);
    return icon;
  };

  const changeColor = (icon) => {
    if (
      icon == '01n' ||
      icon == '50d' ||
      icon == '50n' ||
      icon == '11n' ||
      icon == '13n' ||
      icon == '02n' ||
      icon == '09n' ||
      icon == '09d' ||
      icon == '10d'
    ) {
      setColor('#ffffff');
      setShadow('#000000');
    } else {
      setColor('#000000');
      setShadow('#ffffff');
    }
  };

  const updateWeather = async () => {
    try {
      let response = await fetch(url);
      if (!response.ok) {
        alert('Город не найден.');
        return;
      }
      const data = await (await fetch(url)).json();
      let date = new Date();
      let offset = Math.abs(date.getTimezoneOffset() * 60);
      data.dt = toHumanDate(data.dt);
      data.main.pressure = Math.round(data.main.pressure * 0.750062);
      data.sys.sunrise = toHumanDate(
        data.sys.sunrise - offset + data.timezone
      ).split(' ')[1];
      data.sys.sunset = toHumanDate(
        data.sys.sunset - offset + data.timezone
      ).split(' ')[1];
      data.weather[0].icon = changeBackground(data.weather[0].icon);
      changeColor(data.weather[0].icon);
      setWeather(data);
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <ImageBackground
      source={bgImage}
      resizeMode="cover"
      style={{
        height: null,
        resizeMode: 'cover',
        overflow: 'hidden',
        flex: 1,
      }}>
      <ScrollView
        style={styles.conteainer}
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
                <Text style={{ fontWeight: 600 }}>Изменение локации</Text>
                <TextInput
                  style={styles.modalText}
                  placeholder="Введите название города"
                  onChangeText={onChangeText}
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
              styles.section_param,
              { fontSize: 16 },
              styles.section_param_shadow,
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
              styles.section_param_shadow,
              { color: color, textShadowColor: shadow },
            ]}>
            {weather?.name ? weather.name : ''}
          </Text>
          <Text
            style={[
              styles.temp,
              styles.section_param_shadow,
              { color: color, textShadowColor: shadow },
            ]}>
            {weather.main?.temp ? weather.main.temp + '°' : '-'}
          </Text>
          <Text
            style={[
              styles.temp_max_min,
              styles.section_param_shadow,
              { color: color, textShadowColor: shadow },
            ]}>
            {weather.main?.temp_max ? weather.main.temp_max : 0}°C /{' '}
            <Text style={styles.temp_min}>
              {weather.main?.temp_min ? weather.main.temp_min : 0}°C
            </Text>
          </Text>
          <Text
            style={[
              styles.weather,
              styles.section_param_shadow,
              { color: color, textShadowColor: shadow },
            ]}>
            {weather?.weather
              ? weather.weather[0].description[0].toUpperCase() +
                weather.weather[0].description.substring(1)
              : ''}
          </Text>
          <View>
            <Text
              style={[
                styles.title_section,
                styles.section_param_shadow,
                { color: color, textShadowColor: shadow },
              ]}>
              КОМФОРТ
            </Text>
            <Text
              style={[
                styles.section_param,
                styles.section_param_shadow,
                { color: color, textShadowColor: shadow },
              ]}>
              Ощущается как:{' '}
              {weather.main?.feels_like ? weather.main.feels_like : 0}
              °C
            </Text>
            <Text
              style={[
                styles.section_param,
                styles.section_param_shadow,
                { color: color, textShadowColor: shadow },
              ]}>
              Влажность: {weather.main?.humidity ? weather.main.humidity : 0}%
            </Text>
            <Text
              style={[
                styles.section_param,
                styles.section_param_shadow,
                { color: color, textShadowColor: shadow },
              ]}>
              Облачность: {weather.clouds?.all ? weather.clouds.all : 0}%
            </Text>
            <Text
              style={[
                styles.section_param,
                styles.section_param_shadow,
                { color: color, textShadowColor: shadow },
              ]}>
              Давление : {weather.main?.pressure ? weather.main.pressure : 0} мм
              рт.ст.
            </Text>
            <Text
              style={[
                styles.section_param,
                styles.section_param_shadow,
                { color: color, textShadowColor: shadow },
              ]}>
              Видимость : {weather?.visibility ? weather.visibility : 0} м
            </Text>
          </View>
          <View>
            <Text
              style={[
                styles.title_section,
                styles.section_param_shadow,
                { color: color, textShadowColor: shadow },
              ]}>
              ВЕТЕР
            </Text>
            <Text
              style={[
                styles.section_param,
                styles.section_param_shadow,
                { color: color, textShadowColor: shadow },
              ]}>
              Направление ветра:{' '}
              {weather.wind?.deg
                ? WIND_DEG_TEXT[Math.trunc(weather.wind.deg / 22.5)]
                : ''}
            </Text>
            <Text
              style={[
                styles.section_param,
                styles.section_param_shadow,
                { color: color, textShadowColor: shadow },
              ]}>
              Скорость ветра: {weather.wind?.speed ? weather.wind.speed : 0} м/с
            </Text>
          </View>

          <View>
            <Text
              style={[
                styles.title_section,
                styles.section_param_shadow,
                { color: color, textShadowColor: shadow },
              ]}>
              ВОСХОД и ЗАКАТ
            </Text>
            <Text
              style={[
                styles.section_param,
                styles.section_param_shadow,
                { color: color, textShadowColor: shadow },
              ]}>
              Восход солнца: {weather.sys?.sunrise ? weather.sys.sunrise : ''}
            </Text>
            <Text
              style={[
                styles.section_param,
                styles.section_param_shadow,
                { color: color, textShadowColor: shadow },
              ]}>
              Закат солнца: {weather.sys?.sunset ? weather.sys.sunset : ''}
            </Text>
          </View>

          <Text
            style={[
              styles.margin,
              styles.section_param_shadow,
              { color: color, textShadowColor: shadow },
            ]}>
            Данные обновлены: {weather?.dt ? weather.dt : 'dd/mm/yyyy hh:mm:ss'}
          </Text>
        </SafeAreaView>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  conteainer: {
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
    fontWeight: 600,
  },
  temp_max_min: {
    textAlign: 'center',
    fontWeight: 600,
  },
  temp_min: {
    textAlign: 'center',
    fontWeight: 400,
  },
  weather: {
    textAlign: 'center',
  },
  title_section: {
    fontWeight: 600,
    marginTop: 12,
    fontSize: 24,
  },
  section_param: {
    paddingTop: 4,
    fontSize: 20,
  },
  section_param_shadow: {
    textShadowOffset: { width: 5, height: 5 },
    textShadowRadius: 15,
  },
  margin: {
    marginBottom: 8,
    paddingTop: 4,
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
