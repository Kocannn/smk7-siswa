import { View, Text } from 'react-native';

interface BadgeProps {
  label: string;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md';
}

const variantStyles: Record<string, { bg: string; text: string }> = {
  default: {
    bg: 'bg-gray-100 dark:bg-gray-800',
    text: 'text-gray-600 dark:text-gray-300',
  },
  success: {
    bg: 'bg-emerald-50 dark:bg-emerald-900/30',
    text: 'text-emerald-600 dark:text-emerald-400',
  },
  warning: {
    bg: 'bg-amber-50 dark:bg-amber-900/30',
    text: 'text-amber-600 dark:text-amber-400',
  },
  danger: {
    bg: 'bg-red-50 dark:bg-red-900/30',
    text: 'text-red-600 dark:text-red-400',
  },
  info: {
    bg: 'bg-blue-50 dark:bg-blue-900/30',
    text: 'text-blue-600 dark:text-blue-400',
  },
};

const sizeStyles = {
  sm: 'px-2 py-0.5',
  md: 'px-2.5 py-1',
};

export function Badge({ label, variant = 'default', size = 'md' }: BadgeProps) {
  const style = variantStyles[variant];

  return (
    <View className={`rounded-full ${style.bg} ${sizeStyles[size]}`}>
      <Text className={`text-xs font-medium ${style.text}`}>{label}</Text>
    </View>
  );
}
