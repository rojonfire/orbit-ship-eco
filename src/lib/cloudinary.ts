const CLOUDINARY_CLOUD_NAME = 'sqvx207z';
const CLOUDINARY_UPLOAD_PRESET = 'personalizadas';
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`;

/** Sube un archivo (logo del cliente o captura del mockup) a Cloudinary y devuelve su URL pública. */
export async function uploadToCloudinary(file: File | Blob, folder: string): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
  formData.append('folder', folder);

  const response = await fetch(CLOUDINARY_UPLOAD_URL, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Cloudinary upload failed: ${response.status}`);
  }

  const data = await response.json();
  return data.secure_url as string;
}
