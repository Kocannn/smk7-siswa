import { Modal, Pressable, Text, View } from 'react-native';

interface QuestionNavigatorProps {
  visible: boolean;
  total: number;
  currentIndex: number;
  answeredIds: Set<number>;
  questionIds: number[];
  onSelect: (index: number) => void;
  onClose: () => void;
}

export function QuestionNavigator({
  visible,
  total,
  currentIndex,
  answeredIds,
  questionIds,
  onSelect,
  onClose,
}: QuestionNavigatorProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable
        className="flex-1 items-center justify-center bg-black/50"
        onPress={onClose}
      >
        <Pressable
          className="w-[90%] max-w-md rounded-2xl bg-white dark:bg-gray-900 p-5"
          onPress={(e) => e.stopPropagation()}
        >
          <Text className="mb-4 text-center text-lg font-bold text-gray-900 dark:text-white">
            Navigasi Soal
          </Text>

          <View className="flex-row flex-wrap gap-2">
            {questionIds.map((qId, index) => {
              const isActive = index === currentIndex;
              const isAnswered = answeredIds.has(qId);

              let bgClass = 'bg-gray-200 dark:bg-gray-700';
              let textClass = 'text-gray-600 dark:text-gray-300';
              if (isActive) {
                bgClass = 'bg-blue-500';
                textClass = 'text-white';
              } else if (isAnswered) {
                bgClass = 'bg-emerald-500';
                textClass = 'text-white';
              }

              return (
                <Pressable
                  key={qId}
                  onPress={() => {
                    onSelect(index);
                    onClose();
                  }}
                  className={`h-11 w-11 items-center justify-center rounded-lg ${bgClass}`}
                >
                  <Text className={`text-sm font-bold ${textClass}`}>{index + 1}</Text>
                </Pressable>
              );
            })}
          </View>

          <View className="mt-4 flex-row justify-center gap-4">
            <View className="flex-row items-center gap-1.5">
              <View className="h-3 w-3 rounded-sm bg-emerald-500" />
              <Text className="text-xs text-gray-500 dark:text-gray-400">Dijawab</Text>
            </View>
            <View className="flex-row items-center gap-1.5">
              <View className="h-3 w-3 rounded-sm bg-gray-200 dark:bg-gray-700" />
              <Text className="text-xs text-gray-500 dark:text-gray-400">Belum</Text>
            </View>
            <View className="flex-row items-center gap-1.5">
              <View className="h-3 w-3 rounded-sm bg-blue-500" />
              <Text className="text-xs text-gray-500 dark:text-gray-400">Aktif</Text>
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
