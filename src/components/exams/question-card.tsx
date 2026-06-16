import { Text, TextInput, View } from 'react-native';

import type { Question } from '@/types/exam';

import { HtmlRenderer } from './html-renderer';
import { OptionItem } from './option-item';

interface QuestionCardProps {
  question: Question;
  selectedOptionId?: number | null;
  responseText?: string;
  onSelectOption: (optionId: number) => void;
  onChangeText: (text: string) => void;
}

const LABELS = ['A', 'B', 'C', 'D', 'E', 'F'];

export function QuestionCard({
  question,
  selectedOptionId,
  responseText,
  onSelectOption,
  onChangeText,
}: QuestionCardProps) {
  return (
    <View className="flex-1">
      <View className="mb-2 flex-row items-center justify-between">
        <Text className="text-sm font-medium text-gray-500 dark:text-gray-400">
          {question.type === 'multiple_choice' ? 'Pilihan Ganda' : 'Essay'}
        </Text>
        <Text className="text-sm font-semibold text-blue-500">{question.points} poin</Text>
      </View>

      <View className="mb-5">
        <HtmlRenderer content={question.prompt} />
      </View>

      {question.type === 'multiple_choice' ? (
        <View className="gap-3">
          {question.answer_options.map((option, index) => (
            <OptionItem
              key={option.id}
              label={LABELS[index] ?? String(index + 1)}
              text={option.option_text}
              selected={selectedOptionId === option.id}
              onPress={() => onSelectOption(option.id)}
            />
          ))}
        </View>
      ) : (
        <TextInput
          className="min-h-[160px] rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 text-base text-gray-900 dark:text-white"
          multiline
          textAlignVertical="top"
          placeholder="Tulis jawaban Anda di sini..."
          placeholderTextColor="#9CA3AF"
          value={responseText ?? ''}
          onChangeText={onChangeText}
        />
      )}
    </View>
  );
}
