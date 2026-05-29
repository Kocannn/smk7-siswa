import { View, Text, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

import { useExcuseDetail } from '@/hooks/use-excuses';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

const typeLabel: Record<string, string> = {
  sick: 'Sakit',
  permission: 'Izin',
  other: 'Lainnya',
};

const typeIcon: Record<string, string> = {
  sick: '🤒',
  permission: '📝',
  other: '📌',
};

const statusVariant: Record<string, 'success' | 'warning' | 'danger'> = {
  approved: 'success',
  pending: 'warning',
  rejected: 'danger',
};

const statusLabel: Record<string, string> = {
  approved: 'Disetujui',
  pending: 'Menunggu',
  rejected: 'Ditolak',
};

export default function ExcuseDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: excuse, isLoading } = useExcuseDetail(Number(id));

  if (isLoading) return <LoadingSpinner />;

  if (!excuse) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-gray-950">
        <View className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 items-center justify-center mb-4">
          <Text className="text-3xl">📋</Text>
        </View>
        <Text className="text-gray-500 dark:text-gray-400 font-medium">Izin tidak ditemukan</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-50 dark:bg-gray-950" showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View className="bg-blue-500 pt-6 pb-8 px-6">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <View className="w-12 h-12 rounded-xl bg-white/20 items-center justify-center mr-3">
              <Text className="text-2xl">{typeIcon[excuse.type] || '📋'}</Text>
            </View>
            <View>
              <Text className="text-xl font-bold text-white">
                {typeLabel[excuse.type] || excuse.type}
              </Text>
              <Text className="text-blue-100 text-sm mt-0.5">
                {new Date(excuse.excused_date).toLocaleDateString('id-ID', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </Text>
            </View>
          </View>
          <Badge label={statusLabel[excuse.status]} variant={statusVariant[excuse.status]} />
        </View>
      </View>

      <View className="px-4 -mt-4">
        {/* Main Info Card */}
        <Card variant="elevated" className="mb-4">
          <View className="gap-4">
            <View>
              <View className="flex-row items-center mb-1.5">
                <Text className="text-xs text-gray-500 dark:text-gray-400">📅</Text>
                <Text className="text-xs text-gray-500 dark:text-gray-400 ml-1.5">Tanggal Izin</Text>
              </View>
              <Text className="text-sm font-medium text-gray-900 dark:text-white">
                {new Date(excuse.excused_date).toLocaleDateString('id-ID', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </Text>
            </View>

            <View className="h-px bg-gray-100 dark:bg-gray-800" />

            <View>
              <View className="flex-row items-center mb-1.5">
                <Text className="text-xs text-gray-500 dark:text-gray-400">📝</Text>
                <Text className="text-xs text-gray-500 dark:text-gray-400 ml-1.5">Alasan</Text>
              </View>
              <Text className="text-sm text-gray-900 dark:text-white leading-5">
                {excuse.reason}
              </Text>
            </View>

            <View className="h-px bg-gray-100 dark:bg-gray-800" />

            <View>
              <View className="flex-row items-center mb-1.5">
                <Text className="text-xs text-gray-500 dark:text-gray-400">🕐</Text>
                <Text className="text-xs text-gray-500 dark:text-gray-400 ml-1.5">Diajukan</Text>
              </View>
              <Text className="text-sm text-gray-900 dark:text-white">
                {new Date(excuse.created_at).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
            </View>
          </View>
        </Card>

        {/* Review Info */}
        {excuse.reviewed_by && (
          <View>
            <Text className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2 px-1">
              Review
            </Text>
            <Card variant="elevated">
              <View className="flex-row items-center mb-3">
                <View className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 items-center justify-center mr-3">
                  <Text className="text-sm font-bold text-blue-600 dark:text-blue-400">
                    {excuse.reviewed_by.name?.charAt(0)?.toUpperCase() || '?'}
                  </Text>
                </View>
                <View>
                  <Text className="text-sm font-medium text-gray-900 dark:text-white">
                    {excuse.reviewed_by.name}
                  </Text>
                  <Text className="text-xs text-gray-500 dark:text-gray-400">Guru</Text>
                </View>
              </View>
              {excuse.review_notes && (
                <View className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3.5">
                  <Text className="text-xs text-gray-500 dark:text-gray-400 mb-1">Catatan</Text>
                  <Text className="text-sm text-gray-900 dark:text-white leading-5">
                    {excuse.review_notes}
                  </Text>
                </View>
              )}
            </Card>
          </View>
        )}
      </View>
      <View className="h-8" />
    </ScrollView>
  );
}
