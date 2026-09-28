import React from 'react';

import {
  Text,
  View,
} from 'react-native';

import {colors} from '../theme/colors';
import {spacing} from '../theme/spacing';

export function EditorHeader() {
  return (
    <View
      style={{
        marginBottom:
          spacing.xl,
      }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent:
            'space-between',
        }}>
        <View
          style={{
            flex: 1,
          }}>
          <Text
            style={{
              color: colors.text,
              fontSize: 29,
              fontWeight: '800',
              letterSpacing: -0.7,
            }}>
            Create Post
          </Text>

          <Text
            style={{
              marginTop: 5,
              color: colors.textMuted,
              fontSize: 13,
            }}>
            Turn your product into a post
          </Text>
        </View>

        <View
          style={{
            paddingHorizontal: 11,
            paddingVertical: 8,
            borderRadius: 11,
            backgroundColor:
              colors.accentSoft,
          }}>
          <Text
            style={{
              color: colors.accent,
              fontSize: 11,
              fontWeight: '800',
            }}>
            1080 × 1080
          </Text>
        </View>
      </View>
    </View>
  );
}