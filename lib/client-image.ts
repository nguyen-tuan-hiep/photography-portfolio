const TARGET_SIZE = 9 * 1024 * 1024;
const MAX_DIMENSION = 4000;

export async function optimizeForCloudinary(file: File) {
  if (file.size <= TARGET_SIZE) return file;

  const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const context = canvas.getContext("2d");
  if (!context) throw new Error(`Could not process ${file.name}.`);

  context.fillStyle = "#fff";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  let quality = 0.88;
  let blob: Blob | null = null;
  do {
    blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", quality));
    quality -= 0.1;
  } while (blob && blob.size > TARGET_SIZE && quality >= 0.48);

  if (!blob || blob.size > TARGET_SIZE) {
    throw new Error(`${file.name} could not be reduced below Cloudinary's 10 MB limit.`);
  }
  return new File([blob], file.name.replace(/\.[^.]+$/, ".jpg"), {
    type: "image/jpeg",
    lastModified: file.lastModified,
  });
}
