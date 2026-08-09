// Centralized image URLs — real product photography uploaded to the asset CDN.
// Swap here to change art in one spot across the whole site.

import { assetUrl } from "./asset-url";
import heroBalls from "@/assets/hero-pool-balls.jpg.asset.json";
import luxuryPool from "@/assets/luxury-pool.jpg.asset.json";
import modernBlackPool from "@/assets/modern-black-pool.jpg.asset.json";
import silverPool from "@/assets/silver-pool.jpg.asset.json";
import cuesAccessories from "@/assets/cues-accessories.webp.asset.json";
import accessoriesKit from "@/assets/accessories-kit.jpg.asset.json";
import projectOutdoor from "@/assets/project-outdoor.jpg.asset.json";
import projectLed from "@/assets/project-led.jpg.asset.json";

// Hero — dramatic billiards / pool table scene
export const heroTable = assetUrl(heroBalls.url);

// Products
export const productPool = assetUrl(luxuryPool.url);
export const productSnooker = assetUrl(modernBlackPool.url);
export const productCarom = assetUrl(cuesAccessories.url);
export const productCues = assetUrl(accessoriesKit.url);

// Projects — hospitality, bar, club interiors
export const projectHotel = assetUrl(projectOutdoor.url);
export const projectBar = assetUrl(projectLed.url);
export const projectClub = assetUrl(silverPool.url);

// Gallery — assorted billiards / interiors
export const gallery1 = assetUrl(heroBalls.url);
export const gallery2 = assetUrl(luxuryPool.url);
export const gallery3 = assetUrl(silverPool.url);
export const gallery4 = assetUrl(modernBlackPool.url);

// Fallback used across cart/checkout/account when a product has no image
export const fallbackProduct = assetUrl(luxuryPool.url);