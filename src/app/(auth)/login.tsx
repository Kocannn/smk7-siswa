import { useState } from 'react';
import { View, Text, Pressable, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Link } from 'expo-router';

import { useAuth } from '@/hooks/use-auth';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      await login({ email, password });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Terjadi kesalahan. Coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View className="flex-1 bg-white dark:bg-gray-950">
          {/* Header / Branding */}
          <View className="bg-blue-500 pt-16 pb-12 px-8 rounded-b-[32px]">
            <View className="items-center">
              <View className="w-16 h-16 bg-white/20 rounded-2xl items-center justify-center mb-4">
                <Text className="text-3xl font-bold text-white">S7</Text>
              </View>
              <Text className="text-2xl font-bold text-white">SMK Negeri 7</Text>
              <Text className="text-blue-100 text-sm mt-1">Sistem Informasi Akademik</Text>
            </View>
          </View>

          {/* Form Section */}
          <View className="px-8 pt-8">
            <Text className="text-xl font-bold text-gray-900 dark:text-white mb-1">
              Selamat Datang
            </Text>
            <Text className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Masuk ke akunmu untuk melanjutkan
            </Text>

            {/* Error */}
            {error ? (
              <View className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3.5 mb-5">
                <Text className="text-red-600 dark:text-red-400 text-sm text-center">{error}</Text>
              </View>
            ) : null}

            {/* Form */}
            <Input
              label="Email"
              placeholder="nama@email.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
            <Input
              label="Password"
              placeholder="Masukkan password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoComplete="password"
            />

            <Button title="Masuk" onPress={handleLogin} loading={loading} className="mt-2" />

            {/* Register link */}
            <View className="flex-row justify-center mt-8 mb-8">
              <Text className="text-gray-500 dark:text-gray-400 text-sm">Belum punya akun? </Text>
              <Link href="/(auth)/register" asChild>
                <Pressable>
                  <Text className="text-blue-500 font-semibold text-sm">Daftar sekarang</Text>
                </Pressable>
              </Link>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
