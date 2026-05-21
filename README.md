# Contact Manager — залікова робота, варіант 26

Мобільний додаток на React Native / Expo для управління контактами.

# Реалізовано

- список контактів з аватарами;
- пошук за іменем, телефоном або email;
- додавання нового контакту;
- редагування існуючого контакту;
- видалення контакту з підтвердженням;
- валідація полів форми;
- вибір країни / регіону номера телефону;
- автоматичне форматування номера телефону;
- перевірка правильності номера телефону;
- заборона створення контактів з однаковим номером телефону;
- email є необов’язковим полем;
- вибір аватара з галереї через `expo-image-picker`;
- локальне збереження даних через `AsyncStorage`;
- навігація між списком контактів і формою через `React Navigation`.

## Структура проєкту

```text
contacts-manager-rn/
├── App.js
├── app.json
├── package.json
├── README.md
└── src/
    ├── components/
    │   ├── ContactAvatar.js
    │   └── ContactCard.js
    ├── context/
    │   └── ContactsContext.js
    ├── data/
    │   └── defaultContacts.js
    ├── screens/
    │   ├── ContactFormScreen.js
    │   └── HomeScreen.js
    ├── styles/
    │   └── colors.js
    └── utils/
        └── validation.js
```

## Встановлення та запуск

1. Встановіть Node.js LTS.
2. Встановіть залежності:

```bash
npm install
```

3. Запустіть Expo:

```bash
npx expo start
```

4. Відкрийте додаток:
   - Android: натисніть `a` у терміналі або відскануйте QR-код в Expo Go;
   - iOS: натисніть `i` або відскануйте QR-код через камеру / Expo Go.

## Примітка щодо версій Expo

Проєкт підготовлено як Expo-проєкт. Якщо створюєте його з нуля, можна використати:

```bash
npx create-expo-app@latest --template default@sdk-55
```

Після цього перенесіть `App.js` і папку `src/`, а залежності встановіть командами:

```bash
npx expo install expo-image-picker @react-native-async-storage/async-storage react-native-screens react-native-safe-area-context
npm install @react-navigation/native @react-navigation/native-stack @expo/vector-icons
```
