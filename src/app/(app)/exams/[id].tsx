import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, BackHandler, Pressable, Text, View } from 'react-native';

import { ExamTimer } from '@/components/exams/exam-timer';
import { QuestionCard } from '@/components/exams/question-card';
import { QuestionNavigator } from '@/components/exams/question-navigator';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useExamAttempt, useSaveResponse, useSubmitExam } from '@/hooks/use-exams';
import type { Question } from '@/types/exam';

export default function ExamPage() {
  const { id, attemptId } = useLocalSearchParams<{ id: string; attemptId: string }>();
  const examId = Number(id);
  const attemptIdNum = Number(attemptId);
  const router = useRouter();

  const { data, isLoading, error } = useExamAttempt(examId, attemptIdNum);
  const saveMutation = useSaveResponse();
  const submitMutation = useSubmitExam();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState<Map<number, { optionId?: number | null; text?: string }>>(new Map());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [navigatorVisible, setNavigatorVisible] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  const saveTimersRef = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());
  const lastSavedRef = useRef<Map<number, { optionId?: number | null; text?: string }>>(new Map());

  // Load existing responses on mount
  useEffect(() => {
    if (data?.attempt.responses) {
      const map = new Map<number, { optionId?: number | null; text?: string }>();
      for (const r of data.attempt.responses) {
        map.set(r.question_id, {
          optionId: r.answer_option_id,
          text: r.response_text ?? undefined,
        });
      }
      setResponses(map);
      lastSavedRef.current = new Map(map);
    }
  }, [data]);

  // Back handler
  useEffect(() => {
    const handler = BackHandler.addEventListener('hardwareBackPress', () => {
      Alert.alert(
        'Keluar Ujian?',
        'Jawaban Anda sudah tersimpan otomatis. Anda dapat kembali melanjutkan nanti.',
        [
          { text: 'Batal', style: 'cancel' },
          { text: 'Keluar', style: 'destructive', onPress: () => router.back() },
        ]
      );
      return true;
    });
    return () => handler.remove();
  }, [router]);

  const questions: Question[] = data?.exam.questions ?? [];
  const currentQuestion = questions[currentIndex];

  // Save response to server
  const saveToServer = useCallback(
    (questionId: number, optionId?: number | null, text?: string | null) => {
      setSaveStatus('saving');
      saveMutation.mutate(
        {
          examId,
          attemptId: attemptIdNum,
          data: {
            question_id: questionId,
            answer_option_id: optionId ?? null,
            response_text: text ?? null,
          },
        },
        {
          onSuccess: () => {
            setSaveStatus('saved');
            setTimeout(() => setSaveStatus('idle'), 2000);
          },
          onError: () => {
            setSaveStatus('idle');
          },
        }
      );
    },
    [examId, attemptIdNum, saveMutation]
  );

  // Debounced save for MC (500ms) — per-question timer
  const debouncedSaveMC = useCallback(
    (questionId: number, optionId: number) => {
      const existing = saveTimersRef.current.get(questionId);
      if (existing) clearTimeout(existing);
      const timer = setTimeout(() => {
        saveToServer(questionId, optionId);
        saveTimersRef.current.delete(questionId);
      }, 500);
      saveTimersRef.current.set(questionId, timer);
    },
    [saveToServer]
  );

  // Debounced save for Essay (3s after pause) — per-question timer
  const debouncedSaveEssay = useCallback(
    (questionId: number, text: string) => {
      const existing = saveTimersRef.current.get(questionId);
      if (existing) clearTimeout(existing);
      const timer = setTimeout(() => {
        saveToServer(questionId, null, text);
        saveTimersRef.current.delete(questionId);
      }, 3000);
      saveTimersRef.current.set(questionId, timer);
    },
    [saveToServer]
  );

  // Flush all pending debounced saves immediately
  const flushPendingSaves = useCallback(() => {
    for (const [questionId, timer] of saveTimersRef.current) {
      clearTimeout(timer);
    }
    saveTimersRef.current.clear();
    // Save current responses immediately
    for (const [questionId, resp] of responses) {
      saveToServer(questionId, resp.optionId, resp.text);
    }
  }, [responses, saveToServer]);

  const handleSelectOption = useCallback(
    (optionId: number) => {
      if (!currentQuestion) return;
      setResponses((prev) => {
        const next = new Map(prev);
        next.set(currentQuestion.id, { optionId, text: undefined });
        return next;
      });
      debouncedSaveMC(currentQuestion.id, optionId);
    },
    [currentQuestion, debouncedSaveMC]
  );

  const handleChangeText = useCallback(
    (text: string) => {
      if (!currentQuestion) return;
      setResponses((prev) => {
        const next = new Map(prev);
        next.set(currentQuestion.id, { optionId: null, text });
        return next;
      });
      debouncedSaveEssay(currentQuestion.id, text);
    },
    [currentQuestion, debouncedSaveEssay]
  );

  const handleTimeUp = useCallback(() => {
    Alert.alert('Waktu Habis', 'Waktu ujian telah habis. Jawaban Anda akan dikumpulkan otomatis.', [
      {
        text: 'OK',
        onPress: () => {
          flushPendingSaves();
          setIsSubmitting(true);
          submitMutation.mutate(
            { examId, attemptId: attemptIdNum },
            {
              onSuccess: (result) => {
                router.replace({
                  pathname: '/(app)/exams/result',
                  params: { score: String(result.score ?? ''), examId: String(examId) },
                });
              },
              onError: () => {
                setIsSubmitting(false);
                Alert.alert('Gagal', 'Gagal mengumpulkan jawaban. Silakan coba lagi.');
              },
            }
          );
        },
      },
    ]);
  }, [examId, attemptIdNum, submitMutation, router, flushPendingSaves]);

  const handleSubmit = useCallback(() => {
    if (!questions.length) return;

    const answeredCount = responses.size;
    const unanswered = questions.length - answeredCount;

    const message =
      unanswered > 0
        ? `Anda belum menjawab ${unanswered} soal. Yakin ingin mengumpulkan?`
        : 'Semua soal sudah dijawab. Kumpulkan jawaban?';

    Alert.alert('Kumpulkan Jawaban?', message, [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Kumpulkan',
        style: 'destructive',
        onPress: () => {
          flushPendingSaves();
          setIsSubmitting(true);
          submitMutation.mutate(
            { examId, attemptId: attemptIdNum },
            {
              onSuccess: (result) => {
                router.replace({
                  pathname: '/(app)/exams/result',
                  params: { score: String(result.score ?? ''), examId: String(examId) },
                });
              },
              onError: () => {
                setIsSubmitting(false);
                Alert.alert('Gagal', 'Gagal mengumpulkan jawaban. Silakan coba lagi.');
              },
            }
          );
        },
      },
    ]);
  }, [questions, responses, examId, attemptIdNum, submitMutation, router]);

  if (isLoading) {
    return <LoadingSpinner message="Memuat ujian..." />;
  }

  if (error || !data) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-gray-950 p-6">
        <Text className="text-lg font-semibold text-red-500">Gagal memuat ujian</Text>
        <Text className="mt-2 text-center text-gray-500 dark:text-gray-400">
          Silakan coba lagi nanti
        </Text>
        <Button title="Kembali" variant="ghost" className="mt-4" onPress={() => router.back()} />
      </View>
    );
  }

  if (!currentQuestion) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-gray-950">
        <Text className="text-gray-500 dark:text-gray-400">Tidak ada soal</Text>
      </View>
    );
  }

  const currentResponse = responses.get(currentQuestion.id);
  const answeredIds = new Set(responses.keys());

  return (
    <View className="flex-1 bg-white dark:bg-gray-950">
      {/* Header */}
      <View className="flex-row items-center justify-between border-b border-gray-100 dark:border-gray-800 px-4 pb-3 pt-14">
        <ExamTimer
          startedAt={data.attempt.started_at}
          durationMinutes={data.exam.duration_minutes}
          onTimeUp={handleTimeUp}
        />

        <Pressable onPress={() => setNavigatorVisible(true)}>
          <Text className="text-base font-semibold text-gray-900 dark:text-white">
            Soal {currentIndex + 1}/{questions.length}
          </Text>
        </Pressable>

        <Pressable onPress={() => setNavigatorVisible(true)}>
          <View className="rounded-lg bg-gray-100 dark:bg-gray-800 px-3 py-1.5">
            <Text className="text-sm font-medium text-gray-700 dark:text-gray-300">Navigasi</Text>
          </View>
        </Pressable>
      </View>

      {/* Save indicator */}
      {saveStatus !== 'idle' && (
        <View className="px-4 py-1.5">
          <Text
            className={`text-xs font-medium ${
              saveStatus === 'saving' ? 'text-amber-500' : 'text-emerald-500'
            }`}
          >
            {saveStatus === 'saving' ? 'Menyimpan...' : 'Tersimpan'}
          </Text>
        </View>
      )}

      {/* Question body */}
      <View className="flex-1 px-4 pt-4">
        <QuestionCard
          question={currentQuestion}
          selectedOptionId={currentResponse?.optionId}
          responseText={currentResponse?.text}
          onSelectOption={handleSelectOption}
          onChangeText={handleChangeText}
        />
      </View>

      {/* Footer */}
      <View className="flex-row items-center justify-between border-t border-gray-100 dark:border-gray-800 px-4 pb-8 pt-4">
        <Button
          title="Sebelumnya"
          variant="ghost"
          size="sm"
          disabled={currentIndex === 0}
          onPress={() => setCurrentIndex((i) => Math.max(0, i - 1))}
        />

        <Button
          title="Kumpulkan"
          variant="danger"
          size="sm"
          loading={isSubmitting}
          disabled={isSubmitting}
          onPress={handleSubmit}
        />

        <Button
          title="Berikutnya"
          variant="ghost"
          size="sm"
          disabled={currentIndex >= questions.length - 1}
          onPress={() => setCurrentIndex((i) => Math.min(questions.length - 1, i + 1))}
        />
      </View>

      {/* Question Navigator Modal */}
      <QuestionNavigator
        visible={navigatorVisible}
        total={questions.length}
        currentIndex={currentIndex}
        answeredIds={answeredIds}
        questionIds={questions.map((q) => q.id)}
        onSelect={setCurrentIndex}
        onClose={() => setNavigatorVisible(false)}
      />
    </View>
  );
}
