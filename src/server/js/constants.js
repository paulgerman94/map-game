import { km } from "./units";
export const POI_RADIUS = 0.8 * km;
export const EARTH_RADIUS = 6371 * km;
/* Note that this is a SQL `interval` type , which is why it doesn't say `24 * h` */
export const OWNERSHIP_PROTECTION_TIME = "24 h";