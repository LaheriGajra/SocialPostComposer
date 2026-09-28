import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  View,
} from 'react-native';

import {PostEditor} from './src/components/PostEditor';
import {colors} from './src/theme/colors';

export default function App() {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.background,
      }}>
      <StatusBar barStyle="dark-content" />

      <View
        style={{
          flex: 1,
          backgroundColor: colors.background,
        }}>
        <PostEditor />
      </View>
    </SafeAreaView>
  );
}