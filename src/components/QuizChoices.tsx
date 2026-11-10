import React from 'react';
import { Pressable, View } from 'react-native';
import { alpha, useTheme } from '@/kit/theme';

/**
 * Choix du quiz (leçon, révision, livre). La correction se voit au toucher :
 * la bonne réponse en vert, le choix erroné en rouge. Aucune écriture ici.
 */
export function QuizChoices({
  count,
  pickedIndex,
  answerIndex,
  revealed,
  onPick,
  renderOption,
  labelFor,
}: {
  count: number;
  pickedIndex: number | null;
  answerIndex: number;
  revealed: boolean;
  onPick: (index: number) => void;
  renderOption: (index: number) => React.ReactNode;
  labelFor: (index: number) => string;
}) {
  const p = useTheme();
  return (
    <View style={{ gap: 10 }} accessibilityRole="radiogroup">
      {Array.from({ length: count }, (_, index) => {
        const isAns = index === answerIndex;
        const isPick = index === pickedIndex;
        const border = revealed && isAns ? p.success : revealed && isPick ? p.danger : p.border;
        const bg = revealed && isAns ? alpha(p.success, 0.12) : revealed && isPick ? alpha(p.danger, 0.12) : p.surface;
        return (
          <Pressable
            key={index}
            accessibilityRole="radio"
            accessibilityLabel={labelFor(index)}
            accessibilityState={{ selected: isPick, disabled: revealed }}
            onPress={() => {
              if (!revealed) onPick(index);
            }}
            style={({ pressed }) => ({
              minHeight: 56,
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: p.radius,
              borderWidth: 2,
              borderColor: border,
              backgroundColor: bg,
              justifyContent: 'center',
              opacity: pressed && !revealed ? 0.85 : 1,
            })}
          >
            {renderOption(index)}
          </Pressable>
        );
      })}
    </View>
  );
}
