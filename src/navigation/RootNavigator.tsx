import React from 'react';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { colors } from '../theme/theme';
import HomeScreen from '../screens/HomeScreen';
import InputScreen from '../screens/InputScreen';
import ResultScreen from '../screens/ResultScreen';
import CompatibilityScreen from '../screens/CompatibilityScreen';
import CompatibilityResultScreen from '../screens/CompatibilityResultScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

const navTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: colors.background,
    card: colors.surface,
    text: colors.text,
    border: colors.border,
    primary: colors.primary,
  },
};

export default function RootNavigator() {
  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: colors.surface },
          headerTintColor: colors.text,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: '統合占いアプリ' }} />
        <Stack.Screen name="Input" component={InputScreen} options={{ title: '生年月日を入力' }} />
        <Stack.Screen name="Result" component={ResultScreen} options={{ title: '診断結果' }} />
        <Stack.Screen name="Compatibility" component={CompatibilityScreen} options={{ title: '相性診断' }} />
        <Stack.Screen name="CompatibilityResult" component={CompatibilityResultScreen} options={{ title: '相性診断の結果' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
