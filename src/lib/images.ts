// Centralized image URLs — high-quality stock photography from Unsplash.
// Using direct CDN URLs (no build-time import) so we can swap without touching call sites.

const u = (id: string, w = 1600) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

// Hero — dramatic billiards / pool table scene
export const heroTable = u("photo-1615722440048-da4fd9202483", 1920);

// Products
export const productPool = u("photo-1552196563-55cd4e45efb3");
export const productSnooker = u("photo-1594736797933-d0401ba2fe65");
export const productCarom = u("photo-1611195974226-a6a9be9dd763");
export const productCues = u("photo-1519892300165-cb5542fb47c7");

// Projects — hospitality, bar, club interiors
export const projectHotel = u("photo-1566073771259-6a8506099945");
export const projectBar = u("photo-1470337458703-46ad1756a187");
export const projectClub = u("photo-1572116469696-31de0f17cc34");

// Gallery — assorted billiards / interiors
export const gallery1 = u("photo-1626251438758-e9e320f30c22");
export const gallery2 = u("photo-1615394073837-3f2f4a4b6863");
export const gallery3 = u("photo-1606167668584-78701c57f13d");
export const gallery4 = u("photo-1600891964092-4316c288032e");

// Fallback used across cart/checkout/account when a product has no image
export const fallbackProduct = productPool;