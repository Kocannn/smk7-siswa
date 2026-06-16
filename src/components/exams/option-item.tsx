import { Pressable, Text, View } from 'react-native';

import { HtmlRenderer } from './html-renderer';

interface OptionItemProps {
  label: string;
  text: string;
  selected: boolean;
  onPress: () => void;
}

export function OptionItem({ label, text, selected, onPress }: OptionItemProps) {
  return (
    <Pressable
      onPress={onPress}
      className={`flex-row items-center rounded-xl border-2 p-4 ${
        selected
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900'
      }`}
    >
      <View
        className={`mr-3 h-6 w-6 items-center justify-center rounded-full border-2 ${
          selected ? 'border-blue-500 bg-blue-500' : 'border-gray-300 dark:border-gray-600'
        }`}
      >
        {selected && <View className="h-2.5 w-2.5 rounded-full bg-white" />}
      </View>
      <Text className="mr-2 font-semibold text-gray-700 dark:text-gray-300">{label}.</Text>
      <View className="flex-1">
        <HtmlRenderer content={text} />
      </View>
    </Pressable>
  );
}
