import React from 'react';
import { Pressable, View } from 'react-native';
import { alpha, useTheme } from '@/kit/theme';
import { useKeyFocus } from '@/lib/useKeyFocus';

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
      {Array.from({ length: count }, (_, index) => (
        <Choice
          key={index}
          label={labelFor(index)}
          revealed={revealed}
          border={revealed && index === answerIndex ? p.success : revealed && index === pickedIndex ? p.danger : p.border}
          bg={revealed && index === answerIndex ? alpha(p.success, 0.12) : revealed && index === pickedIndex ? alpha(p.danger, 0.12) : p.surface}
          selected={index === pickedIndex}
          onPick={() => {
            if (!revealed) onPick(index);
          }}
        >
          {renderOption(index)}
        </Choice>
      ))}
    </View>
  );
}

function Choice({
  label,
  revealed,
  border,
  bg,
  selected,
  onPick,
  children,
}: {
  label: string;
  revealed: boolean;
  border: string;
  bg: string;
  selected: boolean;
  onPick: () => void;
  children: React.ReactNode;
}) {
  const p = useTheme();
  const focused = useKeyFocus(!revealed, onPick);
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityLabel={label}
      accessibilityState={{ selected, disabled: revealed }}
      onPress={onPick}
      style={(state) => ({
        minHeight: 56,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: p.radius,
        borderWidth: 2,
        borderColor: focused || Boolean((state as { hovered?: boolean }).hovered) ? p.primary : border,
        backgroundColor: Boolean((state as { hovered?: boolean }).hovered) && !revealed ? alpha(p.primary, 0.08) : bg,
        justifyContent: 'center',
        opacity: state.pressed && !revealed ? 0.85 : 1,
      })}
    >
      {children}
    </Pressable>
  );
}
