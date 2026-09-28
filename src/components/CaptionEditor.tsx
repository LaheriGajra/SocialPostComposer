import React from 'react';

import {
  Text,
  TextInput,
  View,
} from 'react-native';

import {colors} from '../theme/colors';
import {spacing} from '../theme/spacing';

interface Props {
  caption: string;

  maxLength: number;

  onChange: (
    value: string,
  ) => void;

  onFocus?: () => void;
}

export function CaptionEditor({
  caption,
  maxLength,
  onChange,
  onFocus,
}: Props) {
  const remaining =
    maxLength - caption.length;

  return (
    <View
      style={{
        marginTop: spacing.xl,
      }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent:
            'space-between',

          alignItems:
            'flex-start',

          marginBottom:
            spacing.sm,
        }}>
        <View
          style={{
            flex: 1,
          }}>
          <Text
            style={{
              color: colors.text,
              fontSize: 16,
              fontWeight: '800',
            }}>
            Post caption
          </Text>

          <Text
            style={{
              marginTop: 3,
              color:
                colors.textMuted,
              fontSize: 11,
            }}>
            Add your caption, Hindi text or emoji
          </Text>
        </View>

        <Text
          style={{
            color:
              remaining < 100
                ? colors.warning
                : colors.textMuted,

            fontSize: 11,
          }}>
          {caption.length}/{maxLength}
        </Text>
      </View>

      <TextInput
        value={caption}
        onChangeText={onChange}
        onFocus={onFocus}
        multiline
        maxLength={maxLength}
        blurOnSubmit={false}
        textAlignVertical="top"
        placeholder="Write your caption..."
        placeholderTextColor={
          colors.textMuted
        }
        style={{
          minHeight: 125,
          maxHeight: 190,

          paddingHorizontal: 15,
          paddingVertical: 13,

          borderRadius: 14,

          borderWidth: 1,
          borderColor:
            colors.border,

          backgroundColor:
            colors.surface,

          color: colors.text,

          fontSize: 15,
          lineHeight: 22,
        }}
      />

      {remaining < 100 && (
        <Text
          style={{
            marginTop: 5,
            color:
              colors.warning,
            fontSize: 10,
          }}>
          You are close to the caption limit.
        </Text>
      )}
    </View>
  );
}