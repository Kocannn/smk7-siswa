import { useState } from 'react';
import { View, Text, Pressable, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Link } from 'expo-router';

import { useAuth } from '@/hooks/use-auth';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function RegisterScreen() {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setErrors({});
    setLoading(true);
    try {
      await register({ name, email, password, password_confirmation: passwordConfirmation });
    } catch (err: any) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        setErrors({ general: [err.response?.data?.message || 'Terjadi kesalahan.'] });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View className="flex-1 bg-white dark:bg-gray-950">
          {/* Header / Branding */}
          <View className="bg-blue-500 pt-14 pb-10 px-8 rounded-b-[32px]">
            <View className="items-center">
              <View className="w-14 h-14 bg-white/20 rounded-2xl items-center justify-center mb-3">
                <Text className="text-2xl font-bold text-white">S7</Text>
              </View>
              <Text className="text-xl font-bold text-white">Buat Akun Baru</Text>
              <Text className="text-blue-100 text-sm mt-1">Daftar untuk mengakses sistem</Text>
            </View>
          </View>

          {/* Form Section */}
          <View className="px-8 pt-8">
            {/* Errors */}
            {errors.general ? (
              <View className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3.5 mb-5">
                <Text className="text-red-600 dark:text-red-400 text-sm text-center">
                  {errors.general[0]}
                </Text>
              </View>
            ) : null}

            {/* Form */}
            <Input
              label="Nama Lengkap"
              placeholder="Masukkan nama"
              value={name}
              onChangeText={setName}
              autoComplete="name"
              error={errors.name?.[0]}
            />
            <Input
              label="Email"
              placeholder="nama@email.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              error={errors.email?.[0]}
            />
            <Input
              label="Password"
              placeholder="Minimal 8 karakter"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoComplete="new-password"
              error={errors.password?.[0]}
              hint="Gunakan kombinasi huruf dan angka"
            />
            <Input
              label="Konfirmasi Password"
              placeholder="Ulangi password"
              value={passwordConfirmation}
              onChangeText={setPasswordConfirmation}
              secureTextEntry
              autoComplete="new-password"
            />

            <Button title="Daftar" onPress={handleRegister} loading={loading} className="mt-2" />

            {/* Login link */}
            <View className="flex-row justify-center mt-8 mb-8">
              <Text className="text-gray-500 dark:text-gray-400 text-sm">Sudah punya akun? </Text>
              <Link href="/(auth)/login" asChild>
                <Pressable>
                  <Text className="text-blue-500 font-semibold text-sm">Masuk di sini</Text>
                </Pressable>
              </Link>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
