import { Pressable, Text, ActivityIndicator, type PressableProps } from 'react-native';

interface ButtonProps extends PressableProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  loading?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const variantStyles = {
  primary: 'bg-blue-500 active:bg-blue-600 shadow-sm',
  secondary: 'bg-gray-100 dark:bg-gray-800 active:bg-gray-200 dark:active:bg-gray-700',
  danger: 'bg-red-500 active:bg-red-600 shadow-sm',
  ghost: 'bg-transparent active:bg-gray-100 dark:active:bg-gray-800',
};

const textVariantStyles = {
  primary: 'text-white',
  secondary: 'text-gray-900 dark:text-white',
  danger: 'text-white',
  ghost: 'text-blue-500',
};

const sizeStyles = {
  sm: 'py-2 px-4',
  md: 'py-3.5 px-5',
  lg: 'py-4 px-6',
};

const textSizeStyles = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
};

export function Button({
  title,
  variant = 'primary',
  loading = false,
  size = 'md',
  disabled,
  className,
  ...props
}: ButtonProps) {
  return (
    <Pressable
      className={`rounded-2xl items-center justify-center ${variantStyles[variant]} ${sizeStyles[size]} ${
        disabled || loading ? 'opacity-50' : ''
      } ${className || ''}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'secondary' ? '#111827' : '#fff'} size="small" />
      ) : (
        <Text className={`font-semibold ${textSizeStyles[size]} ${textVariantStyles[variant]}`}>
          {title}
        </Text>
      )}
    </Pressable>
  );
}
