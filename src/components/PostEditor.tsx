import React, {useRef} from 'react';

import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import ViewShot from 'react-native-view-shot';
import Share from 'react-native-share';

import {usePostEditor} from '../hooks/usePostEditor';

import {EditorCanvas} from './EditorCanvas';
import {TextControls} from './TextControls';
import {CaptionEditor} from './CaptionEditor';

import {
  CANVAS_OUTPUT_SIZE,
  CANVAS_PREVIEW_SIZE,
} from '../utils/editor';

import {colors} from '../theme/colors';

export function PostEditor() {
  /**
   * ViewShot captures ONLY EditorCanvas.
   *
   * Therefore these are NOT exported:
   *
   * - Change button
   * - Instagram preview header
   * - POST label
   * - username
   * - action icons
   * - post caption preview
   * - Export button
   */
  const canvasRef = useRef<any>(null);

  /**
   * ScrollView ref.
   *
   * Using any avoids the React Native 0.87
   * ScrollView ref typing issue.
   */
  const scrollViewRef = useRef<any>(null);

  const editor = usePostEditor(
    CANVAS_PREVIEW_SIZE,
  );

  /**
   * ==========================================================
   * CHANGE IMAGE
   * ==========================================================
   */
  const handleChangeImage = async () => {
    await editor.selectImage();
  };

  /**
   * ==========================================================
   * EXPORT 1080 × 1080 IMAGE
   * ==========================================================
   */
  const exportImage = async (): Promise<string | null> => {
    if (!editor.imageUri) {
      Alert.alert(
        'Add an image',
        'Please select an image before exporting.',
      );

      return null;
    }

    try {
      /**
       * Capture ONLY EditorCanvas.
       *
       * The editor preview is 360 × 360,
       * but the exported result is 1080 × 1080.
       */
      const uri =
        await canvasRef.current.capture({
          format: 'png',
          quality: 1,
          width: CANVAS_OUTPUT_SIZE,
          height: CANVAS_OUTPUT_SIZE,
          result: 'tmpfile',
        });

      return uri;
    } catch (error) {
      console.error(
        'Image export error:',
        error,
      );

      Alert.alert(
        'Export failed',
        'Unable to create the 1080 × 1080 image.',
      );

      return null;
    }
  };

  /**
   * ==========================================================
   * SHARE IMAGE
   * ==========================================================
   *
   * We intentionally do NOT use:
   *
   * social: Share.Social.INSTAGRAM
   *
   * because your installed react-native-share
   * TypeScript definitions do not accept `social`
   * in Share.open().
   *
   * This opens the native Android share sheet,
   * where Instagram can be selected.
   */
  const handleShare = async () => {
    const uri = await exportImage();

    if (!uri) {
      return;
    }

    try {
      await Share.open({
        title: 'Share your post',

        url: uri,

        type: 'image/png',

        failOnCancel: false,
      });
    } catch (error) {
      console.log(
        'Share cancelled or failed:',
        error,
      );
    }
  };

  /**
   * ==========================================================
   * SCROLL TO CAPTION
   * ==========================================================
   */
  const handleCaptionFocus = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({
        y: 560,
        animated: true,
      });
    }, 250);
  };

  return (
    <KeyboardAvoidingView
      style={{
        flex: 1,
        backgroundColor: colors.background,
      }}
      behavior={
        Platform.OS === 'ios'
          ? 'padding'
          : undefined
      }>

      <ScrollView
        ref={scrollViewRef}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 18,
          paddingBottom: 40,
        }}>

        {/* =====================================================
            HEADER
            ===================================================== */}

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            marginBottom: 4,
          }}>

          <View
            style={{
              flex: 1,
              paddingRight: 12,
            }}>

            <Text
              style={{
                fontSize: 34,
                lineHeight: 40,
                fontWeight: '900',
                color: colors.text,
              }}>
              Create Post
            </Text>

            <Text
              style={{
                marginTop: 4,
                fontSize: 15,
                lineHeight: 22,
                color: colors.textSecondary,
              }}>
              Turn your product into a post
            </Text>
          </View>

          {/* Resolution badge */}

          <View
            style={{
              paddingHorizontal: 13,
              paddingVertical: 10,
              borderRadius: 14,
              backgroundColor: colors.accentSoft,
            }}>

            <Text
              style={{
                fontSize: 14,
                fontWeight: '800',
                color: colors.accent,
              }}>
              1080 × 1080
            </Text>
          </View>
        </View>

        {/* =====================================================
            PREVIEW TITLE
            ===================================================== */}

        <View
          style={{
            marginTop: 30,
            marginBottom: 12,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>

          <View>
            <Text
              style={{
                fontSize: 23,
                fontWeight: '900',
                color: colors.text,
              }}>
              Preview
            </Text>

            <Text
              style={{
                marginTop: 3,
                fontSize: 13,
                color: colors.textSecondary,
              }}>
              See how your post will look
            </Text>
          </View>

          <View
            style={{
              paddingHorizontal: 15,
              paddingVertical: 9,
              borderRadius: 12,
              backgroundColor: colors.surface,
              borderWidth: 1,
              borderColor: colors.border,
            }}>

            <Text
              style={{
                fontSize: 12,
                fontWeight: '800',
                color: colors.textSecondary,
              }}>
              POST
            </Text>
          </View>
        </View>

        {/* =====================================================
            INSTAGRAM-STYLE PREVIEW

            IMPORTANT:
            This is only the application preview.

            The actual exported image is ONLY EditorCanvas.
            ===================================================== */}

        <View
          style={{
            borderRadius: 22,
            backgroundColor: colors.surface,
            overflow: 'hidden',
            borderWidth: 1,
            borderColor: colors.border,

            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 5,
            },
            shadowOpacity: 0.1,
            shadowRadius: 14,

            elevation: 5,
          }}>

          {/* ===================================================
              PREVIEW HEADER
              =================================================== */}

          <View
            style={{
              height: 76,
              paddingHorizontal: 18,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>

              {/* Profile placeholder */}

              <View
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 22,

                  backgroundColor: '#F1F5F9',

                  borderWidth: 1,
                  borderColor: colors.border,

                  alignItems: 'center',
                  justifyContent: 'center',
                }}>

                <Text
                  style={{
                    fontSize: 20,
                  }}>
                  🏪
                </Text>
              </View>

              <View
                style={{
                  marginLeft: 11,
                }}>

                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: '800',
                    color: colors.text,
                  }}>
                  your_business
                </Text>

                <Text
                  style={{
                    marginTop: 2,
                    fontSize: 12,
                    color: colors.textSecondary,
                  }}>
                  Your post preview
                </Text>
              </View>
            </View>

            <Text
              style={{
                fontSize: 22,
                fontWeight: '900',
                color: colors.text,
              }}>
              •••
            </Text>
          </View>

          {/* ===================================================
              ACTUAL CREATIVE

              ViewShot captures ONLY this section.
              =================================================== */}

          <View
            style={{
              width: CANVAS_PREVIEW_SIZE,
              height: CANVAS_PREVIEW_SIZE,
              alignSelf: 'center',
            }}>

            <ViewShot
              ref={canvasRef}
              options={{
                format: 'png',
                quality: 1,
                width: CANVAS_OUTPUT_SIZE,
                height: CANVAS_OUTPUT_SIZE,
              }}
              style={{
                width: CANVAS_PREVIEW_SIZE,
                height: CANVAS_PREVIEW_SIZE,
              }}>

              <EditorCanvas
                imageUri={editor.imageUri}
                canvasSize={CANVAS_PREVIEW_SIZE}
                overlayText={editor.overlayText}
                fontSize={editor.fontSize}
                textPosition={editor.textPosition}
                showOverlayText={
                  editor.showOverlayText
                }
                onDragStart={
                  editor.startDragging
                }
                onDrag={
                  editor.updateTextPosition
                }
                onDragEnd={
                  editor.finishDragging
                }
                onDelete={
                  editor.deleteOverlayText
                }
                onPressImage={
                  handleChangeImage
                }
              />
            </ViewShot>

            {/* =================================================
                CHANGE BUTTON

                OUTSIDE ViewShot.
                NOT EXPORTED.
                ================================================= */}

            {editor.imageUri && (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleChangeImage}
                style={{
                  position: 'absolute',

                  top: 14,
                  right: 10,

                  paddingHorizontal: 16,
                  paddingVertical: 10,

                  borderRadius: 12,

                  backgroundColor:
                    'rgba(0,0,0,0.62)',

                  zIndex: 500,
                  elevation: 20,
                }}>

                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: '800',
                    color: '#FFFFFF',
                  }}>
                  Change
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* ===================================================
              PREVIEW ACTION ROW

              OUTSIDE ViewShot.
              NOT EXPORTED.
              =================================================== */}

          <View
            style={{
              paddingHorizontal: 18,
              paddingTop: 15,

              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>

            <Text
              style={{
                fontSize: 28,
                color: colors.text,
              }}>
              ♡
            </Text>

            <Text
              style={{
                fontSize: 26,
                color: colors.text,
              }}>
              ♧
            </Text>

            <Text
              style={{
                fontSize: 28,
                color: colors.text,
              }}>
              ➤
            </Text>

            <View
              style={{
                flex: 1,
              }}
            />

            <Text
              style={{
                fontSize: 25,
                color: colors.text,
              }}>
              ♧
            </Text>
          </View>

          {/* ===================================================
              PREVIEW CAPTION

              NOT EXPORTED.
              =================================================== */}

          <View
            style={{
              paddingHorizontal: 18,
              paddingTop: 13,
              paddingBottom: 18,
            }}>

            <Text
              numberOfLines={2}
              style={{
                fontSize: 13,
                lineHeight: 19,
                color: colors.text,
              }}>

              <Text
                style={{
                  fontWeight: '900',
                }}>
                your_business
              </Text>

              {' '}

              {editor.postCaption}
            </Text>
          </View>
        </View>

        {/* =====================================================
            DRAG INSTRUCTION
            ===================================================== */}

    

        {/* =====================================================
            ADD IMAGE

            Only shown before an image is selected.
            ===================================================== */}



        {/* =====================================================
            TEXT CONTROLS
            ===================================================== */}

        {editor.imageUri && (
          <TextControls
            text={editor.overlayText}
            fontSize={editor.fontSize}
            onChangeText={
              editor.updateOverlayText
            }
            onDecrease={
              editor.decreaseFontSize
            }
            onIncrease={
              editor.increaseFontSize
            }
          />
        )}

        {/* =====================================================
            INSTAGRAM POST CAPTION
            ===================================================== */}

        {editor.imageUri && (
          <View
            style={{
              marginTop: 16,
            }}>

            <CaptionEditor
              caption={editor.postCaption}
              maxLength={2200}
              onChange={
                editor.updatePostCaption
              }
              onFocus={
                handleCaptionFocus
              }
            />
          </View>
        )}

        {/* =====================================================
            EXPORT / SHARE
            ===================================================== */}

        {editor.imageUri && (
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleShare}
            style={{
              marginTop: 18,

              height: 56,

              borderRadius: 16,

              backgroundColor:
                colors.instagram,

              alignItems: 'center',
              justifyContent: 'center',

              shadowColor: '#000',

              shadowOffset: {
                width: 0,
                height: 4,
              },

              shadowOpacity: 0.16,
              shadowRadius: 8,

              elevation: 4,
            }}>

            <Text
              style={{
                fontSize: 16,
                fontWeight: '900',
                color: '#FFFFFF',
              }}>
              Export & Share to Instagram
            </Text>
          </TouchableOpacity>
        )}

        {/* =====================================================
            EXPORT INFORMATION
            ===================================================== */}

        {editor.imageUri && (
          <Text
            style={{
              marginTop: 10,

              fontSize: 11,

              lineHeight: 17,

              color: colors.textMuted,

              textAlign: 'center',
            }}>
            Your image will be exported as a
            full-resolution 1080 × 1080 PNG.
          </Text>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}