import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ContactsProvider } from './src/context/ContactsContext';
import HomeScreen from './src/screens/HomeScreen';
import ContactFormScreen from './src/screens/ContactFormScreen';
import { colors } from './src/styles/colors';

const Stack = createNativeStackNavigator();

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.background,
    primary: colors.primary,
    card: colors.card,
    text: colors.text,
    border: colors.border,
  },
};

export default function App() {
  return (
    <SafeAreaProvider>
      <ContactsProvider>
        <NavigationContainer theme={theme}>
          <StatusBar style="dark" />
          <Stack.Navigator
            screenOptions={{
              headerStyle: { backgroundColor: colors.card },
              headerTintColor: colors.text,
              headerTitleStyle: { fontWeight: '700' },
              contentStyle: { backgroundColor: colors.background },
            }}
          >
            <Stack.Screen
              name="Contacts"
              component={HomeScreen}
              options={{ title: 'Менеджер контактів' }}
            />
            <Stack.Screen
              name="ContactForm"
              component={ContactFormScreen}
              options={({ route }) => ({
                title: route.params?.contact ? 'Редагувати контакт' : 'Новий контакт',
              })}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </ContactsProvider>
    </SafeAreaProvider>
  );
}
