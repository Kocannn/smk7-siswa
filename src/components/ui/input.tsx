import { TextInput, View, Text, type TextInputProps } from 'react-native';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  hint?: string;
}

export function Input({ label, error, hint, className, ...props }: InputProps) {
  return (
    <View className="mb-4">
      {label && (
        <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label}
        </Text>
      )}
      <TextInput
        className={`bg-gray-50 dark:bg-gray-800/80 rounded-xl px-4 py-3.5 text-base text-gray-900 dark:text-white border ${
          error
            ? 'border-red-400 dark:border-red-500'
            : 'border-gray-200 dark:border-gray-700'
        } ${className || ''}`}
        placeholderTextColor="#9CA3AF"
        {...props}
      />
      {error && (
        <View className="flex-row items-center mt-1.5">
          <Text className="text-red-500 text-xs">{error}</Text>
        </View>
      )}
      {hint && !error && (
        <Text className="text-gray-400 dark:text-gray-500 text-xs mt-1.5">{hint}</Text>
      )}
    </View>
  );
}
