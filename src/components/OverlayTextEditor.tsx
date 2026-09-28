import React, {useMemo} from 'react';

import {
  Alert,
  PanResponder,
  Text,
  View,
} from 'react-native';

interface OverlayTextEditorProps {
  text: string;

  fontSize: number;

  x: number;

  y: number;

  canvasSize: number;

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
}

export function OverlayTextEditor({
  text,
  fontSize,
  x,
  y,
  canvasSize,

  onDragStart,
  onDrag,
  onDragEnd,

  onDelete,
}: OverlayTextEditorProps) {
  const panResponder = useMemo(() => {
    let longPressTimer:
      | ReturnType<typeof setTimeout>
      | null = null;

    let isLongPress = false;

    let hasMoved = false;

    const clearTimer = () => {
      if (longPressTimer) {
        clearTimeout(longPressTimer);

        longPressTimer = null;
      }
    };

    return PanResponder.create({
      /*
       * Start handling touch immediately.
       */
      onStartShouldSetPanResponder:
        () => true,

      /*
       * Start dragging after a small movement.
       */
      onMoveShouldSetPanResponder: (
        _,
        gesture,
      ) => {
        return (
          Math.abs(gesture.dx) > 3 ||
          Math.abs(gesture.dy) > 3
        );
      },

      /*
       * Touch started.
       */
      onPanResponderGrant: () => {
        hasMoved = false;

        isLongPress = false;

        onDragStart();

        /*
         * Long press threshold:
         * 650ms
         */
        longPressTimer =
          setTimeout(() => {
            if (!hasMoved) {
              isLongPress = true;

              Alert.alert(
                'Remove text?',
                'Do you want to remove this text from the image?',
                [
                  {
                    text: 'Cancel',

                    style: 'cancel',
                  },

                  {
                    text: 'Remove',

                    style: 'destructive',

                    onPress: () => {
                      onDelete();
                    },
                  },
                ],
              );
            }
          }, 650);
      },

      /*
       * Finger moving.
       */
      onPanResponderMove: (
        _,
        gesture,
      ) => {
        /*
         * Consider it a drag after
         * moving more than 8px.
         */
        if (
          Math.abs(gesture.dx) > 8 ||
          Math.abs(gesture.dy) > 8
        ) {
          hasMoved = true;

          clearTimer();
        }

        /*
         * Don't drag after long press.
         */
        if (!isLongPress) {
          onDrag(
            gesture.dx,
            gesture.dy,
          );
        }
      },

      /*
       * Finger released.
       */
      onPanResponderRelease: (
        _,
        gesture,
      ) => {
        clearTimer();

        if (!isLongPress) {
          onDragEnd(
            gesture.dx,
            gesture.dy,
          );
        }
      },

      /*
       * Gesture interrupted.
       */
      onPanResponderTerminate: (
        _,
        gesture,
      ) => {
        clearTimer();

        if (!isLongPress) {
          onDragEnd(
            gesture.dx,
            gesture.dy,
          );
        }
      },

      /*
       * Don't allow another component
       * to steal this gesture.
       */
      onPanResponderTerminationRequest:
        () => false,
    });
  }, [
    onDragStart,
    onDrag,
    onDragEnd,
    onDelete,
  ]);

  /*
   * Safety:
   *
   * If text is empty, don't render
   * an empty textbox.
   */
  if (!text.trim()) {
    return null;
  }

  return (
    <View
      {...panResponder.panHandlers}
      collapsable={false}
      style={{
        position: 'absolute',

        left: x,

        top: y,

        maxWidth:
          Math.max(
            100,
            canvasSize - x - 12,
          ),

        minWidth: 100,

        zIndex: 100,

        elevation: 10,
      }}>

      <View
        style={{
          paddingHorizontal: 16,

          paddingVertical: 12,

          borderRadius: 14,

          borderWidth: 2,

          borderColor: '#FFFFFF',

          backgroundColor:
            'rgba(0, 0, 0, 0.38)',

          shadowColor: '#000000',

          shadowOffset: {
            width: 0,
            height: 3,
          },

          shadowOpacity: 0.3,

          shadowRadius: 6,

          elevation: 8,
        }}>

        <Text
          pointerEvents="none"
          style={{
            color: '#FFFFFF',

            fontSize,

            lineHeight:
              fontSize * 1.2,

            fontWeight:
              '700' as const,

            textShadowColor:
              'rgba(0, 0, 0, 0.7)',

            textShadowOffset: {
              width: 0,
              height: 2,
            },

            textShadowRadius: 5,
          }}>

          {text}

        </Text>

      </View>
    </View>
  );
}