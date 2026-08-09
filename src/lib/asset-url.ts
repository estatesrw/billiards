// Assets live on Lovable's asset CDN at /__l5e/assets-v1/*. When the site is
// served through an external host/proxy (e.g. a custom domain on another
// provider), that path isn't proxied — so always use the absolute, immutable
// Lovable asset host for these URLs.
const ASSET_HOST = "https://project--4b575a98-afed-4a82-840c-6ca24d958776.lovable.app";

export function assetUrl(url: string): string {
  return url.startsWith("/__l5e/") ? ASSET_HOST + url : url;
}
