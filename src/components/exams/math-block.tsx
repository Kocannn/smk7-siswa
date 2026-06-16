import { useEffect, useRef, useState } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

import type { ThemeColor } from '@/constants/theme';

interface MathBlockProps {
  latex: string;
  displayMode?: boolean;
}

export function MathBlock({ latex, displayMode = true }: MathBlockProps) {
  const [rendered, setRendered] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function render() {
      try {
        if (Platform.OS === 'web') {
          // On web, we can use KaTeX CSS rendering
          const katex = await import('katex');
          if (!cancelled && mountedRef.current) {
            const html = katex.default.renderToString(latex, {
              displayMode,
              throwOnError: false,
              strict: false,
            });
            setRendered(html);
          }
        } else {
          // On native, try react-native-katex
          try {
            const katexModule = await import('react-native-katex');
            if (!cancelled && mountedRef.current) {
              setRendered('native');
            }
          } catch {
            // Fallback: just show raw latex
            if (!cancelled && mountedRef.current) {
              setError(true);
            }
          }
        }
      } catch {
        if (!cancelled && mountedRef.current) {
          setError(true);
        }
      }
    }

    render();

    return () => {
      cancelled = true;
    };
  }, [latex, displayMode]);

  // Fallback: render raw latex in monospace
  if (error || rendered === null) {
    return (
      <View
        className={`my-1 rounded-lg bg-gray-100 dark:bg-gray-800 ${displayMode ? 'p-3' : 'px-1.5 py-0.5'}`}
      >
        <Text
          className={`font-mono text-gray-800 dark:text-gray-200 ${displayMode ? 'text-sm' : 'text-xs'}`}
          selectable
        >
          {latex}
        </Text>
      </View>
    );
  }

  // Native rendering with react-native-katex
  if (Platform.OS !== 'web' && rendered === 'native') {
    try {
      // Dynamic import for native
      const Katex = require('react-native-katex').default;
      return (
        <View className={`my-1 ${displayMode ? 'items-center' : ''}`}>
          <Katex
            expression={latex}
            displayMode={displayMode}
            style={[
              styles.katexContainer,
              displayMode ? styles.katexDisplay : styles.katexInline,
            ]}
            colorIsTextColor
          />
        </View>
      );
    } catch {
      return (
        <View className="my-1 rounded-lg bg-gray-100 p-3 dark:bg-gray-800">
          <Text className="font-mono text-sm text-gray-800 dark:text-gray-200" selectable>
            {latex}
          </Text>
        </View>
      );
    }
  }

  // Web rendering
  if (Platform.OS === 'web' && rendered && rendered !== 'native') {
    const HtmlWeb = require('react-native-render-html').default;
    return (
      <View className={`my-1 ${displayMode ? 'items-center' : ''}`}>
        <HtmlWeb
          source={{ html: rendered }}
          contentWidth={300}
        />
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  katexContainer: {
    backgroundColor: 'transparent',
  },
  katexDisplay: {
    minHeight: 40,
    minWidth: 100,
  },
  katexInline: {
    minHeight: 24,
  },
});
