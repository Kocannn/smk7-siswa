import { useState, useCallback } from 'react';
import { View, Text, FlatList, RefreshControl } from 'react-native';

import { useAttendance } from '@/hooks/use-attendance';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { StatCard } from '@/components/ui/stat-card';
import { EmptyState } from '@/components/ui/empty-state';

const statusVariant: Record<string, 'success' | 'warning' | 'danger'> = {
  present: 'success',
  late: 'warning',
  absent: 'danger',
  bolos: 'danger',
};

const statusLabel: Record<string, string> = {
  present: 'Hadir',
  late: 'Terlambat',
  absent: 'Alfa',
  bolos: 'Bolos',
};

export default function AttendanceScreen() {
  const [page, setPage] = useState(1);
  const { data, isLoading, refetch, isRefetching } = useAttendance(page);

  const handleRefresh = useCallback(() => {
    setPage(1);
    refetch();
  }, [refetch]);

  if (isLoading) return <LoadingSpinner />;

  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-950">
      {/* Stats */}
      {data?.stats && (
        <View className="px-4 pt-4 pb-2">
          <View className="flex-row gap-2.5">
            <StatCard
              value={data.stats.total}
              label="Total"
              color="blue"
              icon="📊"
            />
            <StatCard
              value={data.stats.present}
              label="Hadir"
              color="green"
              icon="✓"
            />
            <StatCard
              value={data.stats.late}
              label="Terlambat"
              color="yellow"
              icon="⏰"
            />
            <StatCard
              value={data.stats.absent}
              label="Alfa"
              color="red"
              icon="✕"
            />
          </View>
        </View>
      )}

      {/* Records List */}
      <FlatList
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={handleRefresh} />}
        data={data?.records?.data || []}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Card variant="outlined" className="mb-2.5">
            <View className="flex-row justify-between items-center">
              <View className="flex-1 mr-3">
                <Text className="font-medium text-gray-900 dark:text-white text-sm">
                  {item.session.subject || item.session.type}
                </Text>
                <Text className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  {item.scanned_at
                    ? new Date(item.scanned_at).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : '-'}
                </Text>
              </View>
              <Badge
                label={statusLabel[item.status] || item.status}
                variant={statusVariant[item.status] || 'default'}
                size="sm"
              />
            </View>
          </Card>
        )}
        ListEmptyComponent={
          <EmptyState
            title="Belum Ada Riwayat"
            description="Riwayat absensimu akan muncul di sini setelah melakukan scan QR"
            icon="📋"
          />
        }
      />
    </View>
  );
}
