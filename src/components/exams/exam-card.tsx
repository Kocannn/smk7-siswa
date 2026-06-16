import { View, Text, Pressable } from 'react-native';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { ExamListItem } from '@/types/exam';

interface ExamCardProps {
  exam: ExamListItem;
  onPress: () => void;
}

const statusConfig: Record<
  ExamListItem['status'],
  { label: string; variant: 'success' | 'warning' | 'default' }
> = {
  active: { label: 'Aktif', variant: 'success' },
  draft: { label: 'Segera', variant: 'warning' },
  completed: { label: 'Selesai', variant: 'default' },
};

const attemptStatusConfig: Record<
  string,
  { label: string; variant: 'success' | 'warning' | 'info' | 'default' }
> = {
  in_progress: { label: 'Sedang Dikerjakan', variant: 'warning' },
  submitted: { label: 'Dikumpulkan', variant: 'info' },
  graded: { label: 'Dinilai', variant: 'success' },
};

export function ExamCard({ exam, onPress }: ExamCardProps) {
  const status = statusConfig[exam.status];
  const attemptStatus = exam.attempt
    ? attemptStatusConfig[exam.attempt.status]
    : null;

  const getActionLabel = () => {
    if (!exam.attempt) return 'Mulai Ujian';
    if (exam.attempt.status === 'in_progress') return 'Lanjutkan';
    if (exam.attempt.status === 'graded' && exam.attempt.score !== null) {
      return `Nilai: ${exam.attempt.score}`;
    }
    return 'Lihat Detail';
  };

  return (
    <Pressable onPress={onPress}>
      {({ pressed }) => (
        <Card
          variant="outlined"
          className={`mb-3 ${pressed ? 'opacity-80' : ''}`}
        >
          {/* Header: Icon + Title + Badge */}
          <View className="flex-row items-start justify-between mb-2">
            <View className="flex-row items-center flex-1 mr-3">
              <View className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 items-center justify-center mr-3">
                <Text className="text-lg">📝</Text>
              </View>
              <View className="flex-1">
                <Text className="font-semibold text-gray-900 dark:text-white text-base" numberOfLines={1}>
                  {exam.title}
                </Text>
                <Text className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {exam.subject_name}
                </Text>
              </View>
            </View>
            <Badge label={status.label} variant={status.variant} size="sm" />
          </View>

          {/* Info Row: Duration + Questions */}
          <View className="flex-row items-center gap-4 mb-3 ml-13">
            <View className="flex-row items-center">
              <Text className="text-xs text-gray-400 dark:text-gray-500">⏱️ </Text>
              <Text className="text-xs text-gray-500 dark:text-gray-400">
                {exam.duration_minutes} menit
              </Text>
            </View>
            <View className="flex-row items-center">
              <Text className="text-xs text-gray-400 dark:text-gray-500">📋 </Text>
              <Text className="text-xs text-gray-500 dark:text-gray-400">
                {exam.questions_count} soal
              </Text>
            </View>
          </View>

          {/* Attempt Status + Action */}
          <View className="flex-row items-center justify-between">
            {attemptStatus ? (
              <Badge
                label={attemptStatus.label}
                variant={attemptStatus.variant}
                size="sm"
              />
            ) : (
              <View />
            )}
            <View className="bg-blue-500 dark:bg-blue-600 rounded-xl px-4 py-2">
              <Text className="text-xs font-semibold text-white">
                {getActionLabel()}
              </Text>
            </View>
          </View>
        </Card>
      )}
    </Pressable>
  );
}
