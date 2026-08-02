/** Format a cents amount as Rwandan Francs (RWF has no minor units). */
export function money(cents: number): string {
  return `RWF ${Math.round(cents / 100).toLocaleString("en-US")}`;
}

export const CURRENCY = "RWF";
