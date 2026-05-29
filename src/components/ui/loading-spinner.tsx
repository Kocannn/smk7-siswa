import { ActivityIndicator, View, Text } from 'react-native';

interface LoadingSpinnerProps {
  message?: string;
  fullScreen?: boolean;
}

export function LoadingSpinner({ message, fullScreen = true }: LoadingSpinnerProps) {
  if (!fullScreen) {
    return (
      <View className="items-center justify-center py-8">
        <ActivityIndicator size="large" color="#208AEF" />
        {message && (
          <Text className="mt-3 text-sm text-gray-500 dark:text-gray-400">{message}</Text>
        )}
      </View>
    );
  }

  return (
    <View className="flex-1 items-center justify-center bg-white dark:bg-gray-950">
      <View className="items-center">
        <ActivityIndicator size="large" color="#208AEF" />
        {message && (
          <Text className="mt-4 text-sm text-gray-500 dark:text-gray-400">{message}</Text>
        )}
      </View>
    </View>
  );
}
