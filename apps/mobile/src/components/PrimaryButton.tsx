import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  Text,
  type ViewStyle,
} from 'react-native';

import { TYPE } from '@/constants/theme';
import { useTheme } from '@/store/themeStore';

type Variant = 'primary' | 'ghost';

type PrimaryButtonProps = {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: Variant;
  style?: ViewStyle;
};

const HEIGHT = 48;

export function PrimaryButton({
  label,
  onPress,
  loading = false,
  disabled = false,
  variant = 'primary',
  style,
}: PrimaryButtonProps) {
  const { surface, theme } = useTheme();
  const isPrimary = variant === 'primary';
  const isInactive = disabled || loading;

  const baseBg = isPrimary ? theme.accent : 'transparent';
  const baseBorder = isPrimary ? theme.accent : surface.borderStrong;
  const textColor = isPrimary ? '#fff' : surface.text;

  return (
    <Pressable
      onPress={isInactive ? undefined : onPress}
      disabled={isInactive}
      style={({ pressed }) => ({
        height: HEIGHT,
        borderRadius: 12,
        backgroundColor: baseBg,
        borderWidth: 1,
        borderColor: baseBorder,
        alignItems: 'center',
        justifyContent: 'center',
        opacity: isInactive ? 0.55 : pressed ? 0.85 : 1,
        ...(isPrimary
          ? {
              shadowColor: theme.accent,
              shadowOpacity: 0.4,
              shadowRadius: 14,
              shadowOffset: { width: 0, height: 4 },
              elevation: 6,
            }
          : null),
        ...style,
      })}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <Text
          style={{
            ...TYPE.ui,
            fontSize: 15,
            fontWeight: '700',
            color: textColor,
            letterSpacing: 0.2,
          }}
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
}
