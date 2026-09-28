import React from 'react';

import {
  ActivityIndicator,
  Pressable,
  Text,
  View,
} from 'react-native';

import {colors} from '../theme/colors';
import {spacing} from '../theme/spacing';

interface Props {
  disabled: boolean;

  isExporting: boolean;

  onExport: () => void;

  onShare: () => void;
}

export function ActionBar({
  disabled,
  isExporting,
  onExport,
  onShare,
}: Props) {
  return (
    <View
      style={{
        marginTop: spacing.xl,

        padding: 8,

        borderRadius: 18,

        backgroundColor:
          colors.surface,

        borderWidth: 1,

        borderColor:
          colors.border,

        flexDirection:
          'row',

        gap: 8,
      }}>
      <Pressable
        disabled={
          disabled ||
          isExporting
        }
        onPress={
          onExport
        }
        style={({pressed}) => ({
          flex: 0.75,

          height: 50,

          borderRadius: 13,

          alignItems:
            'center',

          justifyContent:
            'center',

          backgroundColor:
            pressed &&
            !disabled
              ? '#F1F5F9'
              : colors.surface,

          opacity:
            disabled ||
            isExporting
              ? 0.45
              : 1,
        })}>
        {isExporting ? (
          <ActivityIndicator
            color={
              colors.text
            }
          />
        ) : (
          <Text
            style={{
              color:
                colors.text,

              fontSize: 14,

              fontWeight:
                '800',
            }}>
            Export
          </Text>
        )}
      </Pressable>

      <Pressable
        disabled={
          disabled ||
          isExporting
        }
        onPress={
          onShare
        }
        style={({pressed}) => ({
          flex: 1.7,

          height: 50,

          borderRadius: 13,

          alignItems:
            'center',

          justifyContent:
            'center',

          backgroundColor:
            pressed &&
            !disabled
              ? colors.instagramPressed
              : colors.instagram,

          opacity:
            disabled ||
            isExporting
              ? 0.45
              : 1,
        })}>
        <Text
          style={{
            color:
              colors.white,

            fontSize: 14,

            fontWeight:
              '800',
          }}>
          {isExporting
            ? 'Preparing...'
            : 'Share to Instagram  →'}
        </Text>
      </Pressable>
    </View>
  );
}