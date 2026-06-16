import { useState, useCallback } from 'react';
import { View, Text, FlatList, RefreshControl, TextInput, Modal, Pressable, Alert } from 'react-native';
import { router } from 'expo-router';

import { useExams, useStartExam } from '@/hooks/use-exams';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { EmptyState } from '@/components/ui/empty-state';
import type { ExamListItem } from '@/types/exam';

const statusConfig: Record<string, { label: string; variant: 'success' | 'warning' | 'default' }> = {
  active: { label: 'Aktif', variant: 'success' },
  draft: { label: 'Draft', variant: 'warning' },
  completed: { label: 'Selesai', variant: 'default' },
};

function ExamCard({ exam, onPress }: { exam: ExamListItem; onPress: () => void }) {
  const status = statusConfig[exam.status] ?? { label: exam.status, variant: 'default' as const };
  const attemptStatus = exam.attempt?.status;

  return (
    <Card>
      <Pressable onPress={onPress} className="p-4">
        <View className="flex-row items-start justify-between mb-2">
          <View className="flex-1 mr-3">
            <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              📝 {exam.title}
            </Text>
            <Text className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {exam.subject_name}
            </Text>
          </View>
          <Badge variant={status.variant}>{status.label}</Badge>
        </View>

        <View className="flex-row items-center gap-4 mb-3">
          <Text className="text-sm text-gray-500 dark:text-gray-400">
            ⏱️ {exam.duration_minutes} menit
          </Text>
          <Text className="text-sm text-gray-500 dark:text-gray-400">
            📋 {exam.questions_count} soal
          </Text>
        </View>

        {attemptStatus === 'submitted' || attemptStatus === 'graded' ? (
          <View className="flex-row items-center justify-between">
            <Badge variant="warning">
              {attemptStatus === 'graded' ? `Nilai: ${exam.attempt?.score ?? '-'}` : 'Sudah Dikumpulkan'}
            </Badge>
            <Text className="text-sm text-blue-600 dark:text-blue-400 font-medium">
              Lihat Hasil →
            </Text>
          </View>
        ) : attemptStatus === 'in_progress' ? (
          <View className="flex-row items-center justify-between">
            <Badge variant="warning">Sedang Dikerjakan</Badge>
            <Text className="text-sm text-blue-600 dark:text-blue-400 font-medium">
              Lanjutkan →
            </Text>
          </View>
        ) : (
          <Button onPress={onPress} size="sm" className="self-start">
            Mulai Ujian
          </Button>
        )}
      </Pressable>
    </Card>
  );
}

export default function ExamsScreen() {
  const { data: exams, isLoading, refetch, isRefetching, error } = useExams();
  const startExam = useStartExam();

  const [showAccessCode, setShowAccessCode] = useState(false);
  const [selectedExam, setSelectedExam] = useState<ExamListItem | null>(null);
  const [accessCode, setAccessCode] = useState('');

  const handleExamPress = useCallback((exam: ExamListItem) => {
    // If already attempted, go to attempt
    if (exam.attempt) {
      if (exam.attempt.status === 'submitted' || exam.attempt.status === 'graded') {
        router.push({
          pathname: '/(app)/exams/result',
          params: { examId: String(exam.id), score: String(exam.attempt.score ?? ''), status: exam.attempt.status },
        });
      } else {
        router.push({
          pathname: '/(app)/exams/[id]',
          params: { id: String(exam.id) },
        });
      }
      return;
    }

    // Start new attempt
    // If exam needs access code, show modal
    // Note: We don't know from the list API if access_code is required,
    // so we try to start and handle the error if code is needed
    setSelectedExam(exam);
    setAccessCode('');
    startExam.mutate(
      { examId: exam.id },
      {
        onSuccess: (attempt) => {
          setShowAccessCode(false);
          router.push({
            pathname: '/(app)/exams/[id]',
            params: { id: String(exam.id) },
          });
        },
        onError: (err: any) => {
          // If error mentions access code, show modal
          const msg = err?.response?.data?.message || err?.message || '';
          if (msg.toLowerCase().includes('kode') || msg.toLowerCase().includes('access')) {
            setShowAccessCode(true);
          } else {
            Alert.alert('Gagal', msg || 'Terjadi kesalahan');
          }
        },
      }
    );
  }, [startExam]);

  const handleStartWithCode = useCallback(() => {
    if (!selectedExam || !accessCode.trim()) return;
    startExam.mutate(
      { examId: selectedExam.id, accessCode: accessCode.trim() },
      {
        onSuccess: () => {
          setShowAccessCode(false);
          router.push({
            pathname: '/(app)/exams/[id]',
            params: { id: String(selectedExam.id) },
          });
        },
        onError: (err: any) => {
          Alert.alert('Gagal', err?.response?.data?.message || 'Kode akses salah');
        },
      }
    );
  }, [selectedExam, accessCode, startExam]);

  if (isLoading) return <LoadingSpinner />;

  if (error) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
        <Text className="text-red-500 text-center mb-4">Gagal memuat data ujian</Text>
        <Button onPress={() => refetch()} variant="outline">Coba Lagi</Button>
      </View>
    );
  }

  const activeCount = exams?.filter(e => e.status === 'active').length ?? 0;

  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <View className="px-4 pt-4 pb-2">
        <Text className="text-2xl font-bold text-gray-900 dark:text-gray-100">Ujian</Text>
        {activeCount > 0 && (
          <Text className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {activeCount} ujian aktif tersedia
          </Text>
        )}
      </View>

      {/* List */}
      <FlatList
        data={exams}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View className="px-4 mb-3">
            <ExamCard exam={item} onPress={() => handleExamPress(item)} />
          </View>
        )}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
        ListEmptyComponent={
          <EmptyState
            icon="📝"
            title="Tidak ada ujian"
            description="Belum ada ujian yang tersedia untuk kelas kamu saat ini."
          />
        }
        contentContainerStyle={exams?.length === 0 ? { flex: 1 } : { paddingBottom: 16 }}
      />

      {/* Access Code Modal */}
      <Modal visible={showAccessCode} transparent animationType="fade">
        <Pressable
          className="flex-1 bg-black/50 items-center justify-center px-6"
          onPress={() => setShowAccessCode(false)}
        >
          <Pressable onPress={(e) => e.stopPropagation()}>
            <View className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-sm">
              <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Masukkan Kode Akses
              </Text>
              <Text className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Ujian "{selectedExam?.title}" memerlukan kode akses dari guru.
              </Text>
              <TextInput
                value={accessCode}
                onChangeText={setAccessCode}
                placeholder="Kode akses"
                autoCapitalize="characters"
                className="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-base text-gray-900 dark:text-gray-100 mb-4 bg-white dark:bg-gray-700"
                placeholderTextColor="#9CA3AF"
              />
              <View className="flex-row gap-3">
                <Button
                  onPress={() => setShowAccessCode(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Batal
                </Button>
                <Button
                  onPress={handleStartWithCode}
                  disabled={!accessCode.trim() || startExam.isPending}
                  className="flex-1"
                >
                  {startExam.isPending ? 'Memulai...' : 'Mulai'}
                </Button>
              </View>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
