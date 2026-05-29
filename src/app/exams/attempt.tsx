import { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, FlatList, Alert, Pressable } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';

import { useExamAttempt, useSaveResponse, useSubmitExam } from '@/hooks/use-exams';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import type { Question } from '@/types/exam';

export default function ExamAttemptScreen() {
  const { examId, attemptId } = useLocalSearchParams<{ examId: string; attemptId: string }>();
  const numExamId = Number(examId);
  const numAttemptId = Number(attemptId);

  const { data, isLoading } = useExamAttempt(numExamId, numAttemptId);
  const saveResponse = useSaveResponse();
  const submitExam = useSubmitExam();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number | null>>({});
  const [essayAnswers, setEssayAnswers] = useState<Record<number, string>>({});
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const saveTimers = useRef<Record<number, ReturnType<typeof setTimeout>>>({});

  // Initialize from existing responses
  useEffect(() => {
    if (data?.questions) {
      const answers: Record<number, number | null> = {};
      const essays: Record<number, string> = {};
      data.questions.forEach((q) => {
        if (q.response) {
          if (q.response.answer_option_id) {
            answers[q.id] = q.response.answer_option_id;
          }
          if (q.response.response_text) {
            essays[q.id] = q.response.response_text;
          }
        }
      });
      setSelectedAnswers(answers);
      setEssayAnswers(essays);
    }
  }, [data]);

  // Timer
  useEffect(() => {
    if (!data?.exam?.duration_minutes || !data?.attempt?.started_at) return;

    const started = new Date(data.attempt.started_at).getTime();
    const durationMs = data.exam.duration_minutes * 60 * 1000;
    const endTime = started + durationMs;

    const interval = setInterval(() => {
      const now = Date.now();
      const remaining = Math.max(0, endTime - now);
      setTimeLeft(remaining);

      if (remaining <= 0) {
        clearInterval(interval);
        handleSubmit(true);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [data]);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const getTimerColor = () => {
    if (timeLeft <= 60000) return 'bg-red-500'; // Last minute - red
    if (timeLeft <= 300000) return 'bg-amber-500'; // Last 5 minutes - amber
    return 'bg-white/20';
  };

  const debouncedSave = useCallback(
    (questionId: number, answerOptionId?: number | null, responseText?: string | null) => {
      if (saveTimers.current[questionId]) {
        clearTimeout(saveTimers.current[questionId]);
      }
      saveTimers.current[questionId] = setTimeout(() => {
        saveResponse.mutate({
          examId: numExamId,
          attemptId: numAttemptId,
          data: {
            question_id: questionId,
            answer_option_id: answerOptionId,
            response_text: responseText,
          },
        });
      }, 1000);
    },
    [numExamId, numAttemptId]
  );

  const handleSelectOption = (questionId: number, optionId: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionId }));
    debouncedSave(questionId, optionId);
  };

  const handleEssayChange = (questionId: number, text: string) => {
    setEssayAnswers((prev) => ({ ...prev, [questionId]: text }));
    debouncedSave(questionId, null, text);
  };

  const handleSubmit = (autoSubmit = false) => {
    const doSubmit = async () => {
      try {
        await submitExam.mutateAsync({ examId: numExamId, attemptId: numAttemptId });
        Alert.alert('Berhasil', 'Ujian berhasil dikumpulkan!', [
          { text: 'OK', onPress: () => router.back() },
        ]);
      } catch (err: any) {
        Alert.alert('Gagal', err.response?.data?.message || 'Gagal mengumpulkan ujian.');
      }
    };

    if (autoSubmit) {
      doSubmit();
      return;
    }

    Alert.alert('Kumpulkan Ujian', 'Yakin ingin mengumpulkan ujian? Jawaban tidak bisa diubah lagi.', [
      { text: 'Batal', style: 'cancel' },
      { text: 'Kumpulkan', style: 'destructive', onPress: doSubmit },
    ]);
  };

  if (isLoading || !data) return <LoadingSpinner message="Memuat soal..." />;

  const questions = data.questions;
  const currentQuestion = questions[currentIndex];
  const answeredCount = Object.keys(selectedAnswers).length + Object.keys(essayAnswers).length;

  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <View className="bg-blue-500 pt-12 pb-4 px-4">
        <View className="flex-row justify-between items-center">
          <View className="flex-1 mr-3">
            <Text className="text-white font-semibold text-lg" numberOfLines={1}>
              {data.exam.title}
            </Text>
          </View>
          <View className={`${getTimerColor()} px-3 py-2 rounded-xl`}>
            <Text className="text-white font-mono font-bold text-base">{formatTime(timeLeft)}</Text>
          </View>
        </View>
        <View className="flex-row items-center justify-between mt-2">
          <Text className="text-white/80 text-sm">
            Soal {currentIndex + 1} dari {questions.length}
          </Text>
          <Text className="text-white/60 text-xs">
            {answeredCount} terjawab
          </Text>
        </View>
        {/* Progress bar */}
        <View className="h-1.5 bg-white/20 rounded-full mt-2.5">
          <View
            className="h-1.5 bg-white rounded-full"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          />
        </View>
      </View>

      {/* Question */}
      <FlatList
        className="flex-1"
        contentContainerStyle={{ padding: 16 }}
        data={[currentQuestion]}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View>
            {/* Question prompt */}
            <Card variant="elevated" className="mb-5">
              <View className="flex-row items-center mb-3">
                <View className="bg-blue-50 dark:bg-blue-900/20 px-2.5 py-1 rounded-lg">
                  <Text className="text-xs font-medium text-blue-600 dark:text-blue-400">
                    Soal {currentIndex + 1}
                  </Text>
                </View>
                <Text className="text-xs text-gray-400 dark:text-gray-500 ml-2">
                  {item.points} poin
                </Text>
              </View>
              <Text className="text-base text-gray-900 dark:text-white leading-6">
                {item.prompt}
              </Text>
            </Card>

            {/* Answer options */}
            {item.type === 'multiple_choice' ? (
              <View className="gap-2.5">
                {item.answer_options.map((option, index) => {
                  const isSelected = selectedAnswers[item.id] === option.id;
                  const optionLetter = String.fromCharCode(65 + index); // A, B, C, D
                  return (
                    <Pressable
                      key={option.id}
                      onPress={() => handleSelectOption(item.id, option.id)}
                      style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
                      className={`flex-row items-center p-4 rounded-xl border-2 ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900'
                      }`}
                    >
                      <View
                        className={`w-8 h-8 rounded-lg items-center justify-center mr-3 ${
                          isSelected
                            ? 'bg-blue-500'
                            : 'bg-gray-100 dark:bg-gray-800'
                        }`}
                      >
                        <Text
                          className={`text-sm font-bold ${
                            isSelected
                              ? 'text-white'
                              : 'text-gray-500 dark:text-gray-400'
                          }`}
                        >
                          {optionLetter}
                        </Text>
                      </View>
                      <Text
                        className={`flex-1 text-sm ${
                          isSelected
                            ? 'text-blue-700 dark:text-blue-300 font-medium'
                            : 'text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {option.option_text}
                      </Text>
                      {isSelected && (
                        <View className="w-5 h-5 rounded-full bg-blue-500 items-center justify-center ml-2">
                          <Text className="text-white text-xs">✓</Text>
                        </View>
                      )}
                    </Pressable>
                  );
                })}
              </View>
            ) : (
              <Card variant="outlined">
                <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Jawaban Essay
                </Text>
                <View className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3.5 min-h-[120px]">
                  <Text
                    className="text-base text-gray-900 dark:text-white"
                    onPress={() => {
                      // For a proper implementation, use a TextInput here
                    }}
                  >
                    {essayAnswers[item.id] || 'Ketik jawaban di sini...'}
                  </Text>
                </View>
              </Card>
            )}
          </View>
        )}
      />

      {/* Navigation */}
      <View className="flex-row gap-3 px-4 pb-6 pt-3 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <Button
          title="Sebelumnya"
          variant="secondary"
          onPress={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
          disabled={currentIndex === 0}
          className="flex-1"
        />
        {currentIndex < questions.length - 1 ? (
          <Button
            title="Selanjutnya"
            onPress={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
            className="flex-1"
          />
        ) : (
          <Button
            title="Kumpulkan"
            variant="danger"
            onPress={() => handleSubmit()}
            loading={submitExam.isPending}
            className="flex-1"
          />
        )}
      </View>
    </View>
  );
}
