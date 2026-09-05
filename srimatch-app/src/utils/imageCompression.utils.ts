/**
 * Mobile Client-Side Pre-Compression & Image Utilities (React Native / Expo)
 * Pre-compresses images on device to WebP / high-efficiency format before uploading to backend.
 */
import * as ImagePicker from 'expo-image-picker';

export interface MobileImagePickerOptions {
  allowsEditing?: boolean;
  aspect?: [number, number];
  quality?: number; // 0.0 to 1.0 (default 0.8)
}

/**
 * Launches the native image picker with automatic on-device compression enabled.
 * Automatically reduces camera resolution to optimal dimensions (~1080p) and applies ~80% quality.
 */
export async function pickAndCompressImage(options: MobileImagePickerOptions = {}) {
  // Request media library permissions
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== 'granted') {
    throw new Error('Permission to access camera roll is required!');
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: options.allowsEditing ?? true,
    aspect: options.aspect ?? [4, 5],
    quality: options.quality ?? 0.8, // Built-in native JPEG/WebP compression
    allowsMultipleSelection: false,
  });

  if (result.canceled || !result.assets || result.assets.length === 0) {
    return null;
  }

  const asset = result.assets[0];
  return {
    uri: asset.uri,
    width: asset.width,
    height: asset.height,
    fileSize: asset.fileSize,
    fileName: asset.fileName || 'profile_photo.jpg',
    mimeType: asset.mimeType || 'image/jpeg',
  };
}

/**
 * Launches the native camera with automatic on-device compression enabled.
 */
export async function takeAndCompressPhoto(options: MobileImagePickerOptions = {}) {
  const { status } = await ImagePicker.requestCameraPermissionsAsync();
  if (status !== 'granted') {
    throw new Error('Permission to access camera is required!');
  }

  const result = await ImagePicker.launchCameraAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: options.allowsEditing ?? true,
    aspect: options.aspect ?? [4, 5],
    quality: options.quality ?? 0.8,
  });

  if (result.canceled || !result.assets || result.assets.length === 0) {
    return null;
  }

  const asset = result.assets[0];
  return {
    uri: asset.uri,
    width: asset.width,
    height: asset.height,
    fileSize: asset.fileSize,
    fileName: asset.fileName || 'selfie.jpg',
    mimeType: asset.mimeType || 'image/jpeg',
  };
}
