import { useLocalSearchParams, useRouter } from 'expo-router';
import { Text, View } from 'react-native';

import { Button } from '@/components/ui/button';

export default function ExamResultPage() {
  const { score, examId } = useLocalSearchParams<{ score: string; examId: string }>();
  const router = useRouter();

  const parsed = score ? Number(score) : null;
  const scoreValue = parsed !== null && !isNaN(parsed) ? parsed : null;

  const getScoreColor = () => {
    if (scoreValue === null) return 'text-gray-500';
    if (scoreValue >= 80) return 'text-emerald-500';
    if (scoreValue >= 60) return 'text-amber-500';
    return 'text-red-500';
  };

  const getScoreLabel = () => {
    if (scoreValue === null) return '-';
    if (scoreValue >= 80) return 'Sangat Baik';
    if (scoreValue >= 70) return 'Baik';
    if (scoreValue >= 60) return 'Cukup';
    return 'Perlu Perbaikan';
  };

  return (
    <View className="flex-1 items-center justify-center bg-white dark:bg-gray-950 p-6">
      <Text className="text-lg font-semibold text-gray-900 dark:text-white">
        Ujian Selesai
      </Text>

      <View className="mt-8 items-center">
        <Text className={`text-7xl font-bold ${getScoreColor()}`}>
          {scoreValue !== null ? Math.round(scoreValue) : '-'}
        </Text>
        <Text className="mt-2 text-base text-gray-500 dark:text-gray-400">Nilai Anda</Text>
      </View>

      <View className="mt-4 rounded-full bg-gray-100 dark:bg-gray-800 px-4 py-1.5">
        <Text className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {getScoreLabel()}
        </Text>
      </View>

      <Text className="mt-6 text-center text-sm text-gray-400 dark:text-gray-500">
        Jawaban Anda telah berhasil dikumpulkan dan dinilai.
      </Text>

      <Button
        title="Kembali ke Daftar Ujian"
        variant="primary"
        className="mt-10 w-full"
        onPress={() => router.replace('/(app)/(tabs)')}
      />
    </View>
  );
}
