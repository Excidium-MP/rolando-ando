import React, { forwardRef } from 'react';
import {
  Text,
  TextInput,
  type TextInputProps,
  View,
  type ViewStyle,
} from 'react-native';

import { TYPE } from '@/constants/theme';
import { useTheme } from '@/store/themeStore';

type FieldProps = {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  error?: string;
  hint?: string;
  containerStyle?: ViewStyle;
} & Omit<TextInputProps, 'value' | 'onChangeText' | 'style'>;

// Single-line glass-style text input. Border turns red when `error` is set;
// the error message renders below in the same red. `hint` only shows when
// there is no error.
export const Field = forwardRef<TextInput, FieldProps>(function Field(
  { label, value, onChangeText, error, hint, containerStyle, ...inputProps },
  ref,
) {
  const { surface, theme } = useTheme();
  const borderColor = error
    ? theme.accent
    : surface.borderStrong;

  return (
    <View style={[{ gap: 6 }, containerStyle]}>
      <Text
        style={{
          ...TYPE.ui,
          fontSize: 11,
          fontWeight: '600',
          color: surface.textMuted,
          letterSpacing: 0.4,
          textTransform: 'uppercase',
        }}
      >
        {label}
      </Text>
      <TextInput
        ref={ref}
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor={surface.textDim}
        selectionColor={theme.accent}
        style={{
          ...TYPE.ui,
          fontSize: 15,
          color: surface.text,
          backgroundColor: surface.chip,
          borderWidth: 1,
          borderColor,
          borderRadius: 12,
          paddingHorizontal: 14,
          paddingVertical: 12,
          minHeight: 48,
        }}
        {...inputProps}
      />
      {(error || hint) && (
        <Text
          style={{
            ...TYPE.ui,
            fontSize: 11,
            color: error ? theme.accent : surface.textDim,
          }}
        >
          {error ?? hint}
        </Text>
      )}
    </View>
  );
});
