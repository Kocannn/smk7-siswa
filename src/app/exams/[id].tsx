import { useState } from 'react';
import { View, Text, Alert, ScrollView } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';

import { useExams, useStartExam } from '@/hooks/use-exams';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export default function ExamDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const examId = Number(id);
  const { data, isLoading } = useExams();
  const startExam = useStartExam();
  const [accessCode, setAccessCode] = useState('');

  const exam = data?.data?.find((e) => e.id === examId);

  if (isLoading) return <LoadingSpinner />;
  if (!exam) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-gray-950">
        <View className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 items-center justify-center mb-4">
          <Text className="text-3xl">📝</Text>
        </View>
        <Text className="text-gray-500 dark:text-gray-400 font-medium">Ujian tidak ditemukan</Text>
      </View>
    );
  }

  const handleStartExam = async () => {
    try {
      const attempt = await startExam.mutateAsync({
        examId: exam.id,
        accessCode: exam.has_access_code ? accessCode : undefined,
      });
      router.push(`/exams/attempt?examId=${exam.id}&attemptId=${attempt.id}`);
    } catch (err: any) {
      Alert.alert('Gagal', err.response?.data?.message || 'Tidak dapat memulai ujian.');
    }
  };

  const handleContinueExam = () => {
    if (exam.attempt) {
      router.push(`/exams/attempt?examId=${exam.id}&attemptId=${exam.attempt.id}`);
    }
  };

  return (
    <ScrollView className="flex-1 bg-gray-50 dark:bg-gray-950" showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View className="bg-blue-500 pt-6 pb-8 px-6">
        <Text className="text-2xl font-bold text-white">{exam.title}</Text>
        {exam.subject && (
          <Text className="text-blue-100 text-sm mt-1">{exam.subject}</Text>
        )}
      </View>

      <View className="px-4 -mt-4">
        {/* Exam Info Card */}
        <Card variant="elevated" className="mb-4">
          <View className="gap-3.5">
            <View className="flex-row items-center">
              <View className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-900/20 items-center justify-center mr-3">
                <Text className="text-sm">⏱</Text>
              </View>
              <View className="flex-1">
                <Text className="text-xs text-gray-500 dark:text-gray-400">Durasi</Text>
                <Text className="text-sm font-medium text-gray-900 dark:text-white">
                  {exam.duration_minutes} menit
                </Text>
              </View>
            </View>

            {exam.starts_at && (
              <View className="flex-row items-center">
                <View className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 items-center justify-center mr-3">
                  <Text className="text-sm">📅</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-xs text-gray-500 dark:text-gray-400">Mulai</Text>
                  <Text className="text-sm font-medium text-gray-900 dark:text-white">
                    {new Date(exam.starts_at).toLocaleString('id-ID')}
                  </Text>
                </View>
              </View>
            )}

            {exam.ends_at && (
              <View className="flex-row items-center">
                <View className="w-9 h-9 rounded-lg bg-amber-50 dark:bg-amber-900/20 items-center justify-center mr-3">
                  <Text className="text-sm">🏁</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-xs text-gray-500 dark:text-gray-400">Berakhir</Text>
                  <Text className="text-sm font-medium text-gray-900 dark:text-white">
                    {new Date(exam.ends_at).toLocaleString('id-ID')}
                  </Text>
                </View>
              </View>
            )}

            {exam.attempt && (
              <View className="flex-row items-center">
                <View className="w-9 h-9 rounded-lg bg-purple-50 dark:bg-purple-900/20 items-center justify-center mr-3">
                  <Text className="text-sm">📋</Text>
                </View>
                <View className="flex-1 flex-row items-center justify-between">
                  <View>
                    <Text className="text-xs text-gray-500 dark:text-gray-400">Status</Text>
                  </View>
                  <Badge
                    label={exam.attempt.status === 'in_progress' ? 'Sedang Berlangsung' : 'Sudah Dikumpulkan'}
                    variant={exam.attempt.status === 'in_progress' ? 'info' : 'success'}
                  />
                </View>
              </View>
            )}

            {exam.attempt?.score !== null && exam.attempt?.score !== undefined && (
              <View className="flex-row items-center">
                <View className="w-9 h-9 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 items-center justify-center mr-3">
                  <Text className="text-sm">⭐</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-xs text-gray-500 dark:text-gray-400">Nilai</Text>
                  <Text className="text-lg font-bold text-gray-900 dark:text-white">
                    {exam.attempt.score}
                  </Text>
                </View>
              </View>
            )}
          </View>
        </Card>

        {/* Access Code Input */}
        {exam.has_access_code && exam.can_start && (
          <Input
            label="Kode Akses"
            placeholder="Masukkan kode akses ujian"
            value={accessCode}
            onChangeText={setAccessCode}
            autoCapitalize="characters"
            className="mb-4"
          />
        )}

        {/* Action Button */}
        <View className="mb-8">
          {exam.attempt?.status === 'in_progress' ? (
            <Button title="Lanjutkan Ujian" onPress={handleContinueExam} size="lg" />
          ) : exam.can_start ? (
            <Button
              title="Mulai Ujian"
              onPress={handleStartExam}
              loading={startExam.isPending}
              size="lg"
            />
          ) : exam.attempt?.status === 'submitted' ? (
            <Card variant="filled">
              <View className="items-center py-2">
                <Text className="text-3xl mb-2">✅</Text>
                <Text className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Ujian sudah selesai
                </Text>
              </View>
            </Card>
          ) : (
            <Card variant="filled">
              <View className="items-center py-2">
                <Text className="text-sm text-gray-500 dark:text-gray-400">
                  Ujian belum tersedia
                </Text>
              </View>
            </Card>
          )}
        </View>
      </View>
    </ScrollView>
  );
}
