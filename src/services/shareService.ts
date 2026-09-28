import Share from 'react-native-share';
import type {ShareSingleOptions} from 'react-native-share';

export async function shareToInstagram(
  fileUri: string,
): Promise<void> {
  const normalizedUri = fileUri.startsWith('file://')
    ? fileUri
    : `file://${fileUri}`;

  const options: ShareSingleOptions = {
    social: 'instagram' as any,
    url: normalizedUri,
    type: 'image/png',
    title: 'PostPilot',
    forceDialog: false,
    useInternalStorage: true,
  };

  await Share.shareSingle(options);
}