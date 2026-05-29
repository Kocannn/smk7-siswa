import { useState } from 'react';
import { View, Text, FlatList, Pressable, RefreshControl } from 'react-native';
import { router } from 'expo-router';

import { useExams } from '@/hooks/use-exams';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { EmptyState } from '@/components/ui/empty-state';

const attemptStatusLabel: Record<string, string> = {
  in_progress: 'Sedang Berlangsung',
  submitted: 'Sudah Dikumpulkan',
};

const attemptStatusVariant: Record<string, 'info' | 'success'> = {
  in_progress: 'info',
  submitted: 'success',
};

export default function ExamsScreen() {
  const [page, setPage] = useState(1);
  const { data, isLoading, refetch, isRefetching } = useExams(page);

  if (isLoading) return <LoadingSpinner />;

  return (
    <FlatList
      className="bg-gray-50 dark:bg-gray-950"
      contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
      refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={() => { setPage(1); refetch(); }} />}
      data={data?.data || []}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <Pressable
          onPress={() => router.push(`/exams/${item.id}`)}
          style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
        >
          <Card variant="outlined" className="mb-3">
            <View className="flex-row justify-between items-start">
              <View className="flex-1 mr-3">
                <Text className="font-semibold text-gray-900 dark:text-white text-base">
                  {item.title}
                </Text>
                <View className="flex-row items-center mt-2 gap-3">
                  {item.subject && (
                    <View className="flex-row items-center">
                      <Text className="text-xs text-gray-400 dark:text-gray-500">📚</Text>
                      <Text className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                        {item.subject}
                      </Text>
                    </View>
                  )}
                  <View className="flex-row items-center">
                    <Text className="text-xs text-gray-400 dark:text-gray-500">⏱</Text>
                    <Text className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                      {item.duration_minutes} menit
                    </Text>
                  </View>
                </View>
                {item.starts_at && (
                  <Text className="text-xs text-gray-400 dark:text-gray-500 mt-1.5">
                    {new Date(item.starts_at).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Text>
                )}
              </View>
              <View className="items-end gap-1.5">
                {item.attempt ? (
                  <Badge
                    label={attemptStatusLabel[item.attempt.status] || item.attempt.status}
                    variant={attemptStatusVariant[item.attempt.status] || 'default'}
                    size="sm"
                  />
                ) : item.can_start ? (
                  <Badge label="Mulai" variant="info" size="sm" />
                ) : null}
                {item.has_access_code && (
                  <Badge label="Perlu Kode" variant="warning" size="sm" />
                )}
              </View>
            </View>
          </Card>
        </Pressable>
      )}
      ListEmptyComponent={
        <EmptyState
          title="Tidak Ada Ujian"
          description="Belum ada ujian yang tersedia saat ini"
          icon="📝"
        />
      }
    />
  );
}
