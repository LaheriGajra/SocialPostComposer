export interface TextPosition {
  x: number;
  y: number;
}

export interface ImagePickerResult {
  uri: string | null;
  width?: number;
  height?: number;
  error?: string;
}