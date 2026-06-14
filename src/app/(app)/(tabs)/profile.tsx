import { View, Text, ScrollView, Alert, Pressable } from 'react-native';
import { router } from 'expo-router';

import { useAuth } from '@/hooks/use-auth';
import { useProfile } from '@/hooks/use-profile';
import { useThemeMode } from '../../_layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

type ThemeMode = 'light' | 'dark' | 'system';

const themeOptions: { value: ThemeMode; label: string; icon: string }[] = [
  { value: 'light', label: 'Terang', icon: '☀️' },
  { value: 'dark', label: 'Gelap', icon: '🌙' },
  { value: 'system', label: 'Otomatis', icon: '⚙️' },
];

export default function ProfileScreen() {
  const { logout } = useAuth();
  const { data: profile, isLoading } = useProfile();
  const { mode: themeMode, setMode: setThemeMode } = useThemeMode();

  const handleLogout = () => {
    Alert.alert('Keluar', 'Yakin ingin keluar dari akun?', [
      { text: 'Batal', style: 'cancel' },
      { text: 'Keluar', style: 'destructive', onPress: logout },
    ]);
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <ScrollView
      className="flex-1 bg-gray-50 dark:bg-gray-950"
      showsVerticalScrollIndicator={false}
    >
      {/* Profile Header */}
      <View className="bg-blue-500 pt-8 pb-12 px-6 rounded-b-[32px]">
        <View className="items-center">
          <View className="w-20 h-20 rounded-full bg-white/20 items-center justify-center mb-3 border-2 border-white/30">
            <Text className="text-3xl text-white font-bold">
              {profile?.name?.charAt(0)?.toUpperCase() || '?'}
            </Text>
          </View>
          <Text className="text-xl font-bold text-white">{profile?.name}</Text>
          <Text className="text-blue-100 text-sm mt-1">{profile?.email}</Text>
        </View>
      </View>

      {/* Content */}
      <View className="px-4 -mt-6">
        {/* Info Cards */}
        <Card variant="elevated" className="mb-3">
          <View className="flex-row items-center">
            <View className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 items-center justify-center mr-3">
              <Text className="text-lg">👤</Text>
            </View>
            <View className="flex-1">
              <Text className="text-xs text-gray-500 dark:text-gray-400">Role</Text>
              <Text className="text-sm font-medium text-gray-900 dark:text-white capitalize mt-0.5">
                {profile?.role === 'student' ? 'Siswa' : profile?.role}
              </Text>
            </View>
          </View>
        </Card>

        {profile?.school_class && (
          <Card variant="elevated" className="mb-3">
            <View className="flex-row items-center">
              <View className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 items-center justify-center mr-3">
                <Text className="text-lg">🏫</Text>
              </View>
              <View className="flex-1">
                <Text className="text-xs text-gray-500 dark:text-gray-400">Kelas</Text>
                <Text className="text-sm font-medium text-gray-900 dark:text-white mt-0.5">
                  {profile.school_class.name}
                </Text>
                {profile.school_class.academic_year && (
                  <Text className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Tahun Ajaran {profile.school_class.academic_year}
                  </Text>
                )}
              </View>
            </View>
          </Card>
        )}

        {/* Theme Settings */}
        <Text className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2 mt-4 px-1">
          Tampilan
        </Text>

        <Card variant="elevated" className="mb-3">
          <View className="flex-row items-center mb-3">
            <View className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-900/20 items-center justify-center mr-3">
              <Text className="text-lg">🎨</Text>
            </View>
            <View>
              <Text className="text-sm font-medium text-gray-900 dark:text-white">Mode Tampilan</Text>
              <Text className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Pilih tema aplikasi
              </Text>
            </View>
          </View>
          <View className="flex-row gap-2">
            {themeOptions.map((option) => (
              <Pressable
                key={option.value}
                onPress={() => setThemeMode(option.value)}
                className={`flex-1 items-center py-3 rounded-xl border-2 ${themeMode === option.value
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
                  }`}
              >
                <Text className="text-xl mb-1">{option.icon}</Text>
                <Text
                  className={`text-xs font-medium ${themeMode === option.value
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-400'
                    }`}
                >
                  {option.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </Card>

        {/* Logout */}
        <View className="mt-6 mb-8">
          <Button title="Keluar" variant="danger" onPress={handleLogout} />
        </View>
      </View>
    </ScrollView>
  );
}
