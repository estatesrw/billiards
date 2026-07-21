// Centralized image URLs — real product photography uploaded to the asset CDN.
// Swap here to change art in one spot across the whole site.

import heroBalls from "@/assets/hero-pool-balls.jpg.asset.json";
import luxuryPool from "@/assets/luxury-pool.jpg.asset.json";
import modernBlackPool from "@/assets/modern-black-pool.jpg.asset.json";
import silverPool from "@/assets/silver-pool.jpg.asset.json";
import cuesAccessories from "@/assets/cues-accessories.webp.asset.json";
import accessoriesKit from "@/assets/accessories-kit.jpg.asset.json";
import projectOutdoor from "@/assets/project-outdoor.jpg.asset.json";
import projectLed from "@/assets/project-led.jpg.asset.json";

// Hero — dramatic billiards / pool table scene
export const heroTable = heroBalls.url;

// Products
export const productPool = luxuryPool.url;
export const productSnooker = modernBlackPool.url;
export const productCarom = cuesAccessories.url;
export const productCues = accessoriesKit.url;

// Projects — hospitality, bar, club interiors
export const projectHotel = projectOutdoor.url;
export const projectBar = projectLed.url;
export const projectClub = silverPool.url;

// Gallery — assorted billiards / interiors
export const gallery1 = heroBalls.url;
export const gallery2 = luxuryPool.url;
export const gallery3 = silverPool.url;
export const gallery4 = modernBlackPool.url;

// Fallback used across cart/checkout/account when a product has no image
export const fallbackProduct = luxuryPool.url;