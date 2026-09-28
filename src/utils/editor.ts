import {TextPosition} from '../types/editor';

/**
 * Preview size used by the editor.
 *
 * The actual exported image should still
 * be rendered at 1080 × 1080.
 */
export const CANVAS_PREVIEW_SIZE = 360;

/**
 * Final Instagram creative resolution.
 */
export const CANVAS_OUTPUT_SIZE = 1080;

/**
 * Minimum source image resolution.
 */
export const MIN_SOURCE_IMAGE_SIZE = 1080;

/**
 * Font size limits.
 */
export const MIN_FONT_SIZE = 18;
export const MAX_FONT_SIZE = 64;
export const FONT_STEP = 4;

/**
 * Caption limits.
 */
export const MAX_CAPTION_LENGTH = 2200;

/**
 * Text placed directly on image.
 */
export const MAX_OVERLAY_TEXT_LENGTH = 120;

/**
 * Initial position of text.
 */
export const getInitialTextPosition = (
  canvasSize: number,
): TextPosition => ({
  x: 20,

  y: Math.max(
    20,
    canvasSize * 0.72,
  ),
});

/**
 * Keep text inside the canvas.
 *
 * IMPORTANT:
 *
 * The previous implementation used:
 *
 *     estimatedHeight = 100
 *
 * That made the text stop far above
 * the bottom of the image.
 *
 * We intentionally use a small estimated
 * height so the text can be positioned
 * close to the bottom.
 */
export const clampTextPosition = (
  position: TextPosition,
  canvasSize: number,
): TextPosition => {
  const horizontalMargin = 8;

  const topMargin = 8;

  const bottomMargin = 8;

  /**
   * Approximate width of the text box.
   */
  const estimatedWidth = Math.min(
    canvasSize - 32,
    300,
  );

  /**
   * Keep this small so the user can
   * move the text close to the bottom.
   */
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
      Math.min(
        maxX,
        position.x,
      ),
    ),

    y: Math.max(
      topMargin,
      Math.min(
        maxY,
        position.y,
      ),
    ),
  };
};