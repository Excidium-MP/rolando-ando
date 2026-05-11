import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  type TextInputProps,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon } from '@/components/Icon';
import { TYPE, type BeltTheme, type Surface } from '@/constants/theme';

type ShellProps = {
  surface: Surface;
  title: string;
  subtitle?: string;
  onBack?: () => void;
  children: React.ReactNode;
};

export function AuthShell({ surface, title, subtitle, onBack, children }: ShellProps) {
  const insets = useSafeAreaInsets();
  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: surface.bg }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingTop: insets.top + 12,
          paddingBottom: insets.bottom + 32,
          paddingHorizontal: 20,
        }}
        keyboardShouldPersistTaps="handled"
      >
        {onBack ? (
          <Pressable
            onPress={onBack}
            hitSlop={12}
            style={{
              width: 38,
              height: 38,
              borderRadius: 19,
              backgroundColor: surface.bgElev,
              borderWidth: 0.5,
              borderColor: surface.border,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 24,
            }}
          >
            <Icon.back size={18} color={surface.text} />
          </Pressable>
        ) : (
          <View style={{ height: 38, marginBottom: 24 }} />
        )}

        <Text
          style={{
            ...TYPE.display,
            fontSize: 36,
            color: surface.text,
            letterSpacing: -0.8,
            lineHeight: 40,
          }}
        >
          {title}
        </Text>
        {subtitle ? (
          <Text
            style={{
              ...TYPE.ui,
              fontSize: 14,
              color: surface.textMuted,
              marginTop: 8,
              lineHeight: 20,
            }}
          >
            {subtitle}
          </Text>
        ) : null}

        <View style={{ marginTop: 28, gap: 14 }}>{children}</View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

type FieldProps = TextInputProps & {
  surface: Surface;
  label: string;
};

export function Field({ surface, label, style, ...rest }: FieldProps) {
  return (
    <View>
      <Text
        style={{
          ...TYPE.ui,
          fontSize: 11,
          color: surface.textDim,
          letterSpacing: 0.4,
          textTransform: 'uppercase',
          marginBottom: 6,
        }}
      >
        {label}
      </Text>
      <TextInput
        placeholderTextColor={surface.textDim}
        style={[
          {
            ...TYPE.ui,
            fontSize: 16,
            color: surface.text,
            backgroundColor: surface.bgElev,
            borderRadius: 12,
            borderWidth: 0.5,
            borderColor: surface.border,
            paddingHorizontal: 14,
            paddingVertical: 14,
            minHeight: 48,
          },
          style,
        ]}
        {...rest}
      />
    </View>
  );
}

type PrimaryProps = {
  theme: BeltTheme;
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
};

export function PrimaryButton({ theme, label, onPress, loading, disabled }: PrimaryProps) {
  const isDisabled = disabled || loading;
  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => ({
        backgroundColor: theme.accent,
        borderRadius: 999,
        paddingVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 52,
        opacity: isDisabled ? 0.5 : pressed ? 0.85 : 1,
      })}
    >
      <Text style={{ ...TYPE.ui, color: '#fff', fontSize: 15, fontWeight: '600' }}>
        {loading ? 'Working…' : label}
      </Text>
    </Pressable>
  );
}

type GhostProps = {
  surface: Surface;
  label: string;
  onPress: () => void;
};

export function GhostButton({ surface, label, onPress }: GhostProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        paddingVertical: 14,
        alignItems: 'center',
        justifyContent: 'center',
        opacity: pressed ? 0.6 : 1,
      })}
    >
      <Text style={{ ...TYPE.ui, color: surface.text, fontSize: 14, fontWeight: '500' }}>
        {label}
      </Text>
    </Pressable>
  );
}

type ErrorProps = { surface: Surface; message: string };

export function ErrorBanner({ surface, message }: ErrorProps) {
  return (
    <View
      style={{
        backgroundColor: '#FBE9E7',
        borderColor: 'rgba(232,88,76,0.3)',
        borderWidth: 0.5,
        borderRadius: 12,
        padding: 12,
      }}
    >
      <Text style={{ ...TYPE.ui, fontSize: 13, color: '#9A2A20', lineHeight: 18 }}>
        {message}
      </Text>
    </View>
  );
}

type InfoProps = { surface: Surface; message: string };

export function InfoBanner({ surface, message }: InfoProps) {
  return (
    <View
      style={{
        backgroundColor: surface.bgElev,
        borderColor: surface.border,
        borderWidth: 0.5,
        borderRadius: 12,
        padding: 12,
      }}
    >
      <Text style={{ ...TYPE.ui, fontSize: 13, color: surface.text, lineHeight: 18 }}>
        {message}
      </Text>
    </View>
  );
}
