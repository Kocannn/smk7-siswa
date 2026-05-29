import { View, Text } from 'react-native';

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: string;
  action?: React.ReactNode;
}

export function EmptyState({ title, description, icon = '📭', action }: EmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center px-8 py-16">
      <View className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 items-center justify-center mb-5">
        <Text className="text-4xl">{icon}</Text>
      </View>
      <Text className="text-lg font-semibold text-gray-900 dark:text-white text-center">
        {title}
      </Text>
      {description && (
        <Text className="text-sm text-gray-500 dark:text-gray-400 text-center mt-2 leading-5 max-w-[260px]">
          {description}
        </Text>
      )}
      {action && <View className="mt-6">{action}</View>}
    </View>
  );
}
