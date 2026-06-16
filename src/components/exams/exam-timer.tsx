import { useEffect, useState, useRef } from 'react';
import { Animated, Text, View } from 'react-native';

interface ExamTimerProps {
  startedAt: string;
  durationMinutes: number;
  onTimeUp: () => void;
}

export function ExamTimer({ startedAt, durationMinutes, onTimeUp }: ExamTimerProps) {
  const [secondsLeft, setSecondsLeft] = useState(() => {
    const start = new Date(startedAt).getTime();
    const end = start + durationMinutes * 60 * 1000;
    return Math.max(0, Math.floor((end - Date.now()) / 1000));
  });
  const onTimeUpRef = useRef(onTimeUp);
  onTimeUpRef.current = onTimeUp;

  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Pulse animation when < 5 min
  useEffect(() => {
    if (secondsLeft <= 300 && secondsLeft > 0) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 0.5, duration: 600, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
        ])
      );
      pulse.start();
      return () => pulse.stop();
    } else {
      pulseAnim.setValue(1);
    }
  }, [secondsLeft, pulseAnim]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onTimeUpRef.current();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [startedAt, durationMinutes]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const timeString = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const isWarning = secondsLeft <= 300 && secondsLeft > 60;
  const isCritical = secondsLeft <= 60;

  const colorClass = isCritical
    ? 'text-red-500'
    : isWarning
      ? 'text-amber-500'
      : 'text-emerald-500';

  const bgClass = isCritical
    ? 'bg-red-50 dark:bg-red-900/30'
    : isWarning
      ? 'bg-amber-50 dark:bg-amber-900/30'
      : 'bg-emerald-50 dark:bg-emerald-900/30';

  return (
    <Animated.View
      className={`rounded-xl px-3 py-1.5 ${bgClass}`}
      style={{ opacity: secondsLeft <= 300 ? pulseAnim : 1 }}
    >
      <Text className={`text-lg font-bold tabular-nums ${colorClass}`}>
        {timeString}
      </Text>
    </Animated.View>
  );
}
