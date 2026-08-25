import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

const editorialTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#183F35',
    background: '#F7F3E8',
    card: '#FFFDF7',
    text: '#17231F',
    border: '#9CAE9F',
    notification: '#B6533C',
  },
};

export default function RootLayout() {
  return (
    <ThemeProvider value={editorialTheme}>
      <Stack
        initialRouteName="index"
        screenOptions={{
          animationDuration: 220,
          contentStyle: { backgroundColor: '#F7F3E8' },
          headerShown: false,
        }}
      >
        <Stack.Screen name="index" options={{ animation: 'fade', title: 'História em Jogo' }} />
        <Stack.Screen name="quiz" options={{ animation: 'slide_from_right', gestureEnabled: false }} />
      </Stack>
      <StatusBar backgroundColor="#F7F3E8" style="dark" />
    </ThemeProvider>
  );
}
