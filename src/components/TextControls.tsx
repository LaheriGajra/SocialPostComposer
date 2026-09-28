import React from 'react';

import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import {colors} from '../theme/colors';

interface TextControlsProps {
  text: string;

  fontSize: number;

  onChangeText: (
    value: string,
  ) => void;

  onDecrease: () => void;

  onIncrease: () => void;
}

export function TextControls({
  text,
  fontSize,
  onChangeText,
  onDecrease,
  onIncrease,
}: TextControlsProps) {
  return (
    <View
      style={{
        marginTop: 16,

        padding: 16,

        borderRadius: 18,

        backgroundColor:
          colors.surface,

        borderWidth: 1,

        borderColor:
          colors.border,
      }}>

      {/* TITLE */}

      <Text
        style={{
          fontSize: 16,

          fontWeight: '800',

          color: colors.text,
        }}>
        Text on image
      </Text>

      <Text
        style={{
          marginTop: 4,

          marginBottom: 10,

          fontSize: 12,

          lineHeight: 18,

          color:
            colors.textSecondary,
        }}>
        Edit your text below, then drag
        the outlined text directly on
        the image.
      </Text>

      {/* TEXT INPUT */}

      <TextInput
        value={text}

        onChangeText={
          onChangeText
        }

        multiline

        maxLength={120}

        placeholder="Write text for your image"

        placeholderTextColor={
          colors.textMuted
        }

        textAlignVertical="top"

        style={{
          minHeight: 76,

          borderWidth: 1,

          borderColor:
            colors.border,

          borderRadius: 12,

          paddingHorizontal: 12,

          paddingVertical: 10,

          color: colors.text,

          fontSize: 15,

          lineHeight: 21,
        }}
      />

      {/* CHARACTER COUNT */}

      <Text
        style={{
          marginTop: 5,

          textAlign: 'right',

          fontSize: 11,

          color:
            colors.textMuted,
        }}>
        {text.length}/120
      </Text>

      {/* FONT SIZE */}

      <View
        style={{
          marginTop: 12,

          flexDirection: 'row',

          alignItems: 'center',

          justifyContent:
            'space-between',
        }}>

        <Text
          style={{
            fontSize: 13,

            color:
              colors.textSecondary,
          }}>
          Font size
        </Text>

        <View
          style={{
            flexDirection: 'row',

            alignItems: 'center',
          }}>

          {/* DECREASE */}

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onDecrease}
            style={{
              width: 44,

              height: 40,

              borderRadius: 10,

              backgroundColor:
                colors.background,

              alignItems: 'center',

              justifyContent:
                'center',
            }}>
            <Text
              style={{
                fontSize: 17,

                fontWeight: '700',

                color: colors.text,
              }}>
              A−
            </Text>
          </TouchableOpacity>

          {/* SIZE */}

          <View
            style={{
              width: 55,

              alignItems: 'center',
            }}>
            <Text
              style={{
                fontSize: 14,

                fontWeight: '700',

                color: colors.text,
              }}>
              {fontSize}
            </Text>
          </View>

          {/* INCREASE */}

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onIncrease}
            style={{
              width: 44,

              height: 40,

              borderRadius: 10,

              backgroundColor:
                colors.background,

              alignItems: 'center',

              justifyContent:
                'center',
            }}>
            <Text
              style={{
                fontSize: 17,

                fontWeight: '700',

                color: colors.text,
              }}>
              A+
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}