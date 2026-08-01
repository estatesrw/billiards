import { supabase } from "@/integrations/supabase/client";

const BUCKET = "product-images";
const MAX_DIM = 1600;
const SIGNED_TTL = 60 * 60 * 24 * 365 * 10; // 10 years

/** Resize + compress an image in the browser and return a WebP blob. */
export async function optimizeImage(file: File, maxDim = MAX_DIM, quality = 0.9): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height));
  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported");
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(bitmap, 0, 0, w, h);
  bitmap.close?.();
  const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, "image/webp", quality));
  if (!blob) throw new Error("Could not encode image");
  return blob;
}

/** Optimize (resize → compress → WebP) then upload and return a durable URL. */
export async function uploadOptimizedImage(file: File): Promise<string> {
  const blob = await optimizeImage(file);
  const path = `${crypto.randomUUID()}.webp`;
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, blob, { contentType: "image/webp", cacheControl: "31536000", upsert: false });
  if (error) throw error;
  const { data, error: signErr } = await supabase.storage.from(BUCKET).createSignedUrl(path, SIGNED_TTL);
  if (signErr || !data?.signedUrl) throw signErr ?? new Error("Could not create image URL");
  return data.signedUrl;
}
