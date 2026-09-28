import {
  useCallback,
  useRef,
  useState,
} from 'react';

import {Alert} from 'react-native';

import {pickImage} from '../services/imagePicker';
import {TextPosition} from '../types/editor';

import {
  FONT_STEP,
  MAX_CAPTION_LENGTH,
  MAX_FONT_SIZE,
  MAX_OVERLAY_TEXT_LENGTH,
  MIN_FONT_SIZE,
} from '../utils/editor';

export function usePostEditor(canvasSize: number) {
  const initialPosition: TextPosition = {
    x: 20,
    y: canvasSize * 0.72,
  };

  const [imageUri, setImageUri] =
    useState<string | null>(null);

  // Text displayed ON the image
  const [overlayText, setOverlayText] =
    useState('आपका कारोबार आपकी पहचान ✨❤️');

  // Instagram post caption
  const [postCaption, setPostCaption] =
    useState(
      'आज की खास पेशकश ✨❤️\n\n' +
        'Introducing our latest product. ' +
        'Designed to make your everyday experience better.\n\n' +
        '#NewProduct #ShopNow',
    );

  const [fontSize, setFontSize] =
    useState(30);

  const [textPosition, setTextPosition] =
    useState<TextPosition>(initialPosition);

  const [showOverlayText, setShowOverlayText] =
    useState(true);

  const dragStartRef =
    useRef<TextPosition>(initialPosition);

  const currentPositionRef =
    useRef<TextPosition>(initialPosition);

  /*
   * Keep text inside the image.
   */
  const clampPosition = useCallback(
    (
      x: number,
      y: number,
    ): TextPosition => {
      const horizontalMargin = 8;
      const topMargin = 8;
      const bottomMargin = 8;

      const estimatedWidth = Math.min(
        280,
        canvasSize - 24,
      );

      const estimatedHeight = 20;

      const maxX = Math.max(
        horizontalMargin,
        canvasSize -
          estimatedWidth -
          horizontalMargin,
      );

      const maxY = Math.max(
        topMargin,
        canvasSize -
          estimatedHeight -
          bottomMargin,
      );

      return {
        x: Math.max(
          horizontalMargin,
          Math.min(maxX, x),
        ),

        y: Math.max(
          topMargin,
          Math.min(maxY, y),
        ),
      };
    },
    [canvasSize],
  );

  /*
   * Select image.
   */
  const selectImage = useCallback(
    async () => {
      const result = await pickImage();

      if (result.error) {
        Alert.alert(
          'Image selection',
          result.error,
        );

        return;
      }

      if (!result.uri) {
        return;
      }

      setImageUri(result.uri);

      const position = clampPosition(
        20,
        canvasSize * 0.72,
      );

      setTextPosition(position);

      currentPositionRef.current =
        position;

      dragStartRef.current =
        position;

      /*
       * If the user selects a new image,
       * show the existing text again only
       * if there is actual text.
       */
      setShowOverlayText(
        overlayText.trim().length > 0,
      );
    },
    [
      canvasSize,
      clampPosition,
      overlayText,
    ],
  );

  /*
   * Update text displayed ON image.
   *
   * Empty text = hide textbox.
   * New text = show textbox.
   */
  const updateOverlayText =
    useCallback(
      (value: string) => {
        if (
          value.length >
          MAX_OVERLAY_TEXT_LENGTH
        ) {
          return;
        }

        setOverlayText(value);

        const hasText =
          value.trim().length > 0;

        setShowOverlayText(hasText);
      },
      [],
    );

  /*
   * Update Instagram post caption.
   */
  const updatePostCaption =
    useCallback(
      (value: string) => {
        if (
          value.length <=
          MAX_CAPTION_LENGTH
        ) {
          setPostCaption(value);
        }
      },
      [],
    );

  /*
   * Increase text size.
   */
  const increaseFontSize =
    useCallback(() => {
      setFontSize(
        value =>
          Math.min(
            MAX_FONT_SIZE,
            value + FONT_STEP,
          ),
      );
    }, []);

  /*
   * Decrease text size.
   */
  const decreaseFontSize =
    useCallback(() => {
      setFontSize(
        value =>
          Math.max(
            MIN_FONT_SIZE,
            value - FONT_STEP,
          ),
      );
    }, []);

  /*
   * Start dragging.
   */
  const startDragging =
    useCallback(() => {
      dragStartRef.current = {
        ...currentPositionRef.current,
      };
    }, []);

  /*
   * Update text position while dragging.
   */
  const updateTextPosition =
    useCallback(
      (
        dx: number,
        dy: number,
      ) => {
        const start =
          dragStartRef.current;

        const nextPosition =
          clampPosition(
            start.x + dx,
            start.y + dy,
          );

        currentPositionRef.current =
          nextPosition;

        setTextPosition(
          nextPosition,
        );
      },
      [clampPosition],
    );

  /*
   * Finish dragging.
   */
  const finishDragging =
    useCallback(
      (
        dx: number,
        dy: number,
      ) => {
        const start =
          dragStartRef.current;

        const finalPosition =
          clampPosition(
            start.x + dx,
            start.y + dy,
          );

        currentPositionRef.current =
          finalPosition;

        dragStartRef.current =
          finalPosition;

        setTextPosition(
          finalPosition,
        );
      },
      [clampPosition],
    );

  /*
   * IMPORTANT:
   *
   * Long press -> Remove
   *
   * We clear BOTH:
   * 1. overlayText
   * 2. showOverlayText
   *
   * This prevents an empty textbox from
   * remaining on the image.
   */
  const deleteOverlayText =
    useCallback(() => {
      setOverlayText('');
      setShowOverlayText(false);
    }, []);

  return {
    imageUri,

    overlayText,

    postCaption,

    fontSize,

    textPosition,

    showOverlayText,

    selectImage,

    updateOverlayText,

    updatePostCaption,

    increaseFontSize,

    decreaseFontSize,

    startDragging,

    updateTextPosition,

    finishDragging,

    deleteOverlayText,
  };
}