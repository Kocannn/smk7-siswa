import { useState, useEffect } from 'react';
import { View, Text, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';

import { useScanAttendance } from '@/hooks/use-attendance';
import { Button } from '@/components/ui/button';

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const scanMutation = useScanAttendance();

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, [permission]);

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    if (scanned || scanMutation.isPending) return;
    setScanned(true);

    try {
      const result = await scanMutation.mutateAsync(data);
      Alert.alert(
        'Berhasil',
        result.message,
        [{ text: 'OK', onPress: () => setScanned(false) }]
      );
    } catch (err: any) {
      Alert.alert(
        'Gagal',
        err.response?.data?.message || 'QR tidak valid atau sudah kedaluwarsa.',
        [{ text: 'Coba Lagi', onPress: () => setScanned(false) }]
      );
    }
  };

  if (!permission?.granted) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-gray-950 px-8">
        <View className="w-20 h-20 rounded-full bg-blue-50 dark:bg-blue-900/20 items-center justify-center mb-5">
          <Text className="text-4xl">📷</Text>
        </View>
        <Text className="text-xl font-bold text-gray-900 dark:text-white text-center mb-2">
          Izin Kamera Diperlukan
        </Text>
        <Text className="text-sm text-gray-500 dark:text-gray-400 text-center mb-8 leading-5 max-w-[280px]">
          Aplikasi memerlukan akses kamera untuk memindai QR code absensi
        </Text>
        <Button title="Beri Izin Kamera" onPress={requestPermission} size="lg" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      <CameraView
        style={{ flex: 1 }}
        facing="back"
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ['qr'],
        }}
      />
      {/* Overlay */}
      <View className="absolute inset-0">
        {/* Dark overlay with transparent center */}
        <View className="flex-1 items-center justify-center">
          {/* Top overlay */}
          <View className="absolute top-0 left-0 right-0 h-[25%] bg-black/60" />

          {/* Left overlay */}
          <View className="absolute top-[25%] bottom-[25%] left-0 w-[15%] bg-black/60" />

          {/* Right overlay */}
          <View className="absolute top-[25%] bottom-[25%] right-0 w-[15%] bg-black/60" />

          {/* Bottom overlay */}
          <View className="absolute bottom-0 left-0 right-0 h-[25%] bg-black/60" />

          {/* Scan frame */}
          <View className="w-64 h-64 relative">
            {/* Corner borders */}
            <View className="absolute top-0 left-0 w-8 h-8 border-l-4 border-t-4 border-white rounded-tl-xl" />
            <View className="absolute top-0 right-0 w-8 h-8 border-r-4 border-t-4 border-white rounded-tr-xl" />
            <View className="absolute bottom-0 left-0 w-8 h-8 border-l-4 border-b-4 border-white rounded-bl-xl" />
            <View className="absolute bottom-0 right-0 w-8 h-8 border-r-4 border-b-4 border-white rounded-br-xl" />
          </View>

          {/* Instructions */}
          <View className="mt-6 bg-black/50 px-5 py-2.5 rounded-full">
            <Text className="text-white text-sm font-medium">
              Arahkan kamera ke QR code
            </Text>
          </View>
        </View>
      </View>

      {/* Status */}
      {scanMutation.isPending && (
        <View className="absolute bottom-12 left-0 right-0 items-center">
          <View className="bg-blue-500 px-8 py-3.5 rounded-full shadow-lg">
            <Text className="text-white font-semibold">Memproses...</Text>
          </View>
        </View>
      )}
    </View>
  );
}
