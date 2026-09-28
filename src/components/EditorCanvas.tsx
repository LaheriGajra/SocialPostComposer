import React from 'react';

import {
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {OverlayTextEditor} from './OverlayTextEditor';

import {colors} from '../theme/colors';

interface TextPosition {
  x: number;
  y: number;
}

interface EditorCanvasProps {
  imageUri: string | null;

  canvasSize: number;

  overlayText: string;

  fontSize: number;

  textPosition: TextPosition;

  showOverlayText: boolean;

  onDragStart: () => void;

  onDrag: (
    dx: number,
    dy: number,
  ) => void;

  onDragEnd: (
    dx: number,
    dy: number,
  ) => void;

  onDelete: () => void;

  onPressImage?: () => void;
}

export function EditorCanvas({
  imageUri,

  canvasSize,

  overlayText,

  fontSize,

  textPosition,

  showOverlayText,

  onDragStart,

  onDrag,

  onDragEnd,

  onDelete,

  onPressImage,
}: EditorCanvasProps) {
  return (
    <View
      style={{
        width: canvasSize,

        height: canvasSize,

        alignSelf: 'center',

        overflow: 'hidden',

        borderRadius: 18,

        backgroundColor:
          colors.canvas,

        borderWidth: 1,

        borderColor:
          colors.border,
      }}>

      {imageUri ? (
        <TouchableOpacity
          activeOpacity={0.98}
          disabled={!onPressImage}
          onPress={onPressImage}
          style={{
            width: canvasSize,

            height: canvasSize,
          }}>

          <Image
            source={{
              uri: imageUri,
            }}
            resizeMode="cover"
            style={{
              width: canvasSize,

              height: canvasSize,
            }}
          />

        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onPressImage}
          style={{
            flex: 1,

            alignItems: 'center',

            justifyContent: 'center',

            paddingHorizontal: 32,
          }}>

          <View
            style={{
              width: 68,

              height: 68,

              borderRadius: 34,

              backgroundColor:
                colors.accentSoft,

              alignItems: 'center',

              justifyContent: 'center',

              marginBottom: 16,
            }}>

            <Text
              style={{
                fontSize: 34,

                color: colors.accent,
              }}>

              +

            </Text>

          </View>

          <Text
            style={{
              fontSize: 19,

              fontWeight:
                '800' as const,

              color: colors.text,

              textAlign: 'center',
            }}>

            Add your image

          </Text>

          <Text
            style={{
              marginTop: 7,

              fontSize: 13,

              lineHeight: 19,

              color:
                colors.textSecondary,

              textAlign: 'center',
            }}>

            Choose an image to start
            creating your 1080 × 1080 post.

          </Text>

        </TouchableOpacity>
      )}

      {/*
       * IMPORTANT:
       *
       * Render the textbox ONLY when:
       *
       * 1. image exists
       * 2. showOverlayText = true
       * 3. overlayText contains actual text
       *
       * Therefore, after:
       *
       * Long press -> Remove
       *
       * the textbox completely disappears.
       */}
      {imageUri &&
        showOverlayText &&
        overlayText.trim().length > 0 && (
          <OverlayTextEditor
            text={overlayText}

            fontSize={fontSize}

            x={textPosition.x}

            y={textPosition.y}

            canvasSize={canvasSize}

            onDragStart={
              onDragStart
            }

            onDrag={onDrag}

            onDragEnd={
              onDragEnd
            }

            onDelete={onDelete}
          />
        )}

      {/*
       * DO NOT put these inside
       * this ViewShot canvas:
       *
       * - Change
       * - POST
       * - username
       * - Instagram icons
       * - Like/comment/share
       * - Shop Now
       *
       * This component represents
       * the actual creative.
       */}
    </View>
  );
}