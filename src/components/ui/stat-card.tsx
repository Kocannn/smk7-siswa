import { View, Text } from 'react-native';

interface StatCardProps {
  value: string | number;
  label: string;
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'gray';
  icon?: string;
}

const colorStyles = {
  blue: {
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    value: 'text-blue-600 dark:text-blue-400',
    icon: 'bg-blue-100 dark:bg-blue-800/40',
  },
  green: {
    bg: 'bg-emerald-50 dark:bg-emerald-900/20',
    value: 'text-emerald-600 dark:text-emerald-400',
    icon: 'bg-emerald-100 dark:bg-emerald-800/40',
  },
  yellow: {
    bg: 'bg-amber-50 dark:bg-amber-900/20',
    value: 'text-amber-600 dark:text-amber-400',
    icon: 'bg-amber-100 dark:bg-amber-800/40',
  },
  red: {
    bg: 'bg-red-50 dark:bg-red-900/20',
    value: 'text-red-600 dark:text-red-400',
    icon: 'bg-red-100 dark:bg-red-800/40',
  },
  purple: {
    bg: 'bg-purple-50 dark:bg-purple-900/20',
    value: 'text-purple-600 dark:text-purple-400',
    icon: 'bg-purple-100 dark:bg-purple-800/40',
  },
  gray: {
    bg: 'bg-gray-50 dark:bg-gray-800/50',
    value: 'text-gray-700 dark:text-gray-300',
    icon: 'bg-gray-100 dark:bg-gray-700',
  },
};

export function StatCard({ value, label, color = 'blue', icon }: StatCardProps) {
  const style = colorStyles[color];

  return (
    <View className={`flex-1 rounded-2xl p-3.5 ${style.bg}`}>
      {icon && (
        <View className={`w-8 h-8 rounded-lg ${style.icon} items-center justify-center mb-2`}>
          <Text className="text-sm">{icon}</Text>
        </View>
      )}
      <Text className={`text-2xl font-bold ${style.value}`}>{value}</Text>
      <Text className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{label}</Text>
    </View>
  );
}
