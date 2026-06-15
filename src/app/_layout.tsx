import '../global.css';

import { createContext, useContext, useState } from 'react';
import { useColorScheme } from 'react-native';
import { Stack, DarkTheme, DefaultTheme, ThemeProvider as NavThemeProvider } from 'expo-router';
import { QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';

import { AuthProvider } from '@/hooks/use-auth';
import { queryClient } from '@/lib/query-client';

// Theme context - inline to avoid module resolution issues
type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  mode: ThemeMode;
  isDark: boolean;
  setMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  mode: 'system',
  isDark: false,
  setMode: () => { },
});

export function useThemeMode() {
  return useContext(ThemeContext);
}

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [mode, setMode] = useState<ThemeMode>('system');

  const isDark = mode === 'system'
    ? systemScheme === 'dark'
    : mode === 'dark';

  return (
    <ThemeContext.Provider value={{ mode, isDark, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Root nav component
function RootLayoutNav() {
  const { isDark } = useThemeMode();

  return (
    <NavThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(app)" />
      </Stack>
    </NavThemeProvider>
  );
}

// Root layout
export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <RootLayoutNav />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
