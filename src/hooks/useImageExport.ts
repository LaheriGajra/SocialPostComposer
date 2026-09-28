import {
  RefObject,
  useCallback,
  useState,
} from 'react';

import {captureRef} from 'react-native-view-shot';

import {
  CANVAS_OUTPUT_SIZE,
} from '../utils/editor';

export function useImageExport(
  canvasRef: RefObject<any>,
) {
  const [isExporting, setIsExporting] =
    useState(false);

  const exportImage =
    useCallback(async () => {
      if (!canvasRef.current) {
        throw new Error(
          'Canvas reference is not available.',
        );
      }

      try {
        setIsExporting(true);

        const uri =
          await captureRef(
            canvasRef.current,
            {
              format: 'png',

              quality: 1,

              width:
                CANVAS_OUTPUT_SIZE,

              height:
                CANVAS_OUTPUT_SIZE,

              result: 'tmpfile',
            },
          );

        return uri;
      } finally {
        setIsExporting(false);
      }
    }, [canvasRef]);

  return {
    isExporting,
    exportImage,
  };
}