import { Redirect, Stack } from 'expo-router';

import { useAuth } from '@/hooks/use-auth';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export default function AuthLayout() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner message="Memuat..." />;
  }

  if (isAuthenticated) {
    return <Redirect href="/(app)/(tabs)" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
    </Stack>
  );
}
