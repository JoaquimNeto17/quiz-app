import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

const editorialTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#9B3E32',
    background: '#F3EFE6',
    card: '#FAF8F2',
    text: '#17324D',
    border: '#D7D0C3',
    notification: '#9B3E32',
  },
};

export default function RootLayout() {
  return (
    <ThemeProvider value={editorialTheme}>
      <Stack
        initialRouteName="index"
        screenOptions={{
          animationDuration: 220,
          contentStyle: { backgroundColor: '#F3EFE6' },
          headerShown: false,
        }}
      >
        <Stack.Screen name="index" options={{ animation: 'fade', title: 'História em Jogo' }} />
        <Stack.Screen name="quiz" options={{ animation: 'slide_from_right', gestureEnabled: false }} />
      </Stack>
      <StatusBar backgroundColor="#F3EFE6" style="dark" />
    </ThemeProvider>
  );
}
