import { useCallback, useMemo, useState } from 'react';
import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';
import RenderHtml, {
  defaultHTMLElementModels,
  HTMLContentModel,
  type MixedStyleRecord,
  type RenderersProps,
  type TBlock,
  type TNode,
} from 'react-native-render-html';
import { Image } from 'expo-image';

import { MathBlock } from './math-block';
import { ImageViewer } from './image-viewer';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface HtmlRendererProps {
  content: string;
  maxWidth?: number;
  onImagePress?: (uri: string) => void;
}

// Regex to detect math expressions
const MATH_BLOCK_REGEX = /\$\$([\s\S]+?)\$\$/g;
const MATH_INLINE_REGEX = /(?<!\$)\$(?!\$)((?:(?!\$).)+?)\$(?!\$)/g;

interface ParsedSegment {
  type: 'text' | 'math-block' | 'math-inline';
  content: string;
}

function parseContent(content: string): ParsedSegment[] {
  const segments: ParsedSegment[] = [];
  let remaining = content;

  // First pass: extract block math $$...$$
  const blockParts = remaining.split(MATH_BLOCK_REGEX);
  for (let i = 0; i < blockParts.length; i++) {
    if (i % 2 === 1) {
      // This is inside $$...$$
      segments.push({ type: 'math-block', content: blockParts[i].trim() });
    } else {
      // This is regular text, check for inline math $...$
      const inlineParts = blockParts[i].split(MATH_INLINE_REGEX);
      for (let j = 0; j < inlineParts.length; j++) {
        if (j % 2 === 1) {
          segments.push({ type: 'math-inline', content: inlineParts[j].trim() });
        } else if (inlineParts[j]) {
          segments.push({ type: 'text', content: inlineParts[j] });
        }
      }
    }
  }

  return segments;
}

// Custom renderer for images
function ImageRenderer({
  tnode,
  onPress,
}: {
  tnode: TBlock;
  onPress?: (uri: string) => void;
}) {
  const src = tnode.attributes.src || '';
  const alt = tnode.attributes.alt || '';

  return (
    <Pressable
      onPress={() => onPress?.(src)}
      className="my-2 overflow-hidden rounded-lg"
    >
      <Image
        source={{ uri: src }}
        style={styles.image}
        contentFit="contain"
        cachePolicy="memory-disk"
        transition={200}
        accessibilityLabel={alt}
      />
    </Pressable>
  );
}

// Custom renderer for tables
function TableRenderer({ tnode }: { tnode: TBlock }) {
  return (
    <View className="my-2 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
      <RenderHtml
        source={{ html: tnode.toString() }}
        contentWidth={SCREEN_WIDTH - 64}
        baseStyle={styles.table}
      />
    </View>
  );
}

export function HtmlRenderer({ content, maxWidth, onImagePress }: HtmlRendererProps) {
  const [viewerUri, setViewerUri] = useState<string | null>(null);
  const contentWidth = maxWidth ?? SCREEN_WIDTH - 64;

  // Parse content for math expressions
  const segments = useMemo(() => parseContent(content), [content]);

  // Check if content has math
  const hasMath = useMemo(
    () => segments.some((s) => s.type === 'math-block' || s.type === 'math-inline'),
    [segments],
  );

  // If content has math, render segments individually
  if (hasMath) {
    return (
      <View>
        {segments.map((segment, index) => {
          if (segment.type === 'math-block') {
            return <MathBlock key={index} latex={segment.content} displayMode />;
          }
          if (segment.type === 'math-inline') {
            return (
              <Text key={index} className="text-base text-gray-900 dark:text-white">
                <MathBlock latex={segment.content} displayMode={false} />
              </Text>
            );
          }
          // Regular HTML text
          return (
            <View key={index}>
              <RenderHtml
                source={{ html: segment.content }}
                contentWidth={contentWidth}
                baseStyle={styles.base}
                tagsStyles={tagsStyles}
                classesStyles={classesStyles}
                renderers={{
                  img: ({ tnode }: { tnode: TBlock }) => (
                    <ImageRenderer tnode={tnode} onPress={onImagePress ?? setViewerUri} />
                  ),
                  table: ({ tnode }: { tnode: TBlock }) => <TableRenderer tnode={tnode} />,
                }}
              />
            </View>
          );
        })}
        {viewerUri && (
          <ImageViewer
            uri={viewerUri}
            visible={!!viewerUri}
            onClose={() => setViewerUri(null)}
          />
        )}
      </View>
    );
  }

  // No math, render normally
  return (
    <View>
      <RenderHtml
        source={{ html: content }}
        contentWidth={contentWidth}
        baseStyle={styles.base}
        tagsStyles={tagsStyles}
        classesStyles={classesStyles}
        renderers={{
          img: ({ tnode }: { tnode: TBlock }) => (
            <ImageRenderer tnode={tnode} onPress={onImagePress ?? setViewerUri} />
          ),
          table: ({ tnode }: { tnode: TBlock }) => <TableRenderer tnode={tnode} />,
        }}
      />
      {viewerUri && (
        <ImageViewer
          uri={viewerUri}
          visible={!!viewerUri}
          onClose={() => setViewerUri(null)}
        />
      )}
    </View>
  );
}

const tagsStyles: MixedStyleRecord = {
  body: {
    color: '#111827', // gray-900
  },
  p: {
    fontSize: 16,
    lineHeight: 24,
    color: '#111827',
    marginVertical: 4,
  },
  h1: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginVertical: 8,
  },
  h2: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginVertical: 6,
  },
  h3: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginVertical: 4,
  },
  h4: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginVertical: 4,
  },
  ul: {
    marginVertical: 4,
    paddingLeft: 16,
  },
  ol: {
    marginVertical: 4,
    paddingLeft: 16,
  },
  li: {
    fontSize: 16,
    lineHeight: 24,
    color: '#111827',
  },
  a: {
    color: '#3B82F6', // blue-500
    textDecorationLine: 'underline',
  },
  strong: {
    fontWeight: '700',
  },
  em: {
    fontStyle: 'italic',
  },
  code: {
    fontFamily: 'monospace',
    backgroundColor: '#F3F4F6', // gray-100
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
    fontSize: 14,
  },
  pre: {
    backgroundColor: '#F3F4F6',
    padding: 12,
    borderRadius: 8,
    overflow: 'hidden',
  },
  blockquote: {
    borderLeftWidth: 4,
    borderLeftColor: '#D1D5DB', // gray-300
    paddingLeft: 12,
    marginVertical: 8,
    fontStyle: 'italic',
  },
  table: {
    borderWidth: 1,
    borderColor: '#E5E7EB', // gray-200
  },
  th: {
    backgroundColor: '#F9FAFB', // gray-50
    padding: 8,
    fontWeight: '600',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  td: {
    padding: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  img: {
    maxWidth: '100%',
  },
};

const classesStyles: MixedStyleRecord = {
  'text-gray-500': {
    color: '#6B7280',
  },
  'text-gray-400': {
    color: '#9CA3AF',
  },
  'text-blue-500': {
    color: '#3B82F6',
  },
};

const styles = StyleSheet.create({
  base: {
    fontSize: 16,
    lineHeight: 24,
    color: '#111827',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  table: {
    fontSize: 14,
    lineHeight: 20,
  },
});
