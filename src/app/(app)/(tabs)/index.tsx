import { View, Text, FlatList, RefreshControl, Pressable } from 'react-native';

import { useAuth } from '@/hooks/use-auth';
import { useDashboard } from '@/hooks/use-dashboard';
import { Card } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Badge } from '@/components/ui/badge';
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

export default function DashboardScreen() {
  const { user } = useAuth();
  const { data, isLoading, refetch, isRefetching } = useDashboard();

  if (isLoading) return <LoadingSpinner />;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 11) return 'Selamat Pagi';
    if (hour < 15) return 'Selamat Siang';
    if (hour < 18) return 'Selamat Sore';
    return 'Selamat Malam';
  };

  return (
    <FlatList
      className="bg-gray-50 dark:bg-gray-950"
      contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
      refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
      data={data?.recent_records || []}
      keyExtractor={(item) => item.id.toString()}
      ListHeaderComponent={
        <View>
          {/* Greeting */}
          <View className="mb-6">
            <Text className="text-sm text-gray-500 dark:text-gray-400">{getGreeting()},</Text>
            <Text className="text-2xl font-bold text-gray-900 dark:text-white mt-0.5">
              {user?.name}
            </Text>
          </View>

          {/* Summary Cards */}
          <View className="flex-row gap-3 mb-6">
            <StatCard
              value={data?.summary.total_attendance || 0}
              label="Total Absensi"
              color="blue"
              icon="📊"
            />
            <StatCard
              value={data?.summary.today_attendance || 0}
              label="Hari Ini"
              color="green"
              icon="✓"
            />
          </View>

          {/* Recent Records Header */}
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-base font-semibold text-gray-900 dark:text-white">
              Riwayat Terbaru
            </Text>
          </View>
        </View>
      }
      renderItem={({ item }) => (
        <Card variant="outlined" className="mb-2.5">
          <View className="flex-row justify-between items-center">
            <View className="flex-1 mr-3">
              <Text className="font-medium text-gray-900 dark:text-white text-sm">
                {item.subject || item.session_type}
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
  );
}
