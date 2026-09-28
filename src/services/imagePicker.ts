import {launchImageLibrary} from 'react-native-image-picker';

import {
  ImagePickerResult,
} from '../types/editor';

import {
  MIN_SOURCE_IMAGE_SIZE,
} from '../utils/editor';

export async function pickImage(): Promise<ImagePickerResult> {
  try {
    const response = await launchImageLibrary({
      mediaType: 'photo',
      selectionLimit: 1,
      quality: 1,
    });

    if (response.didCancel) {
      return {
        uri: null,
      };
    }

    if (response.errorCode) {
      return {
        uri: null,
        error:
          response.errorMessage ||
          `Image picker error: ${response.errorCode}`,
      };
    }

    const asset = response.assets?.[0];

    if (!asset?.uri) {
      return {
        uri: null,
        error: 'Unable to read the selected image.',
      };
    }

    const width = asset.width ?? 0;
    const height = asset.height ?? 0;

    if (
      width < MIN_SOURCE_IMAGE_SIZE ||
      height < MIN_SOURCE_IMAGE_SIZE
    ) {
      return {
        uri: null,
        error:
          'Please choose an image with at least 1080 × 1080 resolution.',
      };
    }

    return {
      uri: asset.uri,
      width,
      height,
    };
  } catch (error) {
    console.error(
      'Image picker error:',
      error,
    );

    return {
      uri: null,
      error:
        'Unable to open the image picker.',
    };
  }
}