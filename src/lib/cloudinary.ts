const CLOUDINARY_CLOUD_NAME = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME!;
const CLOUDINARY_UPLOAD_PRESET = process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;

export type UploadType = 'image' | 'video' | 'audio';

export async function uploadToCloudinary(
  uri: string,
  type: UploadType,
): Promise<{ url: string; thumbnailUrl?: string }> {
  const formData = new FormData();

  const filename = uri.split('/').pop() ?? 'upload';
  const mimeMap: Record<UploadType, string> = {
    image: 'image/jpeg',
    video: 'video/mp4',
    audio: 'audio/m4a',
  };

  // @ts-ignore — React Native FormData accepts this shape
  formData.append('file', { uri, name: filename, type: mimeMap[type] });
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
  formData.append('resource_type', type === 'audio' ? 'video' : type);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/${type === 'audio' ? 'video' : type}/upload`,
    { method: 'POST', body: formData },
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Cloudinary upload failed: ${err}`);
  }

  const data = await res.json();

  let thumbnailUrl: string | undefined;
  if (type === 'video') {
    thumbnailUrl = data.secure_url
      .replace(/\.[^.]+$/, '.jpg')
      .replace('/video/', '/image/');
  }

  return { url: data.secure_url, thumbnailUrl };
}
