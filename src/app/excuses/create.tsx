import { useState } from 'react';
import { View, Text, ScrollView, Alert, Pressable } from 'react-native';
import { router } from 'expo-router';

import { useCreateExcuse } from '@/hooks/use-excuses';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const excuseTypes = [
  { value: 'sick' as const, label: 'Sakit', icon: '🤒', description: 'Tidak hadir karena sakit' },
  { value: 'permission' as const, label: 'Izin', icon: '📝', description: 'Izin keperluan lain' },
  { value: 'other' as const, label: 'Lainnya', icon: '📌', description: 'Alasan lainnya' },
];

export default function CreateExcuseScreen() {
  const createExcuse = useCreateExcuse();
  const [type, setType] = useState<'sick' | 'permission' | 'other'>('sick');
  const [reason, setReason] = useState('');
  const [excusedDate, setExcusedDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = async () => {
    if (!reason.trim()) {
      Alert.alert('Error', 'Alasan harus diisi.');
      return;
    }

    try {
      await createExcuse.mutateAsync({
        type,
        reason: reason.trim(),
        excused_date: excusedDate,
      });
      Alert.alert('Berhasil', 'Izin berhasil diajukan.', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (err: any) {
      Alert.alert('Gagal', err.response?.data?.message || 'Gagal mengajukan izin.');
    }
  };

  return (
    <ScrollView className="flex-1 bg-gray-50 dark:bg-gray-950" showsVerticalScrollIndicator={false}>
      <View className="px-4 py-6">
        {/* Header */}
        <View className="mb-6">
          <Text className="text-xl font-bold text-gray-900 dark:text-white">Ajukan Izin</Text>
          <Text className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Pilih jenis izin dan isi alasan
          </Text>
        </View>

        {/* Type Selection */}
        <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Jenis Izin
        </Text>
        <View className="gap-2.5 mb-6">
          {excuseTypes.map((item) => (
            <Pressable
              key={item.value}
              onPress={() => setType(item.value)}
              style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
            >
              <Card
                variant={type === item.value ? 'default' : 'outlined'}
                className={type === item.value ? 'border-2 border-blue-500' : ''}
              >
                <View className="flex-row items-center">
                  <View
                    className={`w-12 h-12 rounded-xl items-center justify-center mr-3 ${
                      type === item.value
                        ? 'bg-blue-50 dark:bg-blue-900/20'
                        : 'bg-gray-100 dark:bg-gray-800'
                    }`}
                  >
                    <Text className="text-2xl">{item.icon}</Text>
                  </View>
                  <View className="flex-1">
                    <Text
                      className={`text-sm font-semibold ${
                        type === item.value
                          ? 'text-blue-600 dark:text-blue-400'
                          : 'text-gray-900 dark:text-white'
                      }`}
                    >
                      {item.label}
                    </Text>
                    <Text className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {item.description}
                    </Text>
                  </View>
                  {type === item.value && (
                    <View className="w-6 h-6 rounded-full bg-blue-500 items-center justify-center">
                      <Text className="text-white text-xs">✓</Text>
                    </View>
                  )}
                </View>
              </Card>
            </Pressable>
          ))}
        </View>

        {/* Date */}
        <Input
          label="Tanggal"
          placeholder="YYYY-MM-DD"
          value={excusedDate}
          onChangeText={setExcusedDate}
          hint="Format: Tahun-Bulan-Hari"
        />

        {/* Reason */}
        <Input
          label="Alasan"
          placeholder="Jelaskan alasan izin secara detail..."
          value={reason}
          onChangeText={setReason}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          className="min-h-[120px]"
        />

        {/* Submit */}
        <Button
          title="Ajukan Izin"
          onPress={handleSubmit}
          loading={createExcuse.isPending}
          size="lg"
          className="mt-4 mb-8"
        />
      </View>
    </ScrollView>
  );
}
