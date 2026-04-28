# 🌤️ Weather App

Мобильное приложение погоды на **React Native + Expo**, использующее OpenWeatherMap API. Показывает актуальную погоду по названию города или геолокации. Работает без интернета — последние данные загружаются из кэша.

---

## ✨ Возможности

- **Текущая погода** по городу или координатам
- **Прогноз на 5 дней** с детализацией по времени суток (ночь, утро, день, вечер)
- **Детальный прогноз** по нажатию на день (осадки, облачность, ветер и т.д.)
- Температура: текущая, мин/макс, ощущается как
- Ветер: скорость, порывы и направление (16 румбов)
- Влажность, давление, облачность, видимость
- Восход и закат с учётом часового пояса города
- **Смена города:**
  - iOS: `Alert.prompt`
  - Android: кастомное модальное окно
- **Pull-to-refresh** для принудительного обновления
- **Локальное кэширование** погоды (город, текущие данные, прогноз, иконка) – данные сохраняются автоматически и восстанавливаются при отсутствии сети
- Динамический фон и цвет текста в зависимости от погоды
- Отмена устаревших запросов (`AbortController`) и таймаут 15 секунд
- Обработка ошибок API: неверный ключ, город не найден, проблемы сети

---

## 🛠️ Стек технологий
| Технология | Версия | Назначение |
|---|---|---|
| React Native | — | UI-фреймворк |
| Expo | — | Платформа и инструменты |
| expo-location | — | Геолокация |
| react-native-safe-area-context | — | Безопасные отступы |
| @react-native-async-storage/async-storage | — | Локальное хранилище |
| OpenWeatherMap API | 2.5 | Данные о погоде |

---

## 🚀 Быстрый старт
### Требования
- [Node.js](https://nodejs.org/) 18+
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- Приложение [Expo Go](https://expo.dev/go) на телефоне **или** эмулятор iOS/Android
- API-ключ [OpenWeatherMap](https://openweathermap.org/api)
### Установка
```bash
# 1. Клонировать репозиторий
git clone https://github.com/KashirskiyDenis/weather-react-native.git
cd weather-react-native
# 2. Установить зависимости
npm install
# 3. Создать файл с переменными окружения
touch .env
```
### Настройка API-ключа
Откройте `.env` и вставьте ваш ключ:
```env
EXPO_PUBLIC_OPENWEATHER_API_KEY=ваш_ключ_сюда
```
### Запуск
```bash
# Запуск Expo Dev Server
npx expo start
```
Далее:
- **Телефон** — отсканируйте QR-код приложением Expo Go
- **Android-эмулятор** — нажмите `a` в терминале
- **iOS-симулятор** — нажмите `i` в терминале

---

## 📁 Структура проекта
```
weather-react-native/
├── api/
│   └── weatherApi.js          # Формирование URL, проверка ответа
├── assets/
│   ├── icon.png
│   └── splash.png
├── components/
│   ├── ForecastModal.js       # Модальное окно с прогнозом на день
│   ├── PromptModal.js         # Модальное окно ввода города (Android)
│   └── WeatherText.js         # Текстовый компонент с динамическим цветом
├── constants/
│   ├── modalColors.js         # Цвета модальных окон
│   └── weather.js             # Общие константы погоды
├── images/                    # Фоновые изображения по условиям погоды
│   ├── 01d.jpg                # Ясно, день
│   ├── 01n.jpg                # Ясно, ночь
│   ├── 02d.jpg                # Малооблачно, день
│   ├── 02n.jpg                # Малооблачно, ночь
│   ├── 09d.jpg                # Дождь, день
│   ├── 09n.jpg                # Дождь, ночь
│   ├── 11d.jpg                # Гроза, день
│   ├── 11n.jpg                # Гроза, ночь
│   ├── 13d.jpg                # Снег, день
│   ├── 13n.jpg                # Снег, ночь
│   ├── 50d.jpg                # Туман, день
│   └── 50n.jpg                # Туман, ночь
├── styles/
│   └── modalStyles.js         # Переиспользуемые стили модальных окон
├── utils/
│   ├── weatherCache.js        # Сохранение и загрузка кэша погоды
│   └── weatherFormat.js       # Форматирование данных API
└── App.js                     # Главный экран и логика
├── app.json
├── index.js
├── package.json
├── .env                       # Переменные окружения (не в git)
└── README.md
```

---

## ⚙️ Переменные окружения
| Переменная | Обязательная | Описание |
|---|---|---|
| `EXPO_PUBLIC_OPENWEATHER_API_KEY` | ✅ | API-ключ OpenWeatherMap |
---
## API
Используется [OpenWeatherMap Current Weather API](https://openweathermap.org/current).
**Запрос по городу:**
```
GET https://api.openweathermap.org/data/2.5/weather?q={city}&appid={key}&units=metric&lang=ru
```
```
GET https://api.openweathermap.org/data/2.5/forecast/daily?q={city}&appid={key}&units=metric&lang=ru
```
**Запрос по координатам:**
```
GET https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={key}&units=metric&lang=ru
```
```
GET https://api.openweathermap.org/data/2.5/forecast/daily?lat={lat}&lon={lon}&appid={key}&units=metric&lang=ru
```
## 📄 Лицензия
Распространяется под лицензией **MIT**.
