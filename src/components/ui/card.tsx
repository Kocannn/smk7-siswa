import { View, type ViewProps } from 'react-native';

interface CardProps extends ViewProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined' | 'filled';
}

const variantStyles = {
  default: 'bg-white dark:bg-gray-900 shadow-sm',
  elevated: 'bg-white dark:bg-gray-900 shadow-md',
  outlined: 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700',
  filled: 'bg-gray-50 dark:bg-gray-800',
};

export function Card({ children, className, variant = 'default', ...props }: CardProps) {
  return (
    <View
      className={`rounded-2xl p-4 ${variantStyles[variant]} ${className || ''}`}
      {...props}
    >
      {children}
    </View>
  );
}
